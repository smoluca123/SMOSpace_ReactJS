import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { PropsWithChildren } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

export default function UnauthenticationRoute({ children }: PropsWithChildren) {
  // Get the search parameters from the URL
  const [searchParams] = useSearchParams();

  // Retrieve the 'from' parameter from the search parameters
  const fromParam = searchParams.get('from');

  // If there is a 'from' parameter, decode it; otherwise, default to '/'
  const from = fromParam ? decodeURIComponent(fromParam) : '/';

  // Get the authentication status from Redux
  const { isAuthenticated } = useAppSelector(selectAuth);

  // If the user is authenticated, redirect to the 'from' page
  if (isAuthenticated) return <Navigate to={from} replace />;

  // If not authenticated, render the children
  return <>{children}</>;
}
