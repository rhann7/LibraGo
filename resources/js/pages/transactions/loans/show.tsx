import { router } from "@inertiajs/react";
import { BookOpen } from "lucide-react";
import { useState } from "react";
import { route } from "ziggy-js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
    can: { return: boolean };
}

export default function LoanShow({ loan, currentToken, can }: Props) {
    const [token, setToken] = useState('');
    const [note, setNote] = useState('');
    const [showFineDialog, setShowFineDialog] = useState(false);
    const [damaged, setDamaged] = useState(false);
    const [lost, setLost] = useState(false);
    const [damagePercentage, setDamagePercentage] = useState(50);
    const [fineProcessing, setFineProcessing] = useState(false);

    const bookPrice = loan.book_unit.book.price ?? 0;
    const damageFine = damaged ? Math.round(bookPrice * damagePercentage / 100) : 0;
    const lostFine = lost ? bookPrice : 0;
    const totalAdditionalFine = damageFine + lostFine;

    const handleReturn = (e: React.FormEvent) => {
        e.preventDefault();
        router.patch(route('loans.return', { loan: loan.id }), { token }, {
            preserveScroll: true,
            onSuccess: () => {
                setToken('');
                setShowFineDialog(true);
            },
        });
    };

    const handleAddFine = () => {
        if (!damaged && !lost) {
            setShowFineDialog(false);
            return;
        }
        setFineProcessing(true);
        router.post(route('loans.add-fine', { loan: loan.id }), {
            damaged,
            lost,
            damage_percentage: damagePercentage,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setShowFineDialog(false);
                setFineProcessing(false);
                setDamaged(false);
                setLost(false);
            },
            onError: () => setFineProcessing(false),
        });
    };

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
                            <Badge className="w-fit" variant={loan.status === 'overdue' ? 'destructive' : loan.status === 'active' ? 'default' : 'secondary'}>
                                {loan.status}
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
                        {loan.late_days > 0 && (
                            <div className="grid grid-cols-[140px_1fr] text-sm">
                                <span className="text-muted-foreground">Late Days</span>
                                <span className="text-destructive font-medium">{loan.late_days} days</span>
                            </div>
                        )}
                    </div>
                </div>

                {can.return && (loan.status === 'active' || loan.status === 'overdue') && (
                    <div className="rounded-md border border-border bg-card p-6 space-y-4">
                        <p className="text-sm font-medium">Process Return</p>
                        <form onSubmit={handleReturn} className="space-y-3">
                            <div className="grid gap-2">
                                <Label htmlFor="token">Return Token</Label>
                                <Input
                                    id="token"
                                    value={token}
                                    onChange={e => setToken(e.target.value.toUpperCase())}
                                    placeholder="8-character token"
                                    className="font-mono w-48"
                                    maxLength={8}
                                />
                            </div>
                            <Button type="submit" size="sm" disabled={token.length !== 8}>Process Return</Button>
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

            <Dialog open={showFineDialog} onOpenChange={setShowFineDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Additional Fines</DialogTitle>
                        <DialogDescription>
                            Return processed successfully. Is there any damage or loss to report?
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Checkbox id="damaged" checked={damaged} onCheckedChange={(val) => setDamaged(!!val)} />
                            <Label htmlFor="damaged">Book is damaged</Label>
                        </div>
                        {damaged && (
                            <div className="ml-7 space-y-2">
                                <Label>Damage Percentage ({damagePercentage}%)</Label>
                                <input type="range" min={1} max={100} value={damagePercentage} onChange={e => setDamagePercentage(Number(e.target.value))} className="w-full" />
                                <p className="text-xs text-muted-foreground">
                                    Fine: Rp {damageFine.toLocaleString('id-ID')}
                                </p>
                            </div>
                        )}

                        <div className="flex items-center gap-3">
                            <Checkbox id="lost" checked={lost} onCheckedChange={(val) => setLost(!!val)} />
                            <Label htmlFor="lost">Book is lost</Label>
                        </div>
                        {lost && (
                            <p className="ml-7 text-xs text-muted-foreground">
                                Fine: Rp {lostFine.toLocaleString('id-ID')}
                            </p>
                        )}

                        {(damaged || lost) && (
                            <div className="rounded-md bg-muted/40 border border-border p-3 text-sm">
                                <span className="text-muted-foreground">Total Additional Fine: </span>
                                <span className="font-semibold">Rp {totalAdditionalFine.toLocaleString('id-ID')}</span>
                            </div>
                        )}

                        {(damaged || lost) && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                                <Label htmlFor="note">Fine Description / Note</Label>
                                <Textarea id="note" placeholder="Contoh: Halaman 20-25 sobek atau Buku hilang saat di angkutan umum." value={note} onChange={(e) => setNote(e.target.value)} className="h-20 resize-none text-sm" />
                            </div>
                        )}

                        {bookPrice === 0 && (
                            <p className="text-xs text-destructive">
                                Warning: Book price is not set. Damaged and lost fines will be Rp 0.
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowFineDialog(false)}>Skip</Button>
                        <Button onClick={handleAddFine} disabled={fineProcessing}>
                            {damaged || lost ? 'Confirm Fines' : 'Done'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}