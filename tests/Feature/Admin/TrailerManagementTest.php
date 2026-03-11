<?php

use App\Models\Trailer;
use App\Models\User;
use Database\Seeders\RolesAndPermissionsSeeder;
use Illuminate\Support\Str;

beforeEach(function () {
    $this->seed(RolesAndPermissionsSeeder::class);
});

function makeAdmin(): User
{
    $admin = User::factory()->create([
        'email' => 'admin-'.Str::uuid().'@example.com',
        'name' => 'Admin Test',
    ]);
    $admin->assignRole('admin');

    return $admin;
}

function makeNonAdminUser(): User
{
    $user = User::factory()->create([
        'email' => 'user-'.Str::uuid().'@example.com',
        'name' => 'Regular User',
    ]);
    $user->assignRole('user');

    return $user;
}

function createTrailerData(): array
{
    return [
        'fleet_number' => 'T'.str_pad((string) rand(1, 99), 2, '0', STR_PAD_LEFT),
        'registration_number' => 'CA'.rand(10000, 99999),
        'brand_name' => 'Volvo',
        'axles_amount' => 2,
        'license_expiry_date' => now()->addYear()->format('Y-m-d'),
    ];
}

describe('Trailer Controller', function () {
    it('allows admin to list trailers', function () {
        $admin = makeAdmin();
        Trailer::factory()->count(3)->create();

        $response = $this->actingAs($admin)
            ->get(route('admin.trailers.index'))
            ->assertOk();

        $response->assertInertia(fn ($page) => $page->has('trailers.data'));
    });

    it('allows non-admin to list trailers', function () {
        $user = makeNonAdminUser();
        Trailer::factory()->count(2)->create();

        $this->actingAs($user)
            ->get(route('admin.trailers.index'))
            ->assertOk();
    });

    it('allows admin to view trailer details', function () {
        $admin = makeAdmin();
        $trailer = Trailer::factory()->create();

        $this->actingAs($admin)
            ->get(route('admin.trailers.show', $trailer))
            ->assertOk();
    });

    it('allows non-admin to view trailer details', function () {
        $user = makeNonAdminUser();
        $trailer = Trailer::factory()->create();

        $this->actingAs($user)
            ->get(route('admin.trailers.show', $trailer))
            ->assertOk();
    });

    it('allows admin to access create page', function () {
        $admin = makeAdmin();

        $this->actingAs($admin)
            ->get(route('admin.trailers.create'))
            ->assertOk();
    });

    it('denies non-admin from accessing create page', function () {
        $user = makeNonAdminUser();

        $this->actingAs($user)
            ->get(route('admin.trailers.create'))
            ->assertForbidden();
    });

    it('allows admin to create a trailer', function () {
        $admin = makeAdmin();
        $data = createTrailerData();

        $this->actingAs($admin)
            ->post(route('admin.trailers.store'), $data)
            ->assertRedirect(route('admin.trailers.index'));

        $this->assertDatabaseHas('trailers', [
            'fleet_number' => $data['fleet_number'],
            'registration_number' => $data['registration_number'],
            'brand_name' => $data['brand_name'],
        ]);
    });

    it('denies non-admin from creating a trailer', function () {
        $user = makeNonAdminUser();
        $data = createTrailerData();

        $this->actingAs($user)
            ->post(route('admin.trailers.store'), $data)
            ->assertForbidden();
    });

    it('allows admin to access edit page', function () {
        $admin = makeAdmin();
        $trailer = Trailer::factory()->create();

        $this->actingAs($admin)
            ->get(route('admin.trailers.edit', $trailer))
            ->assertOk();
    });

    it('denies non-admin from accessing edit page', function () {
        $user = makeNonAdminUser();
        $trailer = Trailer::factory()->create();

        $this->actingAs($user)
            ->get(route('admin.trailers.edit', $trailer))
            ->assertForbidden();
    });

    it('allows admin to update a trailer', function () {
        $admin = makeAdmin();
        $trailer = Trailer::factory()->create();
        $data = [
            'fleet_number' => $trailer->fleet_number,
            'registration_number' => $trailer->registration_number,
            'brand_name' => 'Updated Brand',
            'axles_amount' => 3,
            'license_expiry_date' => now()->addYear()->format('Y-m-d'),
        ];

        $this->actingAs($admin)
            ->put(route('admin.trailers.update', $trailer), $data)
            ->assertRedirect(route('admin.trailers.show', $trailer));

        $trailer->refresh();
        expect($trailer->brand_name)->toBe('Updated Brand');
        expect($trailer->axles_amount)->toBe(3);
    });

    it('denies non-admin from updating a trailer', function () {
        $user = makeNonAdminUser();
        $trailer = Trailer::factory()->create();
        $data = createTrailerData();

        $this->actingAs($user)
            ->put(route('admin.trailers.update', $trailer), $data)
            ->assertForbidden();
    });

    it('allows admin to delete a trailer (soft delete)', function () {
        $admin = makeAdmin();
        $trailer = Trailer::factory()->create();

        $this->actingAs($admin)
            ->delete(route('admin.trailers.destroy', $trailer))
            ->assertRedirect(route('admin.trailers.index'));

        $trailer->refresh();
        expect($trailer->deleted_at)->not->toBeNull();
    });

    it('denies non-admin from deleting a trailer', function () {
        $user = makeNonAdminUser();
        $trailer = Trailer::factory()->create();

        $this->actingAs($user)
            ->delete(route('admin.trailers.destroy', $trailer))
            ->assertForbidden();
    });

    it('allows admin to restore a deleted trailer', function () {
        $admin = makeAdmin();
        $trailer = Trailer::factory()->create();
        $trailer->delete();

        $this->actingAs($admin)
            ->post(route('admin.trailers.restore', $trailer))
            ->assertRedirect(route('admin.trailers.index'));

        $trailer->refresh();
        expect($trailer->deleted_at)->toBeNull();
    });

    it('allows admin to permanently delete a trailer', function () {
        $admin = makeAdmin();
        $trailer = Trailer::factory()->create();

        $this->actingAs($admin)
            ->delete(route('admin.trailers.force-delete', $trailer))
            ->assertRedirect(route('admin.trailers.index'));

        $this->assertDatabaseMissing('trailers', ['id' => $trailer->id]);
    });

    it('allows admin to bulk delete trailers', function () {
        $admin = makeAdmin();
        $trailers = Trailer::factory()->count(3)->create();
        $ids = $trailers->pluck('id')->toArray();

        $this->actingAs($admin)
            ->post(route('admin.trailers.bulk'), [
                'action' => 'delete',
                'ids' => $ids,
            ])
            ->assertRedirect(route('admin.trailers.index'));

        foreach ($trailers as $trailer) {
            $trailer->refresh();
            expect($trailer->deleted_at)->not->toBeNull();
        }
    });

    it('allows admin to bulk restore trailers', function () {
        $admin = makeAdmin();
        $trailers = Trailer::factory()->count(2)->create();
        $trailers->each(fn ($t) => $t->delete());
        $ids = $trailers->pluck('id')->toArray();

        $this->actingAs($admin)
            ->post(route('admin.trailers.bulk'), [
                'action' => 'restore',
                'ids' => $ids,
            ])
            ->assertRedirect(route('admin.trailers.index'));

        foreach ($trailers as $trailer) {
            $trailer->refresh();
            expect($trailer->deleted_at)->toBeNull();
        }
    });

    it('validates trailer creation data', function () {
        $admin = makeAdmin();

        $this->actingAs($admin)
            ->post(route('admin.trailers.store'), [])
            ->assertSessionHasErrors(['fleet_number', 'registration_number', 'brand_name', 'axles_amount', 'license_expiry_date']);
    });

    it('validates unique fleet number', function () {
        $admin = makeAdmin();
        $existing = Trailer::factory()->create(['fleet_number' => 'T01']);
        $data = createTrailerData();
        $data['fleet_number'] = 'T01';

        $this->actingAs($admin)
            ->post(route('admin.trailers.store'), $data)
            ->assertSessionHasErrors(['fleet_number']);
    });

    it('validates unique registration number', function () {
        $admin = makeAdmin();
        $existing = Trailer::factory()->create(['registration_number' => 'CA99999']);
        $data = createTrailerData();
        $data['registration_number'] = 'CA99999';

        $this->actingAs($admin)
            ->post(route('admin.trailers.store'), $data)
            ->assertSessionHasErrors(['registration_number']);
    });

    it('allows same fleet number on update for same trailer', function () {
        $admin = makeAdmin();
        $trailer = Trailer::factory()->create(['fleet_number' => 'T01']);
        $data = [
            'fleet_number' => 'T01',
            'registration_number' => $trailer->registration_number,
            'brand_name' => 'Volvo',
            'axles_amount' => 2,
            'license_expiry_date' => now()->addYear()->format('Y-m-d'),
        ];

        $this->actingAs($admin)
            ->put(route('admin.trailers.update', $trailer), $data)
            ->assertSessionHasNoErrors();
    });
});
