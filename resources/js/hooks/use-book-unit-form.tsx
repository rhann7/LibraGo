import { useForm } from "@inertiajs/react";
import { useState } from "react";
import { route } from "ziggy-js";
import type { BookUnit } from "@/types";

export function useBookUnitForm() {
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState<BookUnit | null>(null);

    const form = useForm({
        _method: '' as string,
        book_id: null as number | null,
        condition: 'good' as 'good' | 'damaged',
        status: 'available' as 'available' | 'reserved' | 'borrowed' | 'lost',
        note: '',
    });

    const openCreate = () => {
        form.reset();
        form.clearErrors();
        setEditing(null);
        setOpen(true);
    };

    const openEdit = (unit: BookUnit) => {
        form.setData({ ...unit.form_default, _method: 'patch' });
        setEditing(unit);
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
            form.post(route('book-units.update', { book_unit: editing.id }), {
                preserveScroll: true,
                onSuccess: close,
            });
        } else {
            form.post(route('book-units.store'), {
                preserveScroll: true,
                onSuccess: close,
            });
        }
    };

    return { open, editing, form, openCreate, openEdit, close, submit };
}