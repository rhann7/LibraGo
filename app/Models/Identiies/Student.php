<?php

namespace App\Models\Identiies;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Student extends Model
{
    protected $fillable = ['user_id', 'student_master_id', 'avatar', 'bio'];

    public function user() { return $this->belongsTo(User::class); }
    public function studentMaster() { return $this->belongsTo(StudentMaster::class); }

    public function getAvatarUrlAttribute() { return $this->avatar ? Storage::url($this->avatar) : null; }
}