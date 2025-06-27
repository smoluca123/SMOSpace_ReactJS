import { UserType } from '@/lib/types/types';

export interface IUpdateInfomationType {
  bio?: string;
  fullName?: string;
  displayName?: string;
  phoneNumber?: string;
  age?: number;
  additionalInfo?: {
    living?: string;
    hometown?: string;
    website?: string;
    jobs?: string[];
    birthDate?: string | null;
  };
  typeId?: UserType;
  isActive?: boolean;
  isVerified?: boolean;
  isBanned?: boolean;
  credits?: number;
}
