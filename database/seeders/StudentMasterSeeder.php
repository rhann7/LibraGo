<?php

namespace Database\Seeders;

use App\Models\Identiies\StudentMaster;
use Illuminate\Database\Seeder;

class StudentMasterSeeder extends Seeder
{
    public function run(): void
    {
        $students = [
            ['nipd' => '232410187', 'name' => 'Adrian Fatih Nur Muhammad',      'class_name' => 'XII RPL 4'],
            ['nipd' => '232410188', 'name' => 'Ahmad Radhwa Supriyadi',         'class_name' => 'XII RPL 4'],
            ['nipd' => '232410189', 'name' => 'Ahza Rafif Kamal',               'class_name' => 'XII RPL 4'],
            ['nipd' => '232410190', 'name' => 'Ali Zavier Haikel Alkatiri',     'class_name' => 'XII RPL 4'],
            ['nipd' => '232410191', 'name' => 'Alisa Normalinda Putri',         'class_name' => 'XII RPL 4'],
            ['nipd' => '232410192', 'name' => 'Andini Azzahra Puspita',         'class_name' => 'XII RPL 4'],
            ['nipd' => '232410193', 'name' => 'Andito Murti Pangdui Hudianto',  'class_name' => 'XII RPL 4'],
            ['nipd' => '232410194', 'name' => 'Anugrah Luhur Pawenang',         'class_name' => 'XII RPL 4'],
            ['nipd' => '232410195', 'name' => 'Arief Dwi Wicaksono',            'class_name' => 'XII RPL 4'],
            ['nipd' => '232410196', 'name' => 'Damar Raditya',                  'class_name' => 'XII RPL 4'],
            ['nipd' => '232410197', 'name' => 'Darrel Dzakwan',                 'class_name' => 'XII RPL 4'],
            ['nipd' => '232410198', 'name' => 'Dhaniswara Fadhlurahman',        'class_name' => 'XII RPL 4'],
            ['nipd' => '232410199', 'name' => 'Dimas Dwi Ananda Putra',         'class_name' => 'XII RPL 4'],
            ['nipd' => '232410200', 'name' => 'Hanif M Yasfa',                  'class_name' => 'XII RPL 4'],
            ['nipd' => '232410201', 'name' => 'Hendra',                         'class_name' => 'XII RPL 4'],
            ['nipd' => '232410202', 'name' => 'Ibnu Tidar Pamungkas',           'class_name' => 'XII RPL 4'],
            ['nipd' => '232410203', 'name' => 'Kafka Sutikno',                  'class_name' => 'XII RPL 4'],
            ['nipd' => '232410204', 'name' => 'Keisha Aurelia Rifai',           'class_name' => 'XII RPL 4'],
            ['nipd' => '232410205', 'name' => 'Keysha Al Hidayah',              'class_name' => 'XII RPL 4'],
            ['nipd' => '232410206', 'name' => 'Maizza Raflee Arviansyah',       'class_name' => 'XII RPL 4'],
            ['nipd' => '232410207', 'name' => 'Muhammad Fathir Abdul Salam',    'class_name' => 'XII RPL 4'],
            ['nipd' => '232410208', 'name' => 'Muhammad Vito Devara Ramadhan',  'class_name' => 'XII RPL 4'],
            ['nipd' => '232410209', 'name' => 'Muhammad Fahri Ramadhan',        'class_name' => 'XII RPL 4'],
            ['nipd' => '232410210', 'name' => 'Muhammad Farrell Raziq',         'class_name' => 'XII RPL 4'],
            ['nipd' => '232410211', 'name' => 'Muhammad Fattah Qawi Zavier',    'class_name' => 'XII RPL 4'],
            ['nipd' => '232410212', 'name' => 'Muhammad Gifari',                'class_name' => 'XII RPL 4'],
            ['nipd' => '232410213', 'name' => 'Muhammad Kemal Yahya',           'class_name' => 'XII RPL 4'],
            ['nipd' => '232410214', 'name' => 'Nadhif Ararya Wiankosasi',       'class_name' => 'XII RPL 4'],
            ['nipd' => '232410215', 'name' => 'Nafisa Yulia Rahmah',            'class_name' => 'XII RPL 4'],
            ['nipd' => '232410216', 'name' => 'Nazzua Aqillah',                 'class_name' => 'XII RPL 4'],
            ['nipd' => '232410217', 'name' => 'Pasha Maulana Akbar',            'class_name' => 'XII RPL 4'],
            ['nipd' => '232410218', 'name' => 'Rai Handitya Musopan',           'class_name' => 'XII RPL 4'],
            ['nipd' => '232410219', 'name' => 'Rajendra Mahadana Wira Desvana', 'class_name' => 'XII RPL 4'],
            ['nipd' => '232410220', 'name' => 'Refalina Cahaya Kamilah',        'class_name' => 'XII RPL 4'],
            ['nipd' => '232410221', 'name' => 'Ridwan Hamid Siregar',           'class_name' => 'XII RPL 4'],
            ['nipd' => '232410222', 'name' => 'Rifqi Agus Pratama',             'class_name' => 'XII RPL 4'],
            ['nipd' => '232410223', 'name' => 'Rizky Oryza Rahmanekha',         'class_name' => 'XII RPL 4'],
            ['nipd' => '232410224', 'name' => 'Syadza Almaqhuirah',             'class_name' => 'XII RPL 4'],
            ['nipd' => '232410225', 'name' => 'Tiara Azita Safitri',            'class_name' => 'XII RPL 4'],
            ['nipd' => '232410226', 'name' => 'Zahra Nur Aini',                 'class_name' => 'XII RPL 4'],
        ];

        foreach ($students as $data) {
            StudentMaster::firstOrCreate(
                ['nipd' => $data['nipd']],
                ['name' => $data['name'], 'class_name' => $data['class_name']]
            );
        }
    }
}