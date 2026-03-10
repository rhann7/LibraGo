import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import type { BookCategory } from '@/types';

export function useBookCategoryForm() {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<BookCategory | null>(null);

    const form = useForm({ name: '' });

    const openCreate = () => {
        form.reset();
        form.clearErrors();
        setEditing(null);
        setOpen(true);
    };

    const openEdit = (category: BookCategory) => {
        form.setData(category.form_default);
        setEditing(category);
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
            form.patch(route('books.categories.update', editing.id), {
                preserveScroll: true, onSuccess: close
            });
        } else {
            form.post(route('books.categories.store'), {
                preserveScroll: true, onSuccess: close
            });
        }
    };

    return { open, editing, form, openCreate, openEdit, close, submit };
}