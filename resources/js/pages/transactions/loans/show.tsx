import { router } from "@inertiajs/react";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import { route } from "ziggy-js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types/navigation";
import type { Loan } from "@/types/transaction";

const breadcrumbs = (loan: Loan): BreadcrumbItem[] => [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Loans', href: route('loans.index') },
    { title: loan.book_unit.book.title, href: route('loans.show', { loan: loan.id }) },
];

interface Props {
    loan: Loan;
    currentToken: {
        token: string;
        expired_at: string;
        expires_in: number;
    } | null;
    can: {
        return: boolean;
    };
}

export default function LoanShow({ loan, currentToken, can }: Props) {
    const [token, setToken] = useState('');

    return (
        <AppLayout breadcrumbs={breadcrumbs(loan)}>
            <div className="space-y-6 p-6">
                <div className="rounded-md border border-border bg-card p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        {loan.book_unit.book.cover_url ? (
                            <img src={loan.book_unit.book.cover_url} alt={loan.book_unit.book.title} className="h-20 w-14 rounded-sm object-cover border border-border" />
                        ) : (
                            <div className="h-20 w-14 rounded-sm bg-muted flex items-center justify-center border border-border">
                                <BookOpen className="h-6 w-6 text-muted-foreground/40" />
                            </div>
                        )}
                        <div className="space-y-1">
                            <p className="font-semibold">{loan.book_unit.book.title}</p>
                            <p className="text-sm font-mono text-muted-foreground">{loan.book_unit.code}</p>
                        </div>
                    </div>

                    <div className="border-t border-border pt-4 space-y-2.5">
                        <div className="grid grid-cols-[140px_1fr] text-sm">
                            <span className="text-muted-foreground">Borrower</span>
                            <span>{loan.user.name}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] text-sm">
                            <span className="text-muted-foreground">Status</span>
                            <Badge className="w-fit" variant={
                                loan.status === 'active' ? 'default' : 'secondary'
                            }>
                                {loan.is_overdue ? 'overdue' : loan.status}
                            </Badge>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] text-sm">
                            <span className="text-muted-foreground">Borrowed At</span>
                            <span>{new Date(loan.borrowed_at).toLocaleDateString('id-ID')}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] text-sm">
                            <span className="text-muted-foreground">Due Date</span>
                            <span className={loan.is_overdue ? 'text-destructive font-medium' : ''}>
                                {new Date(loan.due_date).toLocaleDateString('id-ID')}
                                {loan.is_overdue && ` (${loan.late_days} days late)`}
                            </span>
                        </div>
                        {loan.returned_at && (
                            <div className="grid grid-cols-[140px_1fr] text-sm">
                                <span className="text-muted-foreground">Returned At</span>
                                <span>{new Date(loan.returned_at).toLocaleDateString('id-ID')}</span>
                            </div>
                        )}
                    </div>
                </div>

                {can.return && loan.status === 'active' && (
                    <div className="rounded-md border border-border bg-card p-6 space-y-4">
                        <p className="text-sm font-medium">Process Return</p>
                        <form onSubmit={(e) => { e.preventDefault(); router.patch(route('loans.return', { loan: loan.id }), { token }, { preserveScroll: true, onSuccess: () => setToken('') }); }} className="space-y-3">
                            <div className="grid gap-2">
                                <Label htmlFor="token">Return Token</Label>
                                <Input id="token" value={token} onChange={e => setToken(e.target.value.toUpperCase())} placeholder="8-character token" className="font-mono w-48" maxLength={8} />
                            </div>
                            <Button type="submit" size="sm" disabled={token.length !== 8}>
                                Process Return
                            </Button>
                        </form>
                    </div>
                )}

                {!can.return && currentToken && (
                    <div className="rounded-md border border-border bg-card p-6 space-y-2.5">
                        <p className="text-sm font-medium">Return Token</p>
                        <p className="text-3xl font-mono font-bold tracking-widest">{currentToken.token}</p>
                        <p className="text-xs text-muted-foreground">
                            Expires at {new Date(currentToken.expired_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </p>
                        <Button variant="outline" size="sm" onClick={() => router.reload({ only: ['currentToken'] })}>
                            Refresh Token
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}