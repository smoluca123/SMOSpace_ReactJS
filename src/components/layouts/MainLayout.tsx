import Header from '@/components/Header';
import { Toaster } from '@/components/ui/toaster';
import LeftSidebar from '@/modules/home/components/LeftSidebar';
import Sidebar from '@/modules/home/components/Sidebar';
import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <section className='min-h-dvh'>
      <Header />

      <div className='container flex px-2 mx-auto mt-6 lg:gap-6 sm:px-0'>
        <LeftSidebar className='hidden lg:block' />
        {children || <Outlet />}
        <Sidebar />
        <Toaster />
      </div>
    </section>
  );
}
