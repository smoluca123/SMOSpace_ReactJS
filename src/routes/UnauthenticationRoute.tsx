import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { PropsWithChildren } from 'react';
import { Navigate } from 'react-router-dom';

export default function UnauthenticationRoute({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAppSelector(selectAuth);
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
}
