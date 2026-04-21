import { Link, router } from "@inertiajs/react";
import { BookOpen } from "lucide-react";
import { route } from "ziggy-js";
import UserLayout from "@/layouts/user-layout";
import type { Book } from "@/types";

interface Props {
    book: Book;
    bookUnit: { id: number } | null;
    activeRequest: { id: number; status: string } | null;
}

export default function BookShow({ book, bookUnit, activeRequest }: Props) {
    const breadcrumbs = [
        { title: 'Books', href: route('books.index') },
        { title: book.title },
    ];

    return (
        <UserLayout title={book.title} breadcrumbs={breadcrumbs}>
            <div className="grid grid-cols-1 gap-10 md:grid-cols-[320px_1fr] items-stretch">
                <div className="h-full">
                    {book.cover_url ? (
                        <img src={book.cover_url} alt={book.title} className="h-full w-full rounded-sm border border-border object-cover shadow-lg" />
                    ) : (
                        <div className="flex w-full items-center justify-center rounded-sm border border-border bg-muted" style={{ aspectRatio: '2/3' }}>
                            <BookOpen className="h-16 w-16 text-muted-foreground/40" />
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-between" style={{ height: '100%' }}>
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight leading-tight">{book.title}</h1>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{book.author ?? 'Unknown Author'}</span>
                            {book.category && (
                                <>
                                    <span>·</span>
                                    <span>{book.category.name}</span>
                                </>
                            )}
                        </div>
                    </div>

                    {book.synopsis && (
                        <p className="text-sm leading-relaxed text-muted-foreground border-t border-border pt-6">
                            {book.synopsis}
                        </p>
                    )}

                    <div className="border-t border-border pt-6 space-y-2.5">
                        {book.publisher && (
                            <div className="grid grid-cols-[160px_1fr] text-sm">
                                <span className="text-muted-foreground">Publisher</span>
                                <span>{book.publisher}</span>
                            </div>
                        )}
                        <div className="grid grid-cols-[160px_1fr] text-sm">
                            <span className="text-muted-foreground">Year</span>
                            <span>{book.year}</span>
                        </div>
                        {book.isbn && (
                            <div className="grid grid-cols-[160px_1fr] text-sm">
                                <span className="text-muted-foreground">ISBN</span>
                                <span>{book.isbn}</span>
                            </div>
                        )}
                        <div className="grid grid-cols-[160px_1fr] text-sm">
                            <span className="text-muted-foreground">Pages</span>
                            <span>{book.pages} pages</span>
                        </div>
                        <div className="grid grid-cols-[160px_1fr] text-sm">
                            <span className="text-muted-foreground">Available Units</span>
                            <span>{book.units_count} units</span>
                        </div>
                    </div>

                    <div className="border-t border-border pt-6">
                        {activeRequest ? (
                            <Link href={route('loan-requests.show', activeRequest.id)} className="inline-flex items-center gap-2 rounded-sm border border-border px-8 py-2.5 text-sm font-medium hover:bg-muted/40 transition-colors">
                                <BookOpen className="h-4 w-4" />
                                View Request
                            </Link>
                        ) : (
                            <button disabled={!bookUnit} onClick={() => { if (!bookUnit) return; if (!confirm(`Borrow "${book.title}"?`)) return; router.post(route('loan-requests.store'), { book_unit_id: bookUnit.id }, { preserveScroll: true }); }} className={`inline-flex items-center gap-2 rounded-sm bg-foreground px-8 py-2.5 text-sm font-medium text-background ${!bookUnit ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}>
                                <BookOpen className="h-4 w-4" />
                                {bookUnit ? 'Borrow Book' : 'Not Available'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}