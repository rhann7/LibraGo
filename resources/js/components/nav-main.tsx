import { Link } from '@inertiajs/react';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import { SidebarGroup, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem } from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import type { NavItem } from '@/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

type NavSingle = {
    icon?: LucideIcon;
    title: string;
    href: string;
}

type NavGroup = {
    icon?: LucideIcon;
    title: string;
    items: NavItem[];
}

type NavEntry = NavSingle | NavGroup;

export function NavMain({ groups = [] }: { groups: NavEntry[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const isGroup = (entry: NavEntry): entry is NavGroup => 'items' in entry;

    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {groups.map((entry) => isGroup(entry) ? (
                    <Collapsible key={entry.title} asChild defaultOpen={entry.items.some(item => isCurrentUrl(item.href))} className="group/collapsible">
                        <SidebarMenuItem>
                            <CollapsibleTrigger asChild>
                                <SidebarMenuButton tooltip={entry.title}>
                                    {entry.icon && <entry.icon /> }
                                    <span>{entry.title}</span>
                                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                                </SidebarMenuButton>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                                <SidebarMenuSub>
                                    {entry.items.map((item) => (
                                        <SidebarMenuSubItem key={item.title}>
                                            <SidebarMenuSubButton asChild isActive={isCurrentUrl(item.href)}>
                                                <Link href={item.href} prefetch>
                                                    {item.icon && <item.icon />}
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuSubButton>
                                        </SidebarMenuSubItem>
                                    ))}
                                </SidebarMenuSub>
                            </CollapsibleContent>
                        </SidebarMenuItem>
                    </Collapsible>
                ) : (
                    <SidebarMenuItem key={entry.title}>
                        <SidebarMenuButton asChild isActive={isCurrentUrl(entry.href)} tooltip={{ children: entry.title }}>
                            <Link href={entry.href} prefetch>
                                {entry.icon && <entry.icon />}
                                <span>{entry.title}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}