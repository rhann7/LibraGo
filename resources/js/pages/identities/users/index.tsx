import { router } from "@inertiajs/react";
import { Search, Trash2, User } from "lucide-react";
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
    { title: 'Users', href: route('users.index') },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    avatar_url: string | null;
    created_at: string;
}

interface Props {
    users: {
        data: User[];
        links: { url: string | null; label: string; active: boolean }[];
        from: number | null;
        to: number | null;
        total: number;
    };
    filters: { search?: string; role?: string };
}

export default function UserIndex({ users, filters }: Props) {
    const handleSearch: FormEventHandler<HTMLInputElement> = (e) => {
        router.get(route('users.index'), { ...filters, search: e.currentTarget.value }, { preserveState: true, replace: true });
    };

    const handleDestroy = (user: User) => {
        if (confirm(`Delete "${user.name}"?`)) {
            router.delete(route('users.destroy', user.id), { preserveScroll: true });
        }
    };

    const filterWidget = (
        <div className="flex items-center gap-3">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input defaultValue={filters.search ?? ''} onInput={handleSearch} placeholder="Search users..." className="pl-9 w-64" />
            </div>
            <Select value={filters.role ?? 'all'} onValueChange={(val) => router.get(route('users.index'), { ...filters, role: val === 'all' ? undefined : val }, { preserveState: true, replace: true })}>
                <SelectTrigger className="w-36">
                    <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );

    return (
        <DataTableLayout
            title="Users"
            description="Manage registered user accounts"
            breadcrumbs={breadcrumbs}
            filterWidget={filterWidget}
            pagination={users}
            isEmpty={users.data.length === 0}
            emptyStateTitle="No users found"
            emptyStateDescription="Try adjusting your search or filters."
        >
            <table className="w-full text-sm">
                <thead className="border-b border-border/50 bg-muted/30">
                    <tr>
                        <th className="px-6 py-3 text-left font-medium text-muted-foreground w-12">No</th>
                        <th className="px-6 py-3 text-left font-medium text-muted-foreground w-12">Avatar</th>
                        <th className="px-6 py-3 text-left font-medium text-muted-foreground">Name</th>
                        <th className="px-6 py-3 text-left font-medium text-muted-foreground">Email</th>
                        <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">Role</th>
                        <th className="px-6 py-3 text-left font-medium text-muted-foreground whitespace-nowrap">Joined At</th>
                        <th className="px-6 py-3 text-right font-medium text-muted-foreground">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-border/30">
                    {users.data.map((user, index) => (
                        <tr key={user.id} className="hover:bg-muted/20 transition-colors">
                            <td className="px-6 py-4 text-muted-foreground">{(users.from ?? 0) + index}</td>
                            <td className="px-6 py-4">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.name} className="h-8 w-8 rounded-full object-cover" />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                                        <User className="h-4 w-4 text-muted-foreground/50" />
                                    </div>
                                )}
                            </td>
                            <td className="px-6 py-4 font-medium">{user.name}</td>
                            <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                            <td className="px-6 py-4">
                                <Badge variant={user.role === 'student' ? 'default' : 'secondary'}>
                                    {user.role}
                                </Badge>
                            </td>
                            <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                                {new Date(user.created_at).toLocaleDateString('id-ID')}
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex justify-end gap-2">
                                    <TooltipProvider delayDuration={0}>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button size="sm" variant="destructive" onClick={() => handleDestroy(user)}>
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>Delete</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </DataTableLayout>
    );
}