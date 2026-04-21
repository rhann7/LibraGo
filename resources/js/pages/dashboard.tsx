import { Head, usePage } from '@inertiajs/react';
import { AlertCircle, BookMarked, BookOpen, Users } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { route } from 'ziggy-js';
import PageHeader from '@/components/page-header';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: route('dashboard'),
    },
];

interface AdminStats {
    users: { total: number; students: number; teachers: number };
    books: { total: number; units: number };
    loans: { total: number; pending: number; active: number; returned: number; overdue: number };
}

interface UserStats {
    total: number;
    active: number;
    overdue: number;
    chart: { month: string; total: number }[];
}

interface ActivityItem {
    type: 'request' | 'returned' | 'overdue';
    message: string;
    time: string;
}

interface ChartData {
    month: string;
    total: number;
}

interface Activity {
    chart: ChartData[];
    recent: ActivityItem[];
}

interface Props {
    stats: AdminStats | UserStats;
    activity: Activity | null;
}

export default function Dashboard({ stats, activity }: Props) {
    const { auth } = usePage().props;
    const roles = auth.roles;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-6">
                <PageHeader title={`Welcome back, ${auth.user.name.split(' ')[0]}`} description={`You are logged in as ${roles}`} />

                <div className="grid auto-rows-min gap-4 md:grid-cols-3">
                    {'users' in stats ? (
                        <>
                            <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">Total Users</p>
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-3xl font-bold">{stats.users.total}</p>
                                <p className="text-xs text-muted-foreground">{stats.users.students} students and {stats.users.teachers} teachers registered.</p>
                            </div>
                            <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">Total Books</p>
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-3xl font-bold">{stats.books.total}</p>
                                <p className="text-xs text-muted-foreground">{stats.books.units} units available across all titles.</p>
                            </div>
                            <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">Total Loans</p>
                                    <BookMarked className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-3xl font-bold">{stats.loans.total}</p>
                                <p className="text-xs text-muted-foreground">{stats.loans.active} active, {stats.loans.pending} pending, {stats.loans.overdue} overdue.</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">Total Loans</p>
                                    <BookMarked className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-3xl font-bold">{stats.total}</p>
                                <p className="text-xs text-muted-foreground">All loans you have made so far.</p>
                            </div>
                            <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">Active Loans</p>
                                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-3xl font-bold">{stats.active}</p>
                                <p className="text-xs text-muted-foreground">Books currently in your possession.</p>
                            </div>
                            <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-5 space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-muted-foreground">Overdue Loans</p>
                                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-3xl font-bold">{stats.overdue}</p>
                                <p className="text-xs text-muted-foreground">Books that have passed their due date.</p>
                            </div>
                        </>
                    )}
                </div>

                {activity && (
                    <div className="space-y-4">
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6 space-y-4">
                                <p className="font-medium">Loan Trend (Last 6 Months)</p>
                                <ResponsiveContainer width="100%" height={200}>
                                    <BarChart data={activity.chart} barSize={32}>
                                        <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                        <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                                        <Tooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                            contentStyle={{ fontSize: 12, borderRadius: 8, backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                            labelStyle={{ color: '#fff' }}
                                            itemStyle={{ color: '#a3a3a3' }}
                                        />
                                        <Bar dataKey="total" radius={[4, 4, 0, 0]} fill="#22C55E" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {'users' in stats && (
                                <>
                                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6 space-y-4">
                                        <p className="font-medium">Users</p>
                                        <ResponsiveContainer width="100%" height={200}>
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: 'Students', value: stats.users.students },
                                                        { name: 'Teachers', value: stats.users.teachers },
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={55}
                                                    outerRadius={80}
                                                    paddingAngle={3}
                                                    dataKey="value"
                                                >
                                                    <Cell fill="#EF4444" />
                                                    <Cell fill="#C2C522" />
                                                </Pie>
                                                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, backgroundColor: '#1a1a1a', border: '1px solid #333' }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#a3a3a3' }} />
                                                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6 space-y-4">
                                        <p className="font-medium">Loans</p>
                                        <ResponsiveContainer width="100%" height={200}>
                                            <PieChart>
                                                <Pie
                                                    data={[
                                                        { name: 'Pending', value: stats.loans.pending },
                                                        { name: 'Active', value: stats.loans.active },
                                                        { name: 'Returned', value: stats.loans.returned },
                                                        { name: 'Overdue', value: stats.loans.overdue },
                                                    ]}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={55}
                                                    outerRadius={80}
                                                    paddingAngle={3}
                                                    dataKey="value"
                                                >
                                                    <Cell fill="#C2C522" />
                                                    <Cell fill="#22C55E" />
                                                    <Cell fill="#6366F1" />
                                                    <Cell fill="#EF4444" />
                                                </Pie>
                                                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, backgroundColor: '#1a1a1a', border: '1px solid #333' }} labelStyle={{ color: '#fff' }} itemStyle={{ color: '#a3a3a3' }} />
                                                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6">
                            <p className="font-medium mb-4">Recent Activity</p>
                            {activity.recent.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-4">No recent activity.</p>
                            ) : (
                                <div className="flex flex-col gap-3">
                                    {activity.recent.map((item, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${
                                                item.type === 'request' ? 'bg-blue-500' :
                                                item.type === 'returned' ? 'bg-green-500' :
                                                'bg-red-500'
                                            }`} />
                                            <div className="flex items-baseline gap-3 min-w-0">
                                                <p className="text-sm leading-snug">{item.message}</p>
                                                <p className="text-xs text-muted-foreground shrink-0">
                                                    {new Date(item.time).toLocaleDateString('id-ID', {
                                                        day: 'numeric', month: 'short', year: 'numeric',
                                                        hour: '2-digit', minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {'chart' in stats && (
                    <div className="flex-1 rounded-xl border border-sidebar-border/70 dark:border-sidebar-border p-6 space-y-4">
                        <p className="font-medium">My Loan Trend (Last 6 Months)</p>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={stats.chart} barSize={64}>
                                <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={24} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ fontSize: 12, borderRadius: 8, backgroundColor: '#1a1a1a', border: '1px solid #333' }}
                                    labelStyle={{ color: '#fff' }}
                                    itemStyle={{ color: '#a3a3a3' }}
                                />
                                <Bar dataKey="total" radius={[4, 4, 0, 0]} fill="#22C55E" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}