import Header from '@/components/Header';
import LeftSidebar from '@/modules/home/components/LeftSidebar';
import Sidebar from '@/modules/home/components/Sidebar';
import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';

export default function MainLayout({ children }: PropsWithChildren) {
  return (
    <section className='min-h-dvh bg-background'>
      <Header />

      <div className='container flex gap-6 px-2 mx-auto mt-6 sm:px-0'>
        <LeftSidebar className='hidden lg:block' />
        {children || <Outlet />}
        <Sidebar />
      </div>
    </section>
  );
}
