<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TeacherSeeder extends Seeder
{
    public function run(): void
    {
        $teachers = [
            ['name' => 'Shova Al Marwah',      'nik' => '1991012220130001', 'email' => 'shova.al.marwah@librago.com'],
            ['name' => 'Kasandra Fitriani',    'nik' => '1991012220130002', 'email' => 'kasandra.fitriani@librago.com'],
            ['name' => 'Ageng Subagja',        'nik' => '1991012220130003', 'email' => 'ageng.subagja@librago.com'],
            ['name' => 'Miranda',              'nik' => '1991012220130004', 'email' => 'miranda@librago.com'],
            ['name' => 'Hesti Herawati',       'nik' => '1991012220130005', 'email' => 'hesti.herawati@librago.com'],
            ['name' => 'Dwi Setyo Pambudi',    'nik' => '1991012220130006', 'email' => 'dwi.setyo.pambudi@librago.com'],
            ['name' => 'Sugeng Santoso',       'nik' => '1991012220130007', 'email' => 'sugeng.santoso@librago.com'],
            ['name' => 'Nadya Afriliani',      'nik' => '1991012220130008', 'email' => 'nadya.afriliani@librago.com'],
            ['name' => 'Heni Siswanti',        'nik' => '1991012220130009', 'email' => 'heni.siswanti@librago.com'],
            ['name' => 'Ricky Sudra',          'nik' => '1991012220130010', 'email' => 'ricky.sudra@librago.com'],
            ['name' => 'Furida Siagian',       'nik' => '1991012220130011', 'email' => 'furida.siagian@librago.com'],
            ['name' => 'Abdul Rosyid',         'nik' => '1991012220130012', 'email' => 'abdul.rosyid@librago.com'],
            ['name' => 'Novita Ambarwati',     'nik' => '1991012220130013', 'email' => 'novita.ambarwati@librago.com'],
            ['name' => 'Dziza Firdiani',       'nik' => '1991012220130014', 'email' => 'dziza.firdiani@librago.com'],
            ['name' => 'Mukhtar Gabriel',      'nik' => '1991012220130015', 'email' => 'mukhtar.gabriel@librago.com'],
            ['name' => 'Diva Susilowati',      'nik' => '1991012220130016', 'email' => 'diva.susilowati@librago.com'],
            ['name' => 'Gebi Abda Mahes',      'nik' => '1991012220130017', 'email' => 'gebi.abda.mahes@librago.com'],
            ['name' => 'Ana Susilowati',       'nik' => '1991012220130018', 'email' => 'ana.susilowati@librago.com'],
            ['name' => 'Muchlas Edi',          'nik' => '1991012220130019', 'email' => 'muchlas.edi@librago.com'],
            ['name' => 'Hafizh Fadhlurrohman', 'nik' => '1991012220130020', 'email' => 'hafizh.fadhlurrohman@librago.com'],
            ['name' => 'Fuah',                 'nik' => '1991012220130021', 'email' => 'fuah@librago.com'],
            ['name' => 'Dhani Adhitya',        'nik' => '1991012220130022', 'email' => 'dhani.adhitya@librago.com'],
            ['name' => 'Anisatum Muawanah',    'nik' => '1991012220130023', 'email' => 'anisatum.muawanah@librago.com'],
            ['name' => 'Dwi Setiawan',         'nik' => '1991012220130024', 'email' => 'dwi.setiawan@librago.com'],
            ['name' => 'Ratnawati',            'nik' => '1991012220130025', 'email' => 'ratnawati@librago.com'],
            ['name' => 'Nabila',               'nik' => '1991012220130026', 'email' => 'nabila@librago.com'],
            ['name' => 'Maesitoh Damsik',      'nik' => '1991012220130027', 'email' => 'maesitoh.damsik@librago.com'],
        ];

        foreach ($teachers as $data) {
            $user = User::firstOrCreate(
                ['email' => $data['email']],
                [
                    'name'     => $data['name'],
                    'password' => Hash::make($data['nik']),
                ]
            );

            $user->assignRole('teacher');
            $user->teacher()->firstOrCreate(['nik' => $data['nik']]);
        }
    }
}