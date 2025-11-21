import { Outlet } from 'react-router';

import { requireAuthMiddleware } from '@/lib/middlewares.server';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@gaming/ui/components/breadcrumb';
import { Separator } from '@gaming/ui/components/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@gaming/ui/components/sidebar';

import type { Route } from './+types/route';
import { AppSidebar } from './app-sidebar';

export const middleware: Route.MiddlewareFunction[] = [requireAuthMiddleware];

/**
 * By adding a `loader`, we force the `requireAuthMiddleware` to run on every
 * client-side navigation involving this route.
 *
 * Without it, the middleware would only run on the initial page load.
 */
export async function loader() {
  return null;
}

export default function DashboarLayout() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Building Your Application</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <main className="flex-1 h-full overflow-auto p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
