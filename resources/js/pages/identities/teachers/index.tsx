import { router } from '@inertiajs/react';
import { Link as InertiaLink } from '@inertiajs/react';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import type { FormEventHandler } from 'react';
import { route } from 'ziggy-js';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useTeacherForm } from '@/hooks/use-teacher-form';
import DataTableLayout from '@/layouts/data-table-layout';
import type { BreadcrumbItem } from '@/types';
import type { Teacher } from '@/types/identity';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Teachers', href: route('teachers.index') },
];

interface Props {
    teachers: {
        data: Teacher[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search?: string };
}

export default function TeacherIndex({ teachers, filters }: Props) {
    const { open, editing, form, openCreate, openEdit, close, submit } = useTeacherForm();

    const handleSearch: FormEventHandler<HTMLInputElement> = (e) => {
        router.get(route('teachers.index'), { search: e.currentTarget.value }, { preserveState: true, replace: true });
    };

    const handleDestroy = (teacher: Teacher) => {
        if (confirm(`Delete "${teacher.name}"?`)) {
            router.delete(route('teachers.destroy', teacher.id), { preserveScroll: true });
        }
    };

    const filterWidget = (
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    defaultValue={filters.search ?? ''}
                    onInput={handleSearch}
                    placeholder="Search teachers..."
                    className="pl-9 w-64"
                />
            </div>
        </div>
    );

    const actions = (
        <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Teacher
        </Button>
    );

    return (
        <>
            <DataTableLayout
                title="Teachers"
                description="Manage teacher data"
                breadcrumbs={breadcrumbs}
                actions={actions}
                filterWidget={filterWidget}
                pagination={teachers}
                isEmpty={teachers.data.length === 0}
                emptyStateTitle="No teachers found"
                emptyStateDescription="Try adjusting your search query."
            >
                <table className="w-full text-sm">
                    <thead className="border-b border-border/50 bg-muted/30">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">No</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">NIK</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Name</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Email</th>
                            <th className="px-6 py-3 text-right font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {teachers.data.map((teacher, index) => (
                            <tr key={teacher.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-6 py-4 text-muted-foreground">{(teachers.from ?? 0) + index}</td>
                                <td className="px-6 py-4 font-mono">{teacher.nik}</td>
                                <td className="px-6 py-4 font-medium">{teacher.name}</td>
                                <td className="px-6 py-4 text-muted-foreground">{teacher.email}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <InertiaLink href={route('teachers.show', teacher.id)}>
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </InertiaLink>
                                                </TooltipTrigger>
                                                <TooltipContent>View</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button size="sm" variant="outline" onClick={() => openEdit(teacher)}>
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Edit</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button size="sm" variant="destructive" onClick={() => handleDestroy(teacher)}>
                                                        <Trash2 className="h-3.5 w-3.5" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Delete</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DataTableLayout>

            <Dialog open={open} onOpenChange={close}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Teacher' : 'Add Teacher'}</DialogTitle>
                        <DialogDescription>
                            {editing ? 'Update teacher data.' : 'Add a new teacher.'}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={form.data.name}
                                onChange={e => form.setData('name', e.target.value)}
                                placeholder="Teacher name"
                            />
                            <InputError message={form.errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={form.data.email}
                                onChange={e => form.setData('email', e.target.value)}
                                placeholder="teacher@example.com"
                            />
                            <InputError message={form.errors.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="nik">NIK</Label>
                            <Input
                                id="nik"
                                value={form.data.nik}
                                onChange={e => form.setData('nik', e.target.value)}
                                placeholder="Teacher NIK"
                            />
                            <InputError message={form.errors.nik} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">
                                Password {editing && <span className="text-muted-foreground text-xs">(leave blank to keep current)</span>}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={form.data.password}
                                onChange={e => form.setData('password', e.target.value)}
                                placeholder={editing ? '••••••••' : 'Password'}
                            />
                            <InputError message={form.errors.password} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={form.data.password_confirmation}
                                onChange={e => form.setData('password_confirmation', e.target.value)}
                                placeholder={editing ? '••••••••' : 'Confirm password'}
                            />
                            <InputError message={form.errors.password_confirmation} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={close}>Cancel</Button>
                            <Button type="submit" disabled={form.processing}>
                                {editing ? 'Update' : 'Create'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}