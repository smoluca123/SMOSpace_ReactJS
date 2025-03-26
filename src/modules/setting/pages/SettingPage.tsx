import Header from '@/components/Header';
import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import SettingSidebar from '../components/SettingSidebar';
import Footer from '@/components/Footer';

export default function Setting({ children }: PropsWithChildren) {
  return (
    <section className='w-full min-h-dvh'>
      <Header />

      {/* Setting content */}
      <div className='container px-2 mx-auto mt-6 space-y-4 lg:flex md:gap-4 lg:gap-6 sm:px-0'>
        {/* Setting Sidebar */}
        <SettingSidebar />

        {/* Setting content */}
        <div className='flex-1 w-full'>{children || <Outlet />}</div>
      </div>
      <Footer />
    </section>
  );
}
