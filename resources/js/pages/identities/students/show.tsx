import { BookOpen, Inbox } from "lucide-react";
import { route } from "ziggy-js";
import { Badge } from "@/components/ui/badge";
import AppLayout from "@/layouts/app-layout";
import type { BreadcrumbItem, StudentMaster } from "@/types";

const breadcrumbs = (student: StudentMaster): BreadcrumbItem[] => [
    { title: 'Dashboard', href: route('dashboard') },
    { title: 'Students', href: route('students.index') },
    { title: student.name, href: route('students.show', student.id) },
];

interface LoanHistory {
    id: number;
    status: 'active' | 'returned';
    is_overdue: boolean;
    borrowed_at: string;
    due_date: string;
    returned_at: string | null;
    book: {
        title: string;
        cover_url: string | null;
    };
}

interface Props {
    student: StudentMaster;
    loans: LoanHistory[];
}

export default function StudentShow({ student, loans }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs(student)}>
            <div className="space-y-6 p-6">
                <div className="rounded-md border border-border bg-card p-6 space-y-4">
                    <div className="space-y-1">
                        <p className="font-semibold text-lg">{student.name}</p>
                        <p className="text-sm font-mono text-muted-foreground">{student.nipd}</p>
                    </div>
                    <div className="border-t border-border pt-4 space-y-2.5">
                        <div className="grid grid-cols-[140px_1fr] text-sm">
                            <span className="text-muted-foreground">Class</span>
                            <span>{student.class_name}</span>
                        </div>
                        <div className="grid grid-cols-[140px_1fr] text-sm">
                            <span className="text-muted-foreground">Status</span>
                            <Badge className="w-fit" variant={student.is_registered ? 'default' : 'outline'}>
                                {student.is_registered ? 'Registered' : 'Unregistered'}
                            </Badge>
                        </div>
                        {student.student?.email && (
                            <div className="grid grid-cols-[140px_1fr] text-sm">
                                <span className="text-muted-foreground">Email</span>
                                <span>{student.student.email}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="rounded-md border border-border bg-card">
                    <div className="px-6 py-4 border-b border-border">
                        <p className="font-medium">Loan History</p>
                    </div>
                    {loans.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                            <div className="rounded-md bg-muted p-3">
                                <Inbox className="h-6 w-6 text-muted-foreground/60" />
                            </div>
                            <p className="text-sm font-medium">No loan history</p>
                            <p className="text-xs text-muted-foreground">
                                {student.is_registered ? 'This student has never borrowed a book.' : 'This student has not registered yet.'}
                            </p>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead className="border-b border-border/50 bg-muted/30">
                                <tr>
                                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Book</th>
                                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Status</th>
                                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Borrowed At</th>
                                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Due Date</th>
                                    <th className="px-6 py-3 text-left font-medium text-muted-foreground">Returned At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/30">
                                {loans.map(loan => (
                                    <tr key={loan.id} className="hover:bg-muted/20 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {loan.book.cover_url ? (
                                                    <img src={loan.book.cover_url} alt={loan.book.title} className="h-10 w-7 rounded-sm object-cover" />
                                                ) : (
                                                    <div className="h-10 w-7 rounded-sm bg-muted flex items-center justify-center">
                                                        <BookOpen className="h-3.5 w-3.5 text-muted-foreground/50" />
                                                    </div>
                                                )}
                                                <span className="max-w-48 truncate">{loan.book.title}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant={loan.is_overdue ? 'destructive' : loan.status === 'active' ? 'default' : 'secondary'}>
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
                                        <td className="px-6 py-4 text-muted-foreground">
                                            {loan.returned_at ? new Date(loan.returned_at).toLocaleDateString('id-ID') : '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}