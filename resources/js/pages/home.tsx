import { Link } from '@inertiajs/react';
import { BookOpen } from 'lucide-react';
import { route } from 'ziggy-js';
import UserLayout from '@/layouts/user-layout';

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

interface PopularBook {
    id: number;
    title: string;
    author: string;
    cover_url: string | null;
    category: string | null;
    loans: number;
}

interface Category {
    id: number;
    name: string;
    total: number;
}

interface Props {
    popular_books: PopularBook[];
    categories: Category[];
}

export default function Home({ popular_books, categories }: Props) {
    return (
        <UserLayout title="Home">
            <div className="space-y-10">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Homepage</h1>
                    <p className="mt-1 text-sm text-muted-foreground">Welcome to LibraGo, your school library.</p>
                </div>

                <section className="relative overflow-hidden rounded-xl border border-border" style={{ height: '280px' }}>
                    <img src="/storage/img/tb.jpg" alt="Welcome to LibraGo" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-black/60" />
                    <div className="absolute inset-0 flex flex-col justify-end p-6">
                        <h2 className="text-3xl font-bold text-white">Welcome to LibraGo</h2>
                        <p className="mt-2 text-sm text-white/70">A simple digital library built for your school. Borrow books easily anytime through a simple digital system.</p>
                    </div>
                </section>

                <section className="space-y-4">
                    <div>
                        <h2 className="text-lg font-semibold">Categories</h2>
                        <p className="text-sm text-muted-foreground">Browse books by category</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
                        {categories.length === 0 ? (
                            <p className="col-span-5 text-sm text-muted-foreground text-center py-10">No categories available yet.</p>
                        ) : (
                            categories.map(cat => (
                                <Link key={cat.id} href={route('books.index', { category: cat.id })} className={`rounded-lg bg-linear-to-br ${getGradient(cat.id)} p-4 space-y-1 hover:opacity-90 transition-opacity`}>
                                    <p className="text-sm font-medium text-white">{cat.name}</p>
                                    <p className="text-xs text-white/60">{cat.total} {cat.total === 1 ? 'book' : 'books'}</p>
                                </Link>
                            ))
                        )}
                    </div>
                </section>

                <section className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold">Most Borrowed</h2>
                            <p className="text-sm text-muted-foreground">Books with the highest loan count</p>
                        </div>
                        <Link href={route('books.index')} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                            See all →
                        </Link>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                        {popular_books.length === 0 ? (
                            <p className="col-span-5 text-sm text-muted-foreground text-center py-10">No books available yet.</p>
                        ) : (
                            popular_books.map(book => (
                                <Link key={book.id} href={route('books.show', book.id)} className="group space-y-2">
                                    <div className="relative aspect-2/3 overflow-hidden rounded-lg border border-border bg-muted">
                                        {book.cover_url ? (
                                            <img src={book.cover_url} alt={book.title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <BookOpen className="h-8 w-8 text-muted-foreground/40" />
                                            </div>
                                        )}
                                        <div className="absolute bottom-2 right-2 rounded-md bg-black/60 px-1.5 py-0.5 text-xs text-white backdrop-blur-sm">
                                            {book.loans}x
                                        </div>
                                    </div>
                                    <div className="space-y-0.5">
                                        <p className="text-sm font-medium leading-snug line-clamp-2">{book.title}</p>
                                        <p className="text-xs text-muted-foreground">{book.author}</p>
                                        {book.category && (
                                            <p className="text-xs text-muted-foreground">{book.category}</p>
                                        )}
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </UserLayout>
    );
}