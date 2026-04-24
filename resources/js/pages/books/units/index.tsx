import { router } from "@inertiajs/react";
import { BookOpen, Pencil, Plus, Search, Trash2 } from "lucide-react";
import type { FormEventHandler } from "react";
import { route } from "ziggy-js";
import InputError from "@/components/input-error";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useBookUnitForm } from "@/hooks/use-book-unit-form";
import DataTableLayout from "@/layouts/data-table-layout";
import type { BookUnit, BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Books', href: route('books.index') },
    { title: 'Units', href: route('book-units.index') },
];

interface Props {
    units: {
        data: BookUnit[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: {
        search?: string;
        condition?: string;
        status?: string;
    };
    books: {
        id: number;
        title: string;
    }[];
}

export default function BookUnitIndex({ units, filters, books }: Props) {
    const { open, editing, form, openCreate, openEdit, close, submit } = useBookUnitForm();

    const handleSearch: FormEventHandler<HTMLInputElement> = (e) => {
        router.get(route('book-units.index'), { ...filters, search: e.currentTarget.value }, { preserveState: true, replace: true });
    };

    const handleDestroy = (unit: BookUnit) => {
        if (confirm(`Delete unit "${unit.code}"?`)) {
            router.delete(route('book-units.destroy', { book_unit: unit.id }), { preserveScroll: true });
        }
    };

    const filterWidget = (
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input defaultValue={filters.search ?? ''} onInput={handleSearch} placeholder="Search units..." className="pl-9 w-64" />
            </div>

            <Select value={filters.condition ?? 'all'} onValueChange={(val) => router.get(route('book-units.index'), { ...filters, condition: val === 'all' ? undefined : val }, { preserveState: true, replace: true })}>
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Conditions" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Conditions</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
            </Select>

            <Select value={filters.status ?? 'all'} onValueChange={(val) => router.get(route('book-units.index'), { ...filters, status: val === 'all' ? undefined : val }, { preserveState: true, replace: true })}>
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="available">Available</SelectItem>
                    <SelectItem value="reserved">Reserved</SelectItem>
                    <SelectItem value="borrowed">Borrowed</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );

    const actions = (
        <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Unit
        </Button>
    );

    return (
        <>
            <DataTableLayout
                title="Book Units"
                description="Manage individual book units"
                breadcrumbs={breadcrumbs}
                actions={actions}
                filterWidget={filterWidget}
                pagination={units}
                isEmpty={units.data.length === 0}
                emptyStateTitle="No units found"
                emptyStateDescription="Try adjusting your search or filters."
            >
                <table className="w-full text-sm">
                    <thead className="border-b border-border/50 bg-muted/30">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">No</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Code</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Book</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Condition</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Status</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Note</th>
                            <th className="px-6 py-3 text-right font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {units.data.map((unit, index) => (
                            <tr key={unit.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-6 py-4 text-muted-foreground">{(units.from ?? 0) + index}</td>
                                <td className="px-6 py-4 font-mono font-medium">{unit.code}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {unit.book.cover_url ? (
                                            <img src={unit.book.cover_url} alt={unit.book.title} className="h-10 w-7 rounded-sm object-cover" />
                                        ) : (
                                            <div className="h-10 w-7 rounded-sm bg-muted flex items-center justify-center">
                                                <BookOpen className="h-3.5 w-3.5 text-muted-foreground/50" />
                                            </div>
                                        )}
                                        <span className="max-w-48 truncate">{unit.book.title}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={unit.condition === 'good' ? 'default' : 'destructive'}>
                                        {unit.condition}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4">
                                    <Badge variant={
                                        unit.status === 'available' ? 'default' :
                                        unit.status === 'borrowed' ? 'secondary' :
                                        unit.status === 'reserved' ? 'outline' :
                                        'destructive'
                                    }>
                                        {unit.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground max-w-40 truncate">{unit.note || '-'}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button size="sm" variant="outline" onClick={() => openEdit(unit)}>
                                                        <Pencil className="h-3.5 w-3.5" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Edit</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button size="sm" variant="destructive" onClick={() => handleDestroy(unit)}>
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
                        <DialogTitle>{editing ? 'Edit Unit' : 'Add Unit'}</DialogTitle>
                        <DialogDescription>{editing ? 'Update unit details.' : 'Add a new book unit.'}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="book_id">Book</Label>
                            <Select value={form.data.book_id?.toString() ?? ''} onValueChange={val => form.setData('book_id', val ? Number(val) : null)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select book" />
                                </SelectTrigger>
                                <SelectContent>
                                    {books.map(b => (
                                        <SelectItem key={b.id} value={b.id.toString()}>{b.title}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <InputError message={form.errors.book_id} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                                <Label htmlFor="condition">Condition</Label>
                                <Select value={form.data.condition} onValueChange={val => form.setData('condition', val as 'good' | 'damaged')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select condition" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="good">Good</SelectItem>
                                        <SelectItem value="damaged">Damaged</SelectItem>
                                        <SelectItem value="lost">Lost</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.condition} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select value={form.data.status} onValueChange={val => form.setData('status', val as 'available' | 'reserved' | 'borrowed' | 'lost')}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="reserved">Reserved</SelectItem>
                                        <SelectItem value="borrowed">Borrowed</SelectItem>
                                        <SelectItem value="damaged">Damaged</SelectItem>
                                        <SelectItem value="lost">Lost</SelectItem>
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.status} />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="note">Note</Label>
                            <Textarea id="note" value={form.data.note} onChange={e => form.setData('note', e.target.value)} placeholder="Additional note..." className="resize-none h-24" />
                            <InputError message={form.errors.note} />
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
};