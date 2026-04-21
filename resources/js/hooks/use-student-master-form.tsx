import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import type { StudentMaster } from '@/types';

export function useStudentMasterForm() {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<StudentMaster | null>(null);

    const form = useForm({
        nipd: '',
        name: '',
        class_name: '',
    });

    const openCreate = () => {
        form.reset();
        form.clearErrors();
        setEditing(null);
        setOpen(true);
    };

    const openEdit = (student: StudentMaster) => {
        form.setData(student.form_default);
        setEditing(student);
        setOpen(true);
    };

    const close = () => {
        form.reset();
        form.clearErrors();
        setEditing(null);
        setOpen(false);
    };

    const submit = () => {
        if (editing) {
            form.patch(route('students.update', editing.id), {
                preserveScroll: true, onSuccess: close
            });
        } else {
            form.post(route('students.store'), {
                preserveScroll: true, onSuccess: close
            });
        }
    };

    return { open, editing, form, openCreate, openEdit, close, submit };
}
