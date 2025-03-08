import { ProfileCardContext } from '@/contexts/ProfileCardContext';
import { useContext } from 'react';

export default function useProfileCardContext() {
  const context = useContext(ProfileCardContext);

  if (!context) throw new Error('useProfileCardContext must be used within a ProfileCardProvider');

  return context;
}
