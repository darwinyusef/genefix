<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/login', function () {
    return response()->json(['message' => 'Not logged in.'], 401);
})->name('login');


Route::get('/subir', function () {
    return view('subir');
})->name('formulario.archivo');