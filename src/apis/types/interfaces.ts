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
    birthDate?: string;
  };
}
