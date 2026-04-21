<?php

namespace App\Http\Controllers\Identities;

use App\Http\Controllers\Controller;
use App\Http\Requests\Identities\UserTeacherRequest;
use App\Models\Identiies\Teacher;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TeacherController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('role:admin'),
        ];
    }

    public function index(Request $request)
    {
        return Inertia::render('identities/teachers/index', [
            'teachers' => $this->getTeachers($request->search),
            'filters'  => $request->only('search'),
        ]);
    }

    public function store(UserTeacherRequest $request)
    {
        $data = $request->validated();

        DB::transaction(function () use ($data) {
            $user = User::create([
                'name'     => $data['name'],
                'email'    => $data['email'],
                'password' => $data['password'],
            ]);

            $user->assignRole('teacher');
            $user->teacher()->create(['nik' => $data['nik']]);
        });

        return to_route('teachers.index')->with('success', 'Teacher created successfully');
    }

    public function update(UserTeacherRequest $request, Teacher $teacher)
    {
        $data = $request->validated();

        DB::transaction(function () use ($data, $teacher) {
            $updateData = ['name' => $data['name'], 'email' => $data['email']];
            if (!empty($data['password'])) $updateData['password'] = $data['password'];
            
            $teacher->user->update($updateData);
            $teacher->user->syncRoles(['teacher']);
            $teacher->update(['nik' => $data['nik']]);
        });

        return to_route('teachers.index')->with('success', 'Teacher updated successfully');
    }

    public function show(Teacher $teacher)
    {
        $teacher->load(['user.loans.loanRequest.bookUnit.book']);

        return Inertia::render('identities/teachers/show', [
            'teacher' => $this->transformSingleTeacher($teacher),
            'loans'   => $teacher->user->loans->map(fn($loan) => [
                'id'          => $loan->id,
                'status'      => $loan->status,
                'is_overdue'  => $loan->isOverdue(),
                'borrowed_at' => $loan->borrowed_at,
                'due_date'    => $loan->due_date,
                'returned_at' => $loan->returned_at,
                'book'        => [
                    'title'     => $loan->loanRequest->bookUnit->book->title,
                    'cover_url' => $loan->loanRequest->bookUnit->book->cover_url,
                ],
            ]),
        ]);
    }

    public function destroy(Teacher $teacher)
    {
        DB::transaction(function () use ($teacher) {
            $teacher->user->delete();
        });

        return to_route('teachers.index')->with('success', 'Teacher deleted successfully');
    }

    private function getTeachers(?string $search = null)
    {
        return $this->transformTeachers(
            Teacher::query()
                ->with('user')
                ->when($search, function ($query, $search) {
                    $query->where('nik', 'like', "%{$search}%")
                        ->orWhereHas('user', function ($q) use ($search) {
                            $q->where('name', 'like', "%{$search}%")
                                ->orWhere('email', 'like', "%{$search}%");
                        });
                })
                ->latest()
                ->paginate(10)
                ->withQueryString()
        );
    }

    private function transformSingleTeacher(Teacher $teacher)
    {
        return [
            'id'           => $teacher->id,
            'user_id'      => $teacher->user_id,
            'name'         => $teacher->user->name,
            'email'        => $teacher->user->email,
            'nik'          => $teacher->nik,
            'avatar_url'   => $teacher->avatar_url,
            'form_default' => [
                'name'  => $teacher->user->name,
                'email' => $teacher->user->email,
                'nik'   => $teacher->nik,
            ],
        ];
    }

    private function transformTeachers($pagination)
    {
        $pagination->getCollection()->transform(fn($teacher) => $this->transformSingleTeacher($teacher));
        return $pagination;
    }
}