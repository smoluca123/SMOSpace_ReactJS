import { ProfileContext } from '@/contexts/ProfileContext';
import { useContext } from 'react';

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) throw new Error('useProfileProvider must be used within a ProfileProvider');
  return context;
};
