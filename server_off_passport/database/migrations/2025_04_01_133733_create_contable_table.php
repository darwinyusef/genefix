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
        Schema::create('documentos', function (Blueprint $table) {
            $table->id();
            $table->string('id_documento');
            $table->integer('id_comprobante');
            $table->integer('id_nit');
            $table->dateTime('fecha');
            $table->date('fecha_manual');
            $table->integer('id_cuenta');
            $table->decimal('valor', 15, 2);
            $table->integer('tipo');
            $table->text('concepto');
            $table->string('documento_referencia');
            $table->string('token');
            $table->string('extra');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contable');
    }
};
