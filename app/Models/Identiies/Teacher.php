<?php

namespace App\Models\Identiies;

use App\Models\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Teacher extends Model
{
    protected $fillable = ['user_id', 'nik', 'avatar', 'bio'];

    public function user() { return $this->belongsTo(User::class); }

    public function getAvatarUrlAttribute() { return $this->avatar ? Storage::url($this->avatar) : null; }
}