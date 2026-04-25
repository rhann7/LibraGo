export type LoanRequest = {
    id: number;
    status: 'pending' | 'approved' | 'rejected' | 'taken' | 'expired';
    note: string;
    expired_at: string | null;
    user: {
        id: number;
        name: string;
    };
    book_unit: {
        id: number;
        code: string;
        book: {
            id: number;
            title: string;
            cover_url: string | null;
        };
    };
};

export type Loan = {
    id: number;
    status: 'active' | 'overdue' | 'returned';
    borrowed_at: string;
    due_date: string;
    returned_at: string | null;
    is_overdue: boolean;
    late_days: number;
    user: { id: number; name: string };
    book_unit: {
        id: number;
        code: string;
        book: {
            id: number;
            title: string;
            cover_url: string | null;
            price: number | null;
        };
    };
};

export type Fine = {
    id: number;
    user: { id: number; name: string };
    book: { title: string; cover_url: string | null };
    type: 'late' | 'damaged' | 'lost';
    status: 'unpaid' | 'paid';
    note: string | null;
    late_days: number | null;
    amount: number;
    formatted_amount: string;
    paid_at: string | null;
    created_at: string;
};