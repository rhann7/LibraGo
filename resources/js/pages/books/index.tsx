import { router } from "@inertiajs/react";
import { BookOpen, Pencil, Plus, Search, Trash2 } from "lucide-react";
import type { FormEventHandler } from "react";
import { route } from "ziggy-js";
import InputError from '@/components/input-error';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useBookForm } from "@/hooks/use-book-form";
import DataTableLayout from "@/layouts/data-table-layout";
import type { Book, BreadcrumbItem, Can } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Books', href: route('books.index') },
];

interface Props {
    books: { 
        data: Book[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: {
        search?: string;
        category?: number;
        year?: number;
    };
    can: Can;
    categories: { 
        id: number; 
        name: string;
    }[];
}

export default function BookIndex({ books, filters, can, categories }: Props) {
    const { open, editing, preview, form, setCover, openCreate, openEdit, close, submit } = useBookForm();

    const handleSearch: FormEventHandler<HTMLInputElement> = (e) => {
        router.get(route('books.index'), { ...filters, search: e.currentTarget.value }, { preserveState: true, replace: true });
    }

    const handleDestroy = (book: Book) => {
        if (confirm(`Delete "${book.title}"?`)) {
            router.delete(route('books.destroy', book.id), { preserveScroll: true });
        }
    }

    const filterWidget = (
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input defaultValue={filters.search ?? ''} onInput={handleSearch} placeholder="Search books..." className="pl-9 w-64" />
            </div>

            {categories.length > 0 && (
                <Select value={filters.category?.toString() ?? 'all'} onValueChange={(val) => router.get(route('books.index'), { ...filters, category: val === 'all' ? undefined : val }, { preserveState: true, replace: true })}>
                    <SelectTrigger className="w-48">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map(c => (
                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            <Input type="number" placeholder="Year" className="w-28" defaultValue={filters.year ?? ''} onInput={(e) => router.get(route('books.index'), { ...filters, year: e.currentTarget.value || undefined }, { preserveState: true, replace: true })} />
        </div>
    );

    const actions = can.create ? (
        <Button onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" /> Add Book
        </Button>
    ) : undefined;

    if (can.create) return (
        <>
            <DataTableLayout
                title="Books"
                description="Manage your book collection"
                breadcrumbs={breadcrumbs}
                actions={actions}
                filterWidget={filterWidget}
                pagination={books}
                isEmpty={books.data.length === 0}
                emptyStateTitle="No books found"
                emptyStateDescription="Try adjusting your search or filters."
            >
                <table className="w-full text-sm">
                    <thead className="border-b border-border/50 bg-muted/30">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">No</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Cover</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Title</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Author</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Publisher</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Category</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Units</th>
                            <th className="px-6 py-3 text-right font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {books.data.map((book, index) => (
                            <tr key={book.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-6 py-4 text-muted-foreground">{(books.from ?? 0) + index}</td>
                                <td className="px-6 py-4">
                                    {book.cover_url ? (
                                        <img src={book.cover_url} alt={book.title} className="h-12 w-8 rounded-sm object-cover" />
                                    ) : (
                                        <div className="h-12 w-8 rounded-sm bg-muted flex items-center justify-center">
                                            <BookOpen className="h-4 w-4 text-muted-foreground/50" />
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 font-medium max-w-48 truncate">{book.title}</td>
                                <td className="px-6 py-4 text-muted-foreground">{book.author}</td>
                                <td className="px-6 py-4 text-muted-foreground">{book.publisher || 'Unknown'}</td>
                                <td className="px-6 py-4 text-muted-foreground">{book.category?.name ?? '-'}</td>
                                <td className="px-6 py-4">{book.units_count}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        {can.edit && (
                                            <TooltipProvider delayDuration={0}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button size="sm" variant="outline" onClick={() => openEdit(book)}>
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
                                                        <Button size="sm" variant="destructive" onClick={() => handleDestroy(book)}>
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
                <DialogContent className="max-w-3xl!">
                    <DialogHeader>
                        <DialogTitle>{editing ? 'Edit Book' : 'Add Book'}</DialogTitle>
                        <DialogDescription>{editing ? 'Update book details.' : 'Add a new book to the collection.'}</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="grid grid-cols-[1fr_auto] gap-6">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" value={form.data.title} onChange={e => form.setData('title', e.target.value)} placeholder="Book title" />
                                <InputError message={form.errors.title} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="author">Author</Label>
                                <Input id="author" value={form.data.author} onChange={e => form.setData('author', e.target.value)} placeholder="Author name" />
                                <InputError message={form.errors.author} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="publisher">Publisher</Label>
                                <Input id="publisher" value={form.data.publisher} onChange={e => form.setData('publisher', e.target.value)} placeholder="Publisher name" />
                                <InputError message={form.errors.publisher} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={form.data.book_category_id?.toString() ?? ''} onValueChange={val => form.setData('book_category_id', val ? Number(val) : null)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map(c => (
                                            <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={form.errors.book_category_id} />
                            </div>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="year">Year</Label>
                                    <Input id="year" type="number" value={form.data.year} onChange={e => form.setData('year', Number(e.target.value))} placeholder="2024" />
                                    <InputError message={form.errors.year} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="pages">Pages</Label>
                                    <Input id="pages" type="number" value={form.data.pages} onChange={e => form.setData('pages', Number(e.target.value))} placeholder="100" />
                                    <InputError message={form.errors.pages} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="isbn">ISBN</Label>
                                    <Input id="isbn" value={form.data.isbn} onChange={e => form.setData('isbn', e.target.value)} placeholder="978-602-123-456-7" />
                                    <InputError message={form.errors.isbn} />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="synopsis">Synopsis</Label>
                                <Textarea id="synopsis" value={form.data.synopsis} onChange={e => form.setData('synopsis', e.target.value)} placeholder="Book synopsis..." className="resize-none h-32" />
                                <InputError message={form.errors.synopsis} />
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 w-40">
                            <Label>Cover</Label>
                            <div className="h-56 w-40 overflow-hidden rounded-sm border border-border bg-muted flex items-center justify-center">
                                {preview ? (
                                    <img src={preview} alt="Cover preview" className="h-full w-full object-cover" />
                                ) : editing?.cover_url ? (
                                    <img src={editing.cover_url} alt="Current cover" className="h-full w-full object-cover" />
                                ) : (
                                    <BookOpen className="h-8 w-8 text-muted-foreground/40" />
                                )}
                            </div>
                            <Input type="file" accept="image/*" className="text-xs w-40" onChange={e => setCover(e.target.files?.[0] ?? null)} />
                            <InputError message={form.errors.cover} />
                        </div>

                        <DialogFooter className="col-span-2">
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