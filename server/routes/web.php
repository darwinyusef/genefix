<?php

/** @var \Laravel\Lumen\Routing\Router $router */

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CausacionContableController;
use App\Http\Controllers\ContableController;
use App\Http\Controllers\PasswordResetController;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return response()->json([
        "error" => "Bienvenido a nuestra API Dios Consejero",
        "authorization" => "Usted no tiene permisos",
        "code" => 404
    ], 404);
});

// Rutas públicas
$router->post('/check-document', 'AuthController@checkDocument');
$router->post('/active-user', 'AuthController@activeUser');
$router->post('/login', 'AuthController@login');
$router->post('/register', 'AuthController@register');
$router->get('/register-service', 'AuthController@serviceRegister');

$router->post('/password/email', 'PasswordResetController@sendResetLinkEmail');
$router->post('/password/reset', 'PasswordResetController@resetPassword');
$router->post('/forgot-username', 'PasswordResetController@forgotUsername');

// Ruta POST comentada que usaba Passport (de momento desactivada)
// $router->post('/causacion-contable', 'ContableController@store');

$router->post('/subir', ['uses' => 'CausacionContableController@sendingFile', 'as' => 'sending.archivo']);
$router->get('/fileroute', ['uses' => 'CausacionContableController@getRoute', 'as' => 'get.route']);
$router->get('/nit', ['uses' => 'ContableController@nitFilter', 'as' => 'get.nit.filter']);

// Rutas protegidas (JWT)
$router->group(['middleware' => 'auth'], function () use ($router) {
    $router->get('/user', 'AuthController@user');
    $router->post('/logout', 'AuthController@logout');

    // En Lumen no hay apiResource directamente, hay que declararlas una por una
    $router->get('/causacion-contable', 'CausacionContableController@index');
    $router->post('/causacion-contable', 'CausacionContableController@store');
    $router->get('/causacion-contable/{id}', 'CausacionContableController@show');
    $router->put('/causacion-contable/{id}', 'CausacionContableController@update');
    $router->delete('/causacion-contable/{id}', 'CausacionContableController@destroy');
});
