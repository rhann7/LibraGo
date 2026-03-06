<?php

namespace App\Models\Identiies;

use Illuminate\Database\Eloquent\Model;

class StudentMaster extends Model
{
    protected $fillable = ['nipd', 'name', 'class_name'];

    public function student() { return $this->hasOne(Student::class); }
}