import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,  } from '@/components/ui/sidebar';
import { type NavItem, type PageProps } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, Store, Package, Users, ClipboardList, Home, PanelsTopLeft, ShoppingBag } from 'lucide-react';
import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    
];

export function AppSidebar() {
    const user = usePage<PageProps>().props.auth?.user;
    const mainNavItems: NavItem[] = user?.role === 'admin'
        ? [
            { title: 'Admin dashboard', href: '/admin/dashboard', icon: LayoutGrid },
            { title: 'Homepage content', href: '/admin/homepage', icon: PanelsTopLeft },
            { title: 'Shops', href: '/admin/shops', icon: Store },
            { title: 'Shop owners', href: '/admin/owners', icon: Users },
            { title: 'Global catalog', href: '/admin/products', icon: Package },
            { title: 'All listings', href: '/admin/listings', icon: ClipboardList },
            { title: 'Contacts', href: '/admin/contacts', icon: Home },
        ]
        : user?.role === 'shop_owner'
          ? [
              { title: 'Owner dashboard', href: '/owner/dashboard', icon: LayoutGrid },
              { title: 'Orders', href: '/owner/orders', icon: ShoppingBag },
              { title: 'Shared catalog', href: '/owner/catalog', icon: Package },
              { title: 'My products', href: '/owner/listings', icon: Package },
          ]
          : [{ title: 'Dashboard', href: '/dashboard', icon: LayoutGrid }];

    return (
        <Sidebar 
            collapsible="icon" 
            variant="sidebar"
            className="bg-sidebar text-sidebar-foreground border-r border-sidebar-border">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            size="lg" 
                            asChild
                            className="hover:bg-sidebar-hover">
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                                <span className="ml-2 font-bold text-xl text-primary"></span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain 
                    items={mainNavItems}
                />
            </SidebarContent>

            <SidebarFooter className="border-t border-sidebar-border pt-4">
                <NavFooter 
                    items={footerNavItems}
                />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}