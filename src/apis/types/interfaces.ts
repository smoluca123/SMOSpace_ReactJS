export interface IUpdateInfomationType {
  bio?: string;
  fullName?: string;
  displayName?: string;
  phoneNumber?: string;
  age?: number;
  additionalInfo?: {
    living?: string;
    hometown?: string;
    websites?: string[];
    jobs?: string[];
    birthDate?: string | null;
  };
  typeId?: string;
  isActive?: boolean;
  isVerified?: boolean;
  isBanned?: boolean;
  credits?: number;
}
