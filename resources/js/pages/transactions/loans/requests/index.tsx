import { router, Link as InertiaLink } from "@inertiajs/react";
import { BookOpen, Check, Eye, Search, X } from "lucide-react";
import type { FormEventHandler } from "react";
import { route } from "ziggy-js";
import InputError from '@/components/input-error';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useLoanRequestForm } from "@/hooks/use-loan-request-form";
import DataTableLayout from "@/layouts/data-table-layout";
import type { BreadcrumbItem } from "@/types";
import type { LoanRequest } from "@/types/transaction";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Loan Requests', href: route('loan-requests.index') },
];

interface Props {
    requests: {
        data: LoanRequest[];
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
        approve: boolean;
        reject: boolean;
    };
}

export default function LoanRequestIndex({ requests, filters, can }: Props) {
    const { rejectOpen, rejecting, rejectForm, openReject, closeReject, submitReject, approve } = useLoanRequestForm();

    const handleSearch: FormEventHandler<HTMLInputElement> = (e) => {
        router.get(route('loan-requests.index'), { ...filters, search: e.currentTarget.value }, { preserveState: true, replace: true });
    };

    const filterWidget = (
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input defaultValue={filters.search ?? ''} onInput={handleSearch} placeholder="Search requests..." className="pl-9 w-64" />
            </div>
            <Select value={filters.status ?? 'all'} onValueChange={(val) => router.get(route('loan-requests.index'), { ...filters, status: val === 'all' ? undefined : val }, { preserveState: true, replace: true })}>
                <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="taken">Taken</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );

    return (
        <>
            <DataTableLayout
                title="Loan Requests"
                description="Manage incoming loan requests"
                breadcrumbs={breadcrumbs}
                filterWidget={filterWidget}
                pagination={requests}
                isEmpty={requests.data.length === 0}
                emptyStateTitle="No loan requests found"
                emptyStateDescription="Try adjusting your search or filters."
            >
                <table className="w-full text-sm">
                    <thead className="border-b border-border/50 bg-muted/30">
                        <tr>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">No</th>
                            {can.approve ? (
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
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Note</th>
                            <th className="px-6 py-3 text-left font-medium text-muted-foreground">Expired At</th>
                            <th className="px-6 py-3 text-right font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {requests.data.map((req, index) => (
                            <tr key={req.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-6 py-4 text-muted-foreground">{(requests.from ?? 0) + index}</td>
                                {can.approve ? (
                                    <>
                                        <td className="px-6 py-4 text-muted-foreground">{req.user.id}</td>
                                        <td className="px-6 py-4">
                                            <InertiaLink
                                                href={route('book-units.index', { id: req.book_unit.id })}
                                                className="font-mono text-primary underline-offset-4 hover:underline"
                                            >
                                                {req.book_unit.id}
                                            </InertiaLink>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {req.book_unit.book.cover_url ? (
                                                    <img src={req.book_unit.book.cover_url} alt={req.book_unit.book.title} className="h-10 w-7 rounded-sm object-cover" />
                                                ) : (
                                                    <div className="h-10 w-7 rounded-sm bg-muted flex items-center justify-center">
                                                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground/50" />
                                                    </div>
                                                )}
                                                <span className="max-w-48 truncate">{req.book_unit.book.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-mono text-muted-foreground">{req.book_unit.code}</td>
                                    </>
                                )}

                                <td className="px-6 py-4">
                                    <Badge variant={
                                        req.status === 'pending'  ? 'outline' :
                                        req.status === 'approved' ? 'default' :
                                        req.status === 'taken'    ? 'secondary' :
                                        req.status === 'rejected' || req.status === 'expired' ? 'destructive' :
                                        'outline'
                                    }>
                                        {req.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-muted-foreground max-w-40 truncate">{req.note || '-'}</td>
                                <td className="px-6 py-4 text-muted-foreground">
                                    {req.expired_at ? new Date(req.expired_at).toLocaleDateString('id-ID') : '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        {can.approve && req.status === 'pending' && (
                                            <TooltipProvider delayDuration={0}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button size="sm" variant="default" onClick={() => approve(req)}>
                                                            <Check className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Approve</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                        {can.reject && req.status === 'pending' && (
                                            <TooltipProvider delayDuration={0}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button size="sm" variant="destructive" onClick={() => openReject(req)}>
                                                            <X className="h-3.5 w-3.5" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>Reject</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                        {!can.approve && (
                                            <TooltipProvider delayDuration={0}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <InertiaLink href={route('loan-requests.show', { loan_request: req.id })}>
                                                            <Button size="sm" variant="outline">
                                                                <Eye className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </InertiaLink>
                                                    </TooltipTrigger>
                                                    <TooltipContent>View</TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </DataTableLayout>

            <Dialog open={rejectOpen} onOpenChange={closeReject}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Loan Request</DialogTitle>
                        <DialogDescription>
                            Rejecting request from "{rejecting?.user.name}" for "{rejecting?.book_unit.book.title}".
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={(e) => { e.preventDefault(); submitReject(); }} className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="note">Note <span className="text-xs text-muted-foreground">(optional)</span></Label>
                            <Textarea id="note" value={rejectForm.data.note} onChange={e => rejectForm.setData('note', e.target.value)} placeholder="Reason for rejection..." className="resize-none h-24" />
                            <InputError message={rejectForm.errors.note} />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={closeReject}>Cancel</Button>
                            <Button type="submit" variant="destructive" disabled={rejectForm.processing}>Reject</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}