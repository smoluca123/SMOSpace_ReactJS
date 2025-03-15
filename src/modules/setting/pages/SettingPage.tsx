import Header from '@/components/Header';
import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import SettingSidebar from '../components/SettingSidebar';

export default function Setting({ children }: PropsWithChildren) {
  return (
    <section className='w-full min-h-dvh'>
      <Header />

      {/* Setting content */}
      <div className='container px-2 mx-auto mt-6 space-y-4 md:flex lg:gap-6 sm:px-0'>
        <SettingSidebar />
        {children || <Outlet />}
      </div>
    </section>
  );
}
