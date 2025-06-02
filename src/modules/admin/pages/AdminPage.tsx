import { PropsWithChildren, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from '../components/AdminSidebar/AdminSidebar';
import AdminHeader from '../components/AdminHeader';

export default function AdminPage({ children }: PropsWithChildren) {
  return (
    <div className='flex h-screen overflow-hidden bg-background'>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <div className='flex flex-col flex-1 overflow-hidden'>
        {/* Header */}
        <AdminHeader />

        {/* Page Content */}
        <main className='flex-1 p-4 overflow-auto md:p-6'>
          <Suspense fallback={<div className='text-muted-foreground'>Loading...</div>}>
            {children || <Outlet />}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
