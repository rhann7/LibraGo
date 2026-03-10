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