<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Identiies\StudentMaster;
use Illuminate\Http\Request;

class NipdVerificationController extends Controller
{
    public function verify(Request $request)
    {
        $request->validate(['nipd' => ['required', 'string']]);

        $studentMaster = StudentMaster::where('nipd', $request->nipd)->first();
        if (!$studentMaster) return response()->json(['message' => 'NIPD not found'], 404);
        if ($studentMaster->student()->exists()) return response()->json(['message' => 'NIPD already registered'], 409);

        return response()->json([
            'student_master_id' => $studentMaster->id,
            'name'              => $studentMaster->name,
            'class_name'        => $studentMaster->class_name,
        ]);
    }
}