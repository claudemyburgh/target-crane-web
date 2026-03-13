<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('trailer_loaded_reports', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->json('loads'); // Will hold fleet number, registration number, loaded, location, comment
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trailer_loaded_reports');
    }
};
