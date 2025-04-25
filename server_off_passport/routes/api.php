<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CausacionContableController;
use App\Http\Controllers\ContableController;
use App\Http\Controllers\PasswordResetController;
use Illuminate\Support\Facades\Route;

Route::post('/check-document', [AuthController::class, 'checkDocument']);
Route::post('/active-user', [AuthController::class, 'activeUser']);
Route::post('/login', [AuthController::class, 'login']);



Route::post('/register', [AuthController::class, 'register']);
Route::get('/register-service', [AuthController::class, 'serviceRegister']);

Route::post('/password/email', [PasswordResetController::class, 'sendResetLinkEmail']);
Route::post('/password/reset', [PasswordResetController::class, 'resetPassword']);
Route::post('/forgot-username', [PasswordResetController::class, 'forgotUsername']);
// Route::post('/causacion-contable', [ContableController::class, 'store']);

Route::post('/subir', [CausacionContableController::class, 'sendingFile'])->name('sending.archivo');

Route::get('/fileroute', [CausacionContableController::class, 'getRoute'])->name('get.route');
Route::get('/nit', [ContableController::class, 'nitFilter'])->name('get.nit.filter');

Route::middleware('auth:api')->group(function () {
    Route::apiResource('causacion-contable', CausacionContableController::class);
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    // Aquí puedes definir otras rutas protegidas por autenticación
});
