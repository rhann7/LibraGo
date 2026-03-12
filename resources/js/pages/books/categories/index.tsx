import { router, Link as InertiaLink } from '@inertiajs/react';
import { Plus, Pencil, Trash2, Search, Inbox, ChevronLeft, ChevronRight } from 'lucide-react';
import { type FormEventHandler } from 'react';
import { route } from 'ziggy-js';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useBookCategoryForm } from '@/hooks/use-book-category-form';
import DataTableLayout from '@/layouts/data-table-layout';
import UserLayout from '@/layouts/user-layout';
import type { BreadcrumbItem, BookCategory, Can } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Book Categories', href: route('books.categories.index') },
];

const gradients = [
    'from-slate-700 to-slate-900',
    'from-pink-700 to-rose-900',
    'from-violet-700 to-purple-900',
    'from-blue-700 to-cyan-900',
    'from-amber-700 to-orange-900',
    'from-green-700 to-emerald-900',
    'from-yellow-600 to-orange-800',
    'from-red-800 to-gray-900',
    'from-indigo-700 to-violet-900',
    'from-teal-700 to-cyan-900',
];

const getGradient = (id: number) => gradients[id % gradients.length];

interface Props {
    categories: {
        data: BookCategory[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search?: string };
    can: Can;
}

export default function BookCategoryIndex({ categories, filters, can }: Props) {
    const { open, editing, form, openCreate, openEdit, close, submit } = useBookCategoryForm();

    const handleSearch: FormEventHandler<HTMLInputElement> = (e) => {
        router.get(route('books.categories.index'), { search: e.currentTarget.value }, { preserveState: true, replace: true });
    };

    const handleDestroy = (category: BookCategory) => {
        if (confirm(`Delete "${category.name}"?`)) {
            router.delete(route('books.categories.destroy', category.id), { preserveScroll: true });
        }
    };

    const filterWidget = (
        <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input defaultValue={filters.search ?? ''} onInput={handleSearch} placeholder="Search categories..." className="pl-9" />
        </div>
    );

    const actions = can.create ? (
        <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Category
        </Button>
    ) : undefined;

    if (can.create) return (
        <>
            <DataTableLayout
                title="Book Categories"
                description="Manage your book categories"
                breadcrumbs={breadcrumbs}
                actions={actions}
                filterWidget={filterWidget}
                pagination={categories}
                isEmpty={categories.data.length === 0}
            >
                <table className="w-full text-sm">
                    <thead className="border-b border-border/50 bg-muted/30">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">No</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Name</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Slug</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Books</th>
                            <th className="px-6 py-3 text-right font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {categories.data.map((category, index) => (
                            <tr key={category.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-6 py-4 text-muted-foreground">{(categories.from ?? 0) + index}</td>
                                <td className="px-6 py-4 font-medium">{category.name}</td>
                                <td className="px-6 py-4 text-muted-foreground">{category.slug}</td>
                                <td className="px-6 py-4">{category.books_count}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        {can.edit && (
                                            <TooltipProvider delayDuration={0}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button size="sm" variant="outline" onClick={() => openEdit(category)}>
                                                            <Pencil className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Edit</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                        {can.delete && (
                                            <TooltipProvider delayDuration={0}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button size="sm" variant="destructive" onClick={() => handleDestroy(category)}>
                                                            <Trash2 className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Delete</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
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
                        <DialogTitle>{editing ? 'Edit Category' : 'Add Category'}</DialogTitle>
                        <DialogDescription>{editing ? 'Update the category name.' : 'Add a new book category.'}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" value={form.data.name} onChange={e => form.setData('name', e.target.value)} placeholder="Category name" autoFocus />
                            <InputError message={form.errors.name} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={close}>Cancel</Button>
                            <Button type="submit" disabled={form.processing}>{editing ? 'Update' : 'Create'}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );

    return (
        <UserLayout title="Book Categories">
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">All Categories</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Browse books by category</p>
                </div>

                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input defaultValue={filters.search ?? ''} onInput={handleSearch} placeholder="Search categories..." className="pl-9" />
                </div>

                {categories.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                        <div className="rounded-md bg-muted p-3">
                            <Inbox className="h-6 w-6 text-muted-foreground/60" />
                        </div>
                        <p className="text-sm font-medium">No categories found</p>
                        <p className="text-xs text-muted-foreground">Try adjusting your search query.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {categories.data.map(category => (
                            <InertiaLink key={category.id} href="#" className="group relative overflow-hidden rounded-md">
                                <div className={`bg-linear-to-br ${getGradient(category.id)} h-32 w-full transition-opacity group-hover:opacity-90`} />
                                <div className="absolute inset-0 flex flex-col justify-end p-4">
                                    <span className="font-semibold text-white">{category.name}</span>
                                    <span className="text-xs text-white/70">{category.books_count} {category.books_count === 1 ? 'book' : 'books'}</span>
                                </div>
                            </InertiaLink>
                        ))}
                    </div>
                )}

                {categories.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1">
                        {categories.links.map((link, i) => {
                            const isNext = link.label.includes('Next');
                            const isPrev = link.label.includes('Previous');
                            return link.url ? (
                                <InertiaLink key={i} href={link.url} preserveScroll
                                    className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors ${
                                        link.active
                                            ? 'bg-foreground text-background'
                                            : 'border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'
                                    }`}>
                                    {isPrev ? <ChevronLeft className="h-4 w-4" /> : isNext ? <ChevronRight className="h-4 w-4" /> : link.label}
                                </InertiaLink>
                            ) : (
                                <span key={i} className="flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs text-muted-foreground/40 opacity-50">
                                    {isPrev ? <ChevronLeft className="h-4 w-4" /> : isNext ? <ChevronRight className="h-4 w-4" /> : link.label}
                                </span>
                            );
                        })}
                    </div>
                )}
            </div>
        </UserLayout>
    );
}