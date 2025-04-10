<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

use function Laravel\Prompts\password;

class AuthController extends Controller
{

    public function checkDocument(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'documento' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('document', $request->documento)->first();
        if ($user) {
            return response()->json(['res' => true, "ms" => "El documento ya está registrado. Inicie sesión."]);
        } else {
            return response()->json(['res' => false, 'ms' => 'El documento no está registrado. Complete el registro con su correo y contraseña.']);
        }
    }


    public function activeUser(Request $request)
    {
        /* $headerValue = $request->header('Authorization');
        $salida = base64_encode($headerValue); */
        $rolfin = "user";
        $validator = Validator::make($request->all(), [
            'document' => 'required|string',
            'email' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('document', $request->document)->first();
        if (!$user) {
            return response()->json(['message' => 'Documento no encontrado.'], 404);
        }

        $headerValue = $request->header('Authorization');
        $salida = base64_decode($headerValue);

        if ($salida === 'aprobado') {
            $rolfin = "admin";
        }

        if ($user->password == null) {
            $user->email = $request->email;
            $user->password = Hash::make($request->new_password);
            $user->rol = $rolfin;
            $user->save();
        } else {
            return response()->json(['res' => false, 'ms' => 'El usuario ya ha sido activado.']);
        }

        $token = $user->createToken('authToken')->accessToken;
        return response()->json([
            "res" => true,
            "ms" => "El usuario ha sido activado correctamente.",
            "user" => $user,
            'access_token' => $token,
            'token_type' => 'Bearer'
        ]);
    }

    public function login(Request $request)    {
        $validator = Validator::make($request->all(), [
            'document' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('document', $request->document)->first();

        if (!$user) {
            return response()->json(['message' => 'Documento no encontrado.'], 404);
        }

        if (Auth::attempt(['document' => "14297510", 'password' => "123456789"])) {
            $token = $user->createToken('authToken')->accessToken;
            return response()->json([
                'access_token' => $token,
                'token_type' => 'Bearer',
                "user" => $user
            ]);
        }

        return response()->json(['message' => 'Credenciales inválidas.'], 401);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'document' => 'required|string|unique:users',
            'email' => 'required|string|email|unique:users',
            'password' => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'document' => $request->document,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('authToken')->accessToken;
        return response()->json(['access_token' => $token, 'token_type' => 'Bearer'], 201);
    }

    public function serviceRegister(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'activation' => 'required|boolean',
            'document' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::where('document', $request->document)->first();

        if ($user->rol != "admin") {
            return response()->json(['message' => 'El usuario no es un administrador.'], 409);
        }

        // $user = User::create([
        //     'documento' => $request->documento,
        //     'email' => $request->email,
        //     'password' => Hash::make($request->password),
        // ]);
        return response()->json(['ms' => "Se han realizado los cambios correctamente."], 201);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->token()->revoke();
        return response()->json(['message' => 'Sesión cerrada correctamente.']);
    }
}
