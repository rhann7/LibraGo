import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import type { Teacher } from '@/types/identity';

export function useTeacherForm() {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Teacher | null>(null);

    const form = useForm({
        name: '',
        email: '',
        nik: '',
        password: '',
        password_confirmation: '',
    });

    const openCreate = () => {
        form.reset();
        form.clearErrors();
        setEditing(null);
        setOpen(true);
    };

    const openEdit = (teacher: Teacher) => {
        form.setData({
            ...teacher.form_default,
            password: '',
            password_confirmation: '',
        });
        setEditing(teacher);
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
            form.patch(route('teachers.update', editing.id), {
                preserveScroll: true,
                onSuccess: close,
            });
        } else {
            form.post(route('teachers.store'), {
                preserveScroll: true,
                onSuccess: close,
            });
        }
    };

    return { open, editing, form, openCreate, openEdit, close, submit };
}