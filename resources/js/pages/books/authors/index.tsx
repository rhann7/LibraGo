import { router } from "@inertiajs/react";
import { Link as InertiaLink } from "@inertiajs/react";
import { Search, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import type { FormEventHandler } from "react";
import { route } from "ziggy-js";
import { Input } from "@/components/ui/input";
import UserLayout from "@/layouts/user-layout";

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

const getGradient = (index: number) => gradients[index % gradients.length];

interface Author {
    author: string;
    books_count: number;
}

interface Props {
    authors: {
        data: Author[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search?: string };
}

export default function BookAuthorIndex({ authors, filters }: Props) {
    const handleSearch: FormEventHandler<HTMLInputElement> = (e) => {
        router.get(route('books.authors.index'), { search: e.currentTarget.value || undefined }, { preserveState: true, replace: true });
    };

    return (
        <UserLayout title="Authors">
            <div className="space-y-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">All Authors</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Browse books by author</p>
                </div>

                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input defaultValue={filters.search ?? ''} onInput={handleSearch} placeholder="Search authors..." className="pl-9" />
                </div>

                {authors.data.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
                        <div className="rounded-md bg-muted p-3">
                            <Inbox className="h-6 w-6 text-muted-foreground/60" />
                        </div>
                        <p className="text-sm font-medium">No authors found</p>
                        <p className="text-xs text-muted-foreground">Try adjusting your search query.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {authors.data.map((author, index) => (
                            <InertiaLink key={author.author} href={route('books.index', { author: author.author })} className="group relative overflow-hidden rounded-md">
                                <div className={`bg-linear-to-br ${getGradient(index)} h-32 w-full transition-opacity group-hover:opacity-90`} />
                                <div className="absolute inset-0 flex flex-col justify-end p-4">
                                    <span className="font-semibold text-white truncate">{author.author}</span>
                                    <span className="text-xs text-white/70">{author.books_count} {author.books_count === 1 ? 'book' : 'books'}</span>
                                </div>
                            </InertiaLink>
                        ))}
                    </div>
                )}

                {authors.links.length > 3 && (
                    <div className="flex items-center justify-center gap-1">
                        {authors.links.map((link, i) => {
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