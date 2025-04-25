<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CausacionContable;
use Faker\Factory as Faker;

class CausacionContableSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        for ($i = 0; $i < 100; $i++) {
            CausacionContable::create([
                'id_comprobante' => $faker->numberBetween(1, 50),
                'id_nit' => $faker->numberBetween(1, 1000),
                'fecha' => $faker->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
                'fecha_manual' => $faker->dateTimeBetween('-6 months', 'now')->format('Y-m-d'),
                'id_cuenta' => $faker->numberBetween(1000, 9999),
                'valor' => $faker->randomFloat(2, 1000, 50000),
                'tipo' => 1,
                'concepto' => $faker->sentence(),
                'documento_referencia' => $faker->optional()->uuid(),
                'token' => $faker->optional()->sha256,
                'extra' => $faker->optional()->text(50),
                'estado' => "entregado",
                'user_id' => $faker->numberBetween(3, 4) // Cambiá esto si querés usar otro usuario
            ]);
        }
    }
}
