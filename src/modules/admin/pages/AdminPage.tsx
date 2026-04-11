import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar/AdminSidebar';
import AdminHeader from '../components/AdminHeader';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function AdminPage() {
  return (
    <SidebarProvider className='bg-pink-500' >
      <div className='flex w-full overflow-hidden h-dvh bg-background'>
        <AdminSidebar />

        <div className='flex flex-col flex-1 overflow-hidden'>
          <AdminHeader />

          <main className='flex-1 p-4 overflow-auto md:p-6'>
            <Suspense fallback={<div className='text-muted-foreground'>Loading...</div>}>
              <Outlet />
            </Suspense>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
