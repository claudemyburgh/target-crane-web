<?php

namespace App\Http\Controllers\Frontend;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Laravel\Fortify\Features;

class HomeIndexController extends Controller
{
    public function __invoke()
    {

        return Inertia::render('frontend/home', [
            'canRegister' => Features::enabled(Features::registration()),
        ]);
    }
}
