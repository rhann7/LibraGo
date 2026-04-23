import { router, Link as InertiaLink } from "@inertiajs/react";
import { BookOpen, Boxes, ChevronLeft, ChevronRight, Inbox, Pencil, Plus, Search, Trash2 } from "lucide-react";
import type { FormEventHandler } from "react";
import { route } from "ziggy-js";
import InputError from '@/components/input-error';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useBookForm } from "@/hooks/use-book-form";
import DataTableLayout from "@/layouts/data-table-layout";
import UserLayout from "@/layouts/user-layout";
import type { Book, BreadcrumbItem, Can } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Books', href: route('books.index') },
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
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground w-12">No</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground w-12">Cover</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Title</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">Author</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">Publisher</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">Category</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">ISBN</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground w-16">Year</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground w-16">Pages</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground w-28 whitespace-nowrap">Price</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground w-16">Units</th>
                            <th className="px-6 py-3 text-right font-medium text-muted-foreground w-28">Actions</th>
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
                                <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{book.author}</td>
                                <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{book.publisher || 'Unknown'}</td>
                                <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{book.category?.name ?? '-'}</td>
                                <td className="px-6 py-4 font-mono text-muted-foreground text-xs whitespace-nowrap">{book.isbn ?? '-'}</td>
                                <td className="px-6 py-4 text-muted-foreground">{book.year}</td>
                                <td className="px-6 py-4 text-muted-foreground">{book.pages}</td>
                                <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                    {book.price ? `Rp ${book.price.toLocaleString('id-ID')}` : '-'}
                                </td>
                                <td className="px-6 py-4">{book.units_count}</td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <InertiaLink href={route('book-units.index', { search: book.title })}>
                                                        <Button size="sm" variant="outline"><Boxes className="h-3.5 w-3.5" /></Button>
                                                    </InertiaLink>
                                                </TooltipTrigger>
                                                <TooltipContent>Manage Units</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                        {can.edit && (
                                            <TooltipProvider delayDuration={0}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button size="sm" variant="outline" onClick={() => openEdit(book)}><Pencil className="h-3.5 w-3.5" /></Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Edit</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                        {can.delete && (
                                            <TooltipProvider delayDuration={0}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button size="sm" variant="destructive" onClick={() => handleDestroy(book)}><Trash2 className="h-3.5 w-3.5" /></Button>
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
                <DialogContent className="max-w-3xl! overflow-y-auto max-h-[90vh]">
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
                                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
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
                            <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-2">
                                    <Label htmlFor="price">Price</Label>
                                    <Input id="price" type="number" value={form.data.price ?? ''} onChange={e => form.setData('price', e.target.value ? Number(e.target.value) : null)} placeholder="50000" />
                                    <InputError message={form.errors.price} />
                                </div>
                                {!editing && (
                                    <div className="grid gap-2">
                                        <Label htmlFor="units" className="text-primary font-semibold">Book Units <span className="text-[10px] text-muted-foreground italic">*Automatically create a book unit</span></Label>
                                        <Input id="units" type="number" value={form.data.units} onChange={e => form.setData('units', Number(e.target.value))} placeholder="10" className="bg-background" />
                                        <InputError message={form.errors.units} />
                                    </div>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="synopsis">Synopsis</Label>
                                <Textarea id="synopsis" value={form.data.synopsis} onChange={e => form.setData('synopsis', e.target.value)} placeholder="Book synopsis..." className="resize-none h-32" />
                                <InputError message={form.errors.synopsis} />
                            </div>
                            <div className="flex justify-end gap-2">
                                <Button type="button" variant="outline" onClick={close}>Cancel</Button>
                                <Button type="submit" disabled={form.processing}>{editing ? 'Update' : 'Create'}</Button>
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
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );

    return (
        <UserLayout title="Books">
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold trackling-tight">All Books</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Browse our book collection</p>
                </div>

                <div className="relative w-full md:max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input defaultValue={filters.search ?? ''} onInput={handleSearch} placeholder="Search books..." className="pl-9 w-64" />
                </div>

                {books.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                        <div className="rounded-md bg-muted p-3">
                            <Inbox className="h-6 w-6 text-muted-foreground/60" />
                        </div>
                        <p className="text-sm font-medium">No books found</p>
                        <p className="text-xs text-muted-foreground">Try adjusting your search or filters.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                        {books.data.map(book => (
                            <div key={book.id} className="flex flex-col rounded-md border border-border overflow-hidden">
                                <div className="relative">
                                    {book.cover_url ? (
                                        <img src={book.cover_url} alt={book.title} className="aspect-2/3 w-full object-cover" />
                                    ) : (
                                        <div className={`bg-linear-to-br ${getGradient(book.category?.id ?? book.id)} aspect-2/3 w-full`} />
                                    )}
                                    {book.category && (
                                        <span className="absolute top-2 right-2 rounded-sm bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                                            {book.category.name}
                                        </span>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 p-3">
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-semibold leading-tight">{book.title}</p>
                                        <p className="text-xs text-muted-foreground">{book.author ?? 'Unknown'}</p>
                                    </div>
                                    <InertiaLink href={route('books.show', { book: book.id })} className="inline-flex w-full items-center justify-center rounded-sm bg-foreground px-3 py-1.5 text-xs text-background hover:opacity-90">
                                        Book Details
                                    </InertiaLink>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {books.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1">
                        {books.links.map((link, i) => {
                            const isNext = link.label.includes('Next');
                            const isPrev = link.label.includes('Previous');
                            return link.url ? (
                                <InertiaLink key={i} href={link.url} preserveScroll className={`flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-xs font-medium transition-colors ${link.active ? 'bg-foreground text-background' : 'border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground'}`}>
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
};