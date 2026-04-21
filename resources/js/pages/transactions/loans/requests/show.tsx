import { router } from "@inertiajs/react";
import { BookOpen } from "lucide-react";
import { route } from "ziggy-js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem } from "@/types";
import type { LoanRequest } from "@/types/transaction";

const breadcrumbs = (req: LoanRequest): BreadcrumbItem[] => [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Loan Requests', href: route('loan-requests.index') },
    { title: req.book_unit.book.title, href: route('loan-requests.show', { loan_request: req.id }) }
];

interface Props {
    request: LoanRequest;
    currentToken: {
        token: string;
        expired_at: string;
        expires_in: number;
    } | null;
}

export default function LoanRequestShow({ request, currentToken }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(request)}>
            <div className="space-y-6 p-6">
                <div className="rounded-md border border-border bg-card p-6 space-y-4">
                    <div className="flex items-center gap-4">
                        {request.book_unit.book.cover_url ? (
                            <img src={request.book_unit.book.cover_url} alt={request.book_unit.book.title} className="h-20 w-14 rounded-sm object-cover border border-border" />
                        ) : (
                            <div className="h-20 w-14 rounded-sm bg-muted flex items-center justify-center border border-border">
                                <BookOpen className="h-6 w-6 text-muted-foreground/40" />
                            </div>
                        )}
                        <div className="space-y-1">
                            <p className="font-semibold">{request.book_unit.book.title}</p>
                            <p className="text-sm font-mono text-muted-foreground">{request.book_unit.code}</p>
                        </div>
                    </div>

                    <div className="border-t border-border pt-4 space-y-2.5">
                        <div className="grid grid-cols-[140px_1fr] text-sm">
                            <span className="text-muted-foreground">Borrower</span>
                            <span>{request.user.name}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] text-sm">
                            <span className="text-muted-foreground">Status</span>
                            <Badge className="w-fit" variant={
                                request.status === 'pending'  ? 'outline' :
                                request.status === 'approved' ? 'default' :
                                request.status === 'taken'    ? 'secondary' :
                                request.status === 'rejected' || request.status === 'expired' ? 'destructive' :
                                'outline'
                            }>
                                {request.status}
                            </Badge>
                        </div>
                        {request.expired_at && (
                            <div className="grid grid-cols-[140px_1fr] text-sm">
                                <span className="text-muted-foreground">Valid Until</span>
                                <span>{new Date(request.expired_at).toLocaleDateString('id-ID')}</span>
                            </div>
                        )}
                        {request.note && (
                            <div className="grid grid-cols-[140px_1fr] text-sm">
                                <span className="text-muted-foreground">Note</span>
                                <span className="text-destructive">{request.note}</span>
                            </div>
                        )}
                    </div>

                    {currentToken && (
                        <div className="border-t border-border pt-4 space-y-2.5">
                            <p className="text-sm font-medium">Pickup Token</p>
                            <p className="text-3xl font-mono font-bold tracking-widest">{currentToken.token}</p>
                            <p className="text-xs text-muted-foreground">
                                Expires at { new Date(currentToken.expired_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: true }) }
                            </p>
                            <Button variant="outline" size="sm" onClick={() => router.reload({ only: ['currentToken'] })}>
                                Refresh Token
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}