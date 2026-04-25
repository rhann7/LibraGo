import { router } from "@inertiajs/react";
import { BookOpen, CheckCircle, Download, Search } from "lucide-react";
import type { FormEventHandler } from "react";
import { route } from "ziggy-js";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import DataTableLayout from "@/layouts/data-table-layout";
import type { BreadcrumbItem } from "@/types";

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Fines', href: route('fines.index') },
];

interface Fine {
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
}

interface Props {
    fines: {
        data: Fine[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search?: string; status?: string; type?: string };
    can: { update: boolean };
}

export default function FineIndex({ fines, filters, can }: Props) {
    const handleSearch: FormEventHandler<HTMLInputElement> = (e) => {
        router.get(route('fines.index'), { ...filters, search: e.currentTarget.value }, { preserveState: true, replace: true });
    };

    const handleMarkPaid = (fine: Fine) => {
        if (confirm(`Mark fine for "${fine.user.name}" as paid?`)) {
            router.patch(route('fines.update', fine.id), {}, { preserveScroll: true });
        }
    };

    const handleExport = () => {
        const params = new URLSearchParams(window.location.search).toString();
        window.location.href = route('export.fines') + (params ? `?${params}` : '');
    };

    const filterWidget = (
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input defaultValue={filters.search ?? ''} onInput={handleSearch} placeholder="Search fines..." className="pl-9 w-64" />
            </div>
            <Select value={filters.type ?? 'all'} onValueChange={(val) => router.get(route('fines.index'), { ...filters, type: val === 'all' ? undefined : val }, { preserveState: true, replace: true })}>
                <SelectTrigger className="w-36"><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="late">Late</SelectItem>
                    <SelectItem value="damaged">Damaged</SelectItem>
                    <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
            </Select>
            <Select value={filters.status ?? 'all'} onValueChange={(val) => router.get(route('fines.index'), { ...filters, status: val === 'all' ? undefined : val }, { preserveState: true, replace: true })}>
                <SelectTrigger className="w-40"><SelectValue placeholder="All Statuses" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="unpaid">Unpaid</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );

    const actions = (
        <Button onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
        </Button>
    );

    return (
        <DataTableLayout
            title="Fines"
            description="Manage fines"
            breadcrumbs={breadcrumbs}
            filterWidget={filterWidget}
            actions={actions}
            pagination={fines}
            isEmpty={fines.data.length === 0}
            emptyStateTitle="No fines found"
            emptyStateDescription="Try adjusting your search or filters."
        >
            <table className="w-full text-sm">
                <thead className="border-b border-border/50 bg-muted/30">
                    <tr>
                        <th className="px-6 py-3 text-left font-medium text-muted-foreground">No</th>
                        {can.update && <th className="px-6 py-3 text-left font-medium text-muted-foreground">User</th>}
                        <th className="px-6 py-3 text-left font-medium text-muted-foreground">Book</th>
                        <th className="px-6 py-3 text-left font-medium text-muted-foreground">Type</th>
                        <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">Late Days</th>
                        <th className="px-6 py-3 text-left font-medium text-muted-foreground">Amount</th>
                        <th className="px-6 py-3 text-left font-medium text-muted-foreground">Status</th>
                        <th className="px-6 py-3 text-left font-medium text-muted-foreground">Note</th>
                        <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">Created At</th>
                        {can.update && <th className="px-6 py-3 text-right font-medium text-muted-foreground">Actions</th>}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                    {fines.data.map((fine, index) => (
                        <tr key={fine.id} className="hover:bg-muted/20 transition-colors">
                            <td className="px-6 py-4 text-muted-foreground">{(fines.from ?? 0) + index}</td>
                            {can.update && <td className="px-6 py-4">{fine.user.name}</td>}
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    {fine.book.cover_url ? (
                                        <img src={fine.book.cover_url} alt={fine.book.title} className="h-10 w-7 rounded-sm object-cover" />
                                    ) : (
                                        <div className="h-10 w-7 rounded-sm bg-muted flex items-center justify-center">
                                            <BookOpen className="h-3.5 w-3.5 text-muted-foreground/50" />
                                        </div>
                                    )}
                                    <span className="max-w-48 truncate">{fine.book.title}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <Badge variant={
                                    fine.type === 'late' ? 'default' :
                                    fine.type === 'damaged' ? 'secondary' :
                                    'destructive'
                                }>
                                    {fine.type}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                                {fine.type === 'late' && fine.late_days ? `${fine.late_days} days` : '-'}
                            </td>
                            <td className="px-6 py-4 font-medium">{fine.formatted_amount}</td>
                            <td className="px-6 py-4">
                                <Badge variant={fine.status === 'paid' ? 'secondary' : 'outline'}>
                                    {fine.status}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground">
                                {fine.note || '-'}
                            </td>
                            <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                {new Date(fine.created_at).toLocaleDateString('id-ID')}
                            </td>
                            {can.update && (
                                <td className="px-6 py-4">
                                    <div className="flex justify-end gap-2">
                                        <TooltipProvider delayDuration={0}>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <Button size="sm" variant="outline" disabled={fine.status === 'paid'} onClick={() => handleMarkPaid(fine)}>
                                                        <CheckCircle className="h-3.5 w-3.5" />
                                                    </Button>
                                                </TooltipTrigger>
                                                <TooltipContent>Mark as Paid</TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </DataTableLayout>
    );
}