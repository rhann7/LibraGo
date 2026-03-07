<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileDeleteRequest;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    public function edit(Request $request): Response
    {
        $user = $request->user();
        $profile = $user->student ?? $user->teacher;

        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status'          => $request->session()->get('status'),
            'avatar'          => $profile?->avatar_url,
            'bio'             => $profile?->bio,
        ]);
    }

    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->only('name', 'email'));
        if ($request->user()->isDirty('email')) $request->user()->email_verified_at = null;
        $request->user()->save();

        $profile = $request->user()->student ?? $request->user()->teacher;
        if ($profile) {
            if ($request->hasFile('avatar')) {
                if ($profile->avatar) Storage::disk('public')->delete($profile->avatar);
                $profile->avatar = $request->file('avatar')->store('avatars', 'public');
            }

            $profile->bio = $request->input('bio');
            $profile->save();
        }

        return to_route('profile.edit');
    }

    public function destroy(ProfileDeleteRequest $request): RedirectResponse
    {
        $user = $request->user();

        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}