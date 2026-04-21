<?php

namespace App\Http\Controllers\Identities;

use App\Http\Controllers\Controller;
use App\Http\Requests\Identities\UserStudentRequest;
use App\Models\Identiies\StudentMaster;
use Illuminate\Http\Request;
use Illuminate\Routing\Controllers\HasMiddleware;
use Illuminate\Routing\Controllers\Middleware;
use Inertia\Inertia;

class StudentController extends Controller implements HasMiddleware
{
    public static function middleware()
    {
        return [
            new Middleware('role:admin'),
        ];
    }

    public function index(Request $request)
    {
        return Inertia::render('identities/students/index', [
            'students' => $this->getStudents($request->search, $request->registered),
            'filters'  => $request->only('search', 'registered'),
        ]);
    }

    public function store(UserStudentRequest $request)
    {
        StudentMaster::create($request->validated());
        return to_route('students.index')->with('success', 'Student master created successfully');
    }

    public function update(UserStudentRequest $request, StudentMaster $student)
    {
        $student->update($request->validated());
        return to_route('students.index')->with('success', 'Student master updated successfully');
    }

    public function show(StudentMaster $student)
    {
        $student->load(['student.user.loans.loanRequest.bookUnit.book']);

        return Inertia::render('identities/students/show', [
            'student' => $this->transformSingleStudent($student),
            'loans'   => $student->student?->user?->loans->map(fn($loan) => [
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
            ]) ?? [],
        ]);
    }

    public function destroy(StudentMaster $student)
    {
        if ($student->student()->exists()) return back()->with('error', 'Student master cannot be deleted because it is already registered');
        $student->delete();
        return to_route('students.index')->with('success', 'Student master deleted successfully');
    }

    private function getStudents(?string $search = null, ?string $registered = null)
    {
        return $this->transformStudents(
            StudentMaster::query()
                ->with(['student.user'])
                ->when($search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('nipd', 'like', "%{$search}%")
                            ->orWhere('name', 'like', "%{$search}%")
                            ->orWhere('class_name', 'like', "%{$search}%");
                    });
                })
                ->when($registered === 'registered', fn($q) => $q->whereHas('student'))
                ->when($registered === 'unregistered', fn($q) => $q->whereDoesntHave('student'))
                ->latest()
                ->paginate(10)
                ->withQueryString()
        );
    }

    private function transformSingleStudent(StudentMaster $student)
    {
        return [
            'id'            => $student->id,
            'nipd'          => $student->nipd,
            'name'          => $student->name,
            'class_name'    => $student->class_name,
            'is_registered' => $student->student !== null,
            'student'       => $student->student ? [
                'id'      => $student->student->id,
                'user_id' => $student->student->user_id,
                'email'   => $student->student->user?->email,
            ] : null,
            'form_default'  => [
                'nipd'       => $student->nipd,
                'name'       => $student->name,
                'class_name' => $student->class_name,
            ],
        ];
    }

    private function transformStudents($pagination)
    {
        $pagination->getCollection()->transform(fn($student) => $this->transformSingleStudent($student));
        return $pagination;
    }
}