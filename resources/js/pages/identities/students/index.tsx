import { Link as InertiaLink } from "@inertiajs/react";
import { router } from "@inertiajs/react";
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import type { FormEventHandler } from "react";
import { route } from "ziggy-js";
import InputError from "@/components/input-error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useStudentMasterForm } from "@/hooks/use-student-master-form";
import DataTableLayout from "@/layouts/data-table-layout";
import type { BreadcrumbItem, StudentMaster } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Students', href: route('students.index') },
];

interface Props {
    students: {
        data: StudentMaster[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search?: string; registered?: string };
}

export default function StudentIndex({ students, filters }: Props) {
    const { open, editing, form, openCreate, openEdit, close, submit } = useStudentMasterForm();

    const handleSearch: FormEventHandler<HTMLInputElement> = (e) => {
        router.get(route('students.index'), { search: e.currentTarget.value }, { preserveState: true, replace: true });
    };

    const handleDestroy = (student: StudentMaster) => {
        if (confirm(`Delete "${student.name}"?`)) {
            router.delete(route('students.destroy', student.id), { preserveScroll: true });
        }
    };

    const filterWidget = (
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input defaultValue={filters.search ?? ''} onInput={handleSearch} placeholder="Search students..." className="pl-9 w-64" />
            </div>
            <Select value={filters.registered ?? 'all'} onValueChange={(val) => router.get(route('students.index'), { ...filters, registered: val === 'all' ? undefined : val }, { preserveState: true, replace: true })}>
                <SelectTrigger className="w-44">
                    <SelectValue placeholder="All Students" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Students</SelectItem>
                    <SelectItem value="registered">Registered</SelectItem>
                    <SelectItem value="unregistered">Unregistered</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );

    const actions = (
        <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Student
        </Button>
    );

    return (
        <>
            <DataTableLayout
                title="Students"
                description="Manage student master data"
                breadcrumbs={breadcrumbs}
                actions={actions}
                filterWidget={filterWidget}
                pagination={students}
                isEmpty={students.data.length === 0}
                emptyStateTitle="No students found"
                emptyStateDescription="Try adjusting your search query."
            >
                <table className="w-full text-sm">
                    <thead className="border-b border-border/50 bg-muted/30">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">No</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">NIPD</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Name</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Class</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Status</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Email</th>
                            <th className="px-6 py-3 text-right font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {students.data.map((student, index) => (
                            <tr key={student.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-6 py-4 text-muted-foreground">{(students.from ?? 0) + index}</td>
                                <td className="px-6 py-4 font-mono">{student.nipd}</td>
                                <td className="px-6 py-4 font-medium">{student.name}</td>
                                <td className="px-6 py-4 text-muted-foreground">{student.class_name}</td>
                                <td className="px-6 py-4">
                                    <Badge variant={student.is_registered ? 'default' : 'outline'}>
                                        {student.is_registered ? 'Registered' : 'Unregistered'}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {student.student?.email ?? '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <InertiaLink href={route('students.show', student.id)}>
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
                                                    <Button size="sm" variant="outline" onClick={() => openEdit(student)}>
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Edit</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button size="sm" variant="destructive" onClick={() => handleDestroy(student)}>
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
                        <DialogTitle>{editing ? 'Edit Student' : 'Add Student'}</DialogTitle>
                        <DialogDescription>{editing ? 'Update student master data.' : 'Add a new student master data.'}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="nipd">NIPD</Label>
                            <Input id="nipd" value={form.data.nipd} onChange={e => form.setData('nipd', e.target.value)} placeholder="Student NIPD" />
                            <InputError message={form.errors.nipd} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={form.data.name} onChange={e => form.setData('name', e.target.value)} placeholder="Student name" />
                            <InputError message={form.errors.name} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="class_name">Class</Label>
                            <Input id="class_name" value={form.data.class_name} onChange={e => form.setData('class_name', e.target.value)} placeholder="e.g. XII RPL 1" />
                            <InputError message={form.errors.class_name} />
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