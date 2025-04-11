<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Contable;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ContableController extends Controller
{
    public function store(Request $request)
    {
        // Validar la API_KEY
        if ($request->query('key') !== env('API_KEY')) {
            return response()->json(['error' => 'API_KEY inválida'], 403);
        }

        // Validar que el campo 'documents' exista y sea una cadena JSON válida
        $validator = Validator::make($request->all(), [
            'documents' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => 'Campo "documents" faltante o inválido'], 400);
        }

        // Decodificar la cadena JSON del campo 'documents'
        $documentosData = json_decode($request->input('documents'), true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return response()->json(['error' => 'Error al decodificar JSON: ' . json_last_error_msg()], 400);
        }

        // Procesar y almacenar cada documento en la base de datos
        foreach ($documentosData as $documentoData) {
            Contable::create([
                'id_documento' => $documentoData['id_documento'],
                'id_comprobante' => $documentoData['id_comprobante'],
                'id_nit' => $documentoData['id_nit'],
                'fecha' => $documentoData['fecha'],
                'fecha_manual' => $documentoData['fecha_manual'],
                'id_cuenta' => $documentoData['id_cuenta'],
                'valor' => $documentoData['valor'],
                'tipo' => $documentoData['tipo'],
                'concepto' => $documentoData['concepto'],
                'documento_referencia' => $documentoData['documento_referencia'],
                'token' => $documentoData['token'],
                'extra' => $documentoData['extra'],
            ]);
        }

        return response()->json(['message' => 'Documentos procesados y almacenados exitosamente.'], 201);
    }

    public function enviarDocumentos(Request $request)
    {
        // Validar los datos entrantes
        $validator = Validator::make($request->all(), [
            'documents' => 'required|json',
            'bearer_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 400);
        }

        // Obtener los documentos y el token del cuerpo de la solicitud
        $documents = json_decode($request->input('documents'), true);
        $bearerToken = $request->input('bearer_token');

        // Enviar los datos a la API externa
        // $response = Http::withHeaders([
        //     'Authorization' => 'Bearer ' . $bearerToken,
        // ])->attach(
        //     'documents',
        //     json_encode($documents)
        // )->post('http://begranda.com/equilibrium2/public/api/document', [
        //     'key' => env('API_KEY'),
        // ]);

        // Verificar la respuesta de la API externa
        // if ($response->failed()) {
        //     return response()->json(['error' => 'Error al enviar los documentos a la API externa'], $response->status());
        // }
        

        // Almacenar los documentos en la base de datos
        foreach ($documents as $doc) {
            Contable::create($doc);
        }

        return response()->json(['message' => 'Documentos enviados y almacenados exitosamente']);
    }
}
