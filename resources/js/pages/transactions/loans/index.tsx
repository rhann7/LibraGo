import { Link as InertiaLink, router } from "@inertiajs/react";
import { BookOpen, Download, Eye, Plus, Search } from "lucide-react";
import type { FormEventHandler } from "react";
import { route } from "ziggy-js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLoanForm } from "@/hooks/use-loan-form";
import DataTableLayout from "@/layouts/data-table-layout";
import type { BreadcrumbItem } from "@/types/navigation";
import type { Loan } from "@/types/transaction";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Loans', href: route('loans.index') },
];

interface Props {
    loans: {
        data: Loan[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: {
        search?: string;
        status?: string;
    };
    can: {
        store: boolean;
        return: boolean;
    };
}

export default function LoanIndex({ loans, filters, can }: Props) {
    const { open, step, loanRequest, tokenForm, tokenError, isLoading, form, openCreate, close, validateToken, submit } = useLoanForm();

    const handleSearch: FormEventHandler<HTMLInputElement> = (e) => {
        router.get(route('loans.index'), { ...filters, search: e.currentTarget.value }, { preserveState: true, replace: true });
    };

    const handleExport = () => {
        const params = new URLSearchParams(window.location.search).toString();
        window.location.href = route('export.loans') + (params ? `?${params}` : '');
    }

    const filterWidget = (
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input defaultValue={filters.search ?? ''} onInput={handleSearch} placeholder="Search loans..." className="pl-9 w-64" />
            </div>
            <Select value={filters.status ?? 'all'} onValueChange={(val) => router.get(route('loans.index'), { ...filters, status: val === 'all' ? undefined : val }, { preserveState: true, replace: true })}>
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );

    const actions = can.store ? (
        <>
            <Button onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" /> Export
            </Button>

            <Button onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" /> New Loan
            </Button>
        </>
    ) : (
        <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
        </Button>
    );

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);

    return (
        <>
            <DataTableLayout
                title="Loans"
                description="Manage book loans"
                breadcrumbs={breadcrumbs}
                actions={actions}
                filterWidget={filterWidget}
                pagination={loans}
                isEmpty={loans.data.length === 0}
                emptyStateTitle="No loans found"
                emptyStateDescription="Try adjusting your search or filters."
            >
                <table className="w-full text-sm">
                    <thead className="border-b border-border/50 bg-muted/30">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">No</th>
                            {can.return ? (
                                <>
                                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">User ID</th>
                                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Book Unit ID</th>
                                </>
                            ) : (
                                <>
                                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Book</th>
                                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Unit Code</th>
                                </>
                            )}
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Status</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Borrowed At</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Due Date</th>
                            <th className="px-6 py-3 text-right font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {loans.data.map((loan, index) => (
                            <tr key={loan.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-6 py-4 text-muted-foreground">{(loans.from ?? 0) + index}</td>
                                {can.return ? (
                                    <>
                                        <td className="px-6 py-4 text-muted-foreground">{loan.user.id}</td>
                                        <td className="px-6 py-4">
                                            <InertiaLink
                                                href={route('book-units.index', { id: loan.book_unit.id })}
                                                className="font-mono text-primary underline-offset-4 hover:underline"
                                            >
                                                {loan.book_unit.id}
                                            </InertiaLink>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {loan.book_unit.book.cover_url ? (
                                                    <img src={loan.book_unit.book.cover_url} alt={loan.book_unit.book.title} className="h-10 w-7 rounded-sm object-cover" />
                                                ) : (
                                                    <div className="h-10 w-7 rounded-sm bg-muted flex items-center justify-center">
                                                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground/50" />
                                                    </div>
                                                )}
                                                <span className="max-w-48 truncate">{loan.book_unit.book.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-muted-foreground">{loan.book_unit.code}</td>
                                    </>
                                )}
                                <td className="px-6 py-4">
                                    <Badge variant={
                                        loan.is_overdue ? 'destructive' :
                                        loan.status === 'active' ? 'default' :
                                        'secondary'
                                    }>
                                        {loan.is_overdue ? 'overdue' : loan.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {new Date(loan.borrowed_at).toLocaleDateString('id-ID')}
                                </td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    <span className={loan.is_overdue ? 'text-destructive font-medium' : ''}>
                                        {new Date(loan.due_date).toLocaleDateString('id-ID')}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <InertiaLink href={route('loans.show', { loan: loan.id })}>
                                                        <Button size="sm" variant="outline">
                                                            <Eye className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </InertiaLink>
                                                </TooltipTrigger>
                                                <TooltipContent>{can.return ? 'Process Return' : 'View'}</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DataTableLayout>

            <Dialog open={open} onOpenChange={close}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Loan</DialogTitle>
                        <DialogDescription>
                            {step === 'token' ? 'Enter the pickup token from the user.' : 'Confirm loan details below.'}
                        </DialogDescription>
                    </DialogHeader>

                    {step === 'token' ? (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="token">Pickup Token</Label>
                                <Input id="token" value={tokenForm.data.token} onChange={e => tokenForm.setData('token', e.target.value.toUpperCase())} placeholder="8-character token" className="font-mono" maxLength={8} />
                                {tokenError && <p className="text-sm text-destructive">{tokenError}</p>}
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={close}>Cancel</Button>
                                <Button type="button" disabled={tokenForm.data.token.length !== 8 || isLoading} onClick={validateToken}>
                                    {isLoading ? 'Validating...' : 'Validate'}
                                </Button>
                            </DialogFooter>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="rounded-md border border-border bg-muted/20 p-4 space-y-2.5">
                                <div className="flex items-center gap-3">
                                    {loanRequest?.book_unit.book.cover_url ? (
                                        <img src={loanRequest.book_unit.book.cover_url} alt={loanRequest.book_unit.book.title} className="h-14 w-10 rounded-sm object-cover border border-border" />
                                    ) : (
                                        <div className="h-14 w-10 rounded-sm bg-muted flex items-center justify-center border border-border">
                                            <BookOpen className="h-4 w-4 text-muted-foreground/50" />
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <p className="font-medium text-sm">{loanRequest?.book_unit.book.title}</p>
                                        <p className="text-xs font-mono text-muted-foreground">{loanRequest?.book_unit.code}</p>
                                    </div>
                                </div>
                                <div className="border-t border-border pt-2.5 space-y-2">
                                    <div className="grid grid-cols-[120px_1fr] text-sm">
                                        <span className="text-muted-foreground">Borrower</span>
                                        <span>{loanRequest?.user.name}</span>
                                    </div>
                                    <div className="grid grid-cols-[120px_1fr] text-sm">
                                        <span className="text-muted-foreground">Borrowed At</span>
                                        <span>{new Date().toLocaleDateString('id-ID')}</span>
                                    </div>
                                    <div className="grid grid-cols-[120px_1fr] text-sm">
                                        <span className="text-muted-foreground">Due Date</span>
                                        <span>{dueDate.toLocaleDateString('id-ID')}</span>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={close}>Cancel</Button>
                                <Button type="button" disabled={form.processing} onClick={submit}>
                                    Confirm Loan
                                </Button>
                            </DialogFooter>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </>
    );
}