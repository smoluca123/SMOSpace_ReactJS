import UnauthenticationRoute from '@/routes/UnauthenticationRoute';
import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';

export default function AuthPage({ children }: PropsWithChildren) {
  return (
    <UnauthenticationRoute>
      <main className="bg-secondary">{children || <Outlet />}</main>
    </UnauthenticationRoute>
  );
}
