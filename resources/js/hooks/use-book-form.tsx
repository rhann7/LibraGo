import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import { route } from 'ziggy-js';
import type { Book } from '@/types';

export function useBookForm() {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<Book | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const form = useForm({
        _method: '' as string,
        book_category_id: null as number | null,
        title: '',
        author: '',
        publisher: '',
        isbn: '',
        cover: null as File | null,
        price: null as number | null,
        year: '' as unknown as number,
        synopsis: '',
        pages: '' as unknown as number,
        units: '' as unknown as number
    });

    const setCover = (file: File | null) => {
        form.setData('cover', file);
        setPreview(file ? URL.createObjectURL(file) : null);
    }

    const openCreate = () => {
        form.reset();
        form.clearErrors();
        setEditing(null);
        setOpen(true);
    }

    const openEdit = (book: Book) => {
        form.setData({ ...book.form_default, _method: 'patch' });
        setEditing(book);
        setOpen(true);
    }

    const close = () => {
        form.reset();
        form.clearErrors();
        setEditing(null);
        setPreview(null);
        setOpen(false);
    }

    const submit = () => {
        if (editing) {
            form.post(route('books.update', { book: editing.id }), {
                forceFormData: true, preserveScroll: true, onSuccess: close
            });
        } else {
            form.post(route('books.store'), {
                forceFormData: true, preserveScroll: true, onSuccess: close
            });
        }
    };

    return { open, editing, preview, form, setCover, openCreate, openEdit, close, submit };
}