export type Can = {
    create: boolean;
    edit: boolean;
    delete: boolean;
};

export type BookCategory = {
    id: number;
    name: string;
    slug: string;
    books_count: number;
    form_default: {
        name: string;
    };
};

export type Book = {
    id: number;
    title: string;
    slug: string;
    author: string;
    publisher: string;
    isbn: string | null;
    cover_url: string | null;
    year: number;
    synopsis: string | null;
    pages: number;
    units_count: number;
    category: BookCategory | null;
    form_default: {
        book_category_id: number | null;
        title: string;
        author: string;
        publisher: string;
        isbn: string;
        cover: File | null;
        year: number;
        synopsis: string;
        pages: number;
        units: number;
    };
};