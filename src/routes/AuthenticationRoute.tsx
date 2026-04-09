import { ITypeUserType } from '@/lib/types/interfaces';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { PropsWithChildren } from 'react';
import { Navigate, useLocation, useSearchParams } from 'react-router-dom';

interface IProps extends PropsWithChildren {
  roles?: ITypeUserType['typeName'][];
}

export default function AuthenticationRoute({ children, roles }: IProps) {
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
  const { isAuthenticated, user } = useAppSelector(selectAuth);
  // If the user is not authenticated, redirect to the login page with the 'from' parameter
  if (!isAuthenticated || !user) return <Navigate to={`/auth/login?${from}`} replace />;

  if (roles && !roles.some((role) => role === user.userType.typeName)) {
    return <Navigate to='/' replace />;
  }

  // If authenticated, render the children components
  return <>{children}</>;
}
