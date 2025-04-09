import VerifyDialog from '@/components/Auth/Verify';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { setAuthDialogOpen } from '@/redux/slices/dialogSlice';
import { PropsWithChildren, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ActiveUserGuard({ children }: PropsWithChildren) {
  const location = useLocation();
  const { user } = useAppSelector(selectAuth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!user || user.isActive) return;

    if (!user.isActive) {
      dispatch(setAuthDialogOpen({ dialogType: 'verify-email', isOpen: true }));
    }
  }, [location.pathname, dispatch, user]);

  return (
    <>
      <VerifyDialog />
      {children}
    </>
  );
}
