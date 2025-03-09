import { UUID } from 'crypto';

export type PropsWithClassName = {
  className?: string;
};

export type PropsWithStyle = {
  style?: React.CSSProperties;
};

export interface IPaginationParamsType {
  page?: number;
  limit?: number;
}

export interface IApiResponseWrapper<T> {
  message: string;
  data: T;
  statusCode: number;
  date: string;
}

export interface IApiPaginationResponseWrapper<T> {
  message: string;
  data: {
    items: T[];
    totalCount: number;
    totalPage: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  statusCode: number;
  date: string;
}

export interface IAdditionalInfoType {
  birthDate: string | null;
  living: string | null;
  hometown: string | null;
  jobs: string[];
  website: string | null;
}

export interface IUserDataType {
  id: UUID;
  username: string;
  email: string;
  bio: string | null;
  userType: ITypeUserType;
  fullName: string;
  displayName: string;
  phoneNumber: string;
  age: number;
  avatar: string;
  coverImage: string;
  isActive: boolean;
  isVerified: boolean;
  isBanned: boolean;
  createdAt: string;
  upstringdAt: string;
  credits: number;
  followerCount: number;
  followingCount: number;
  postCount: number;
  additionalInfo: IAdditionalInfoType | null;
}

export interface IUserDataWithFollowedStatusType extends IUserDataType {
  isFollowedByUser: boolean;
}

export interface IUserWithAccessTokenType extends IUserDataType, IWithAccessTokenType {}

export interface IWithAccessTokenType {
  accessToken: string;
}

export interface ITypeUserType {
  id: UUID;
  typeName: 'Member' | 'VIP Member' | 'Manager' | 'Administrator';
}

export interface IUserSessionType {
  id: UUID;
  expiresAt: string;
}

export interface IPostDataType {
  id: UUID;
  content: string;
  authorId: string;
  createdAt: string;
  upstringdAt: string;
  isPrivate: boolean;
  likeCount: number;
  commentCount: number;
  author: IUserDataType;
}

export interface IPostDataWithLikedStatusType extends IPostDataType {
  isLiked: boolean;
}

// export interface IUserDataType {
//   id: string;
//   username: string;
//   fullName: string;
//   displayName: string;
//   email: string;
//   age: number;
//   phoneNumber: string;
//   isActive: boolean;
//   isVerified: boolean;
//   isBanned: boolean;
//   createdAt: string;
//   upstringdAt: string;
//   credits: number;
//   userType: IUserDataType;
//   avatar: null;
// }

export interface IGeneratePostResponseType {
  price: string;
  priceNum: number;
  currentCredits: number;
  content: string;
}

export interface ITrendingTopicType {
  hashtag: string;
  count: number;
}

export interface IFollowerType {
  id: UUID;
  followerId: UUID;
  followingId: UUID;
  createdAt: string;
  follower: IUserDataWithFollowedStatusType;
}

export interface IFollowingType {
  id: UUID;
  followerId: UUID;
  followingId: UUID;
  createdAt: string;
  following: IUserDataWithFollowedStatusType;
}

export interface IPostLikeType {
  id: UUID;
  createdAt: string;
  user: IUserDataType;
}

export interface ICommentDataType {
  id: UUID;
  content: string;
  level: number;
  createdAt: string;
  updatedAt: string;
  repliesCount: number;
  replyToId: UUID | null;
  post: IPostDataType;
  author: IUserDataType;
}

export interface IFollowUserType {
  id: UUID;
  followerId: UUID;
  followingId: UUID;
  createdAt: string;
  follower: IUserDataWithFollowedStatusType;
  following: IUserDataWithFollowedStatusType;
}
