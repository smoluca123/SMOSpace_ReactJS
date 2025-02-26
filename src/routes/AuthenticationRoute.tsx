import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { PropsWithChildren } from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';

export default function AuthenticationRoute({ children }: PropsWithChildren) {
  // Get the current pathname from the location
  const { pathname } = useLocation();
  // Get the search parameters from the URL
  const [searchParams] = useSearchParams();

  // Define valid paths for authentication routes
  const validPaths = ['/auth/login', '/auth/register', '/'];

  // Determine the 'from' parameter based on the current pathname and search parameters
  const from = validPaths.includes(pathname)
    ? ''
    : `from=${pathname}?${encodeURIComponent(searchParams.toString() ? '&' + searchParams.toString() : '')}`;

  // Get the authentication status from Redux
  const { isAuthenticated } = useAppSelector(selectAuth);
  // If the user is not authenticated, redirect to the login page with the 'from' parameter
  if (!isAuthenticated) return <Navigate to={`/auth/login?${from}`} replace />;
  // If authenticated, render the children components
  return <>{children}</>;
}
