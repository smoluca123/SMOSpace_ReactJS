export type PropsWithClassName = {
  className?: string;
};

export interface IApiResponseWrapper<T> {
  message: string;
  data: T;
  statusCode: number;
  date: Date;
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
  date: Date;
}

export interface IUserDataType {
  id: string;
  username: string;
  email: string;
  userType: ITypeUserType;
  fullName: string;
  displayName: string;
  phoneNumber: string;
  age: number;
  avatar: string;
  isActive: boolean;
  isVerified: boolean;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
  credits: number;
}

export interface IUserWithAccessTokenType extends IUserDataType, IWithAccessTokenType {}

export interface IWithAccessTokenType {
  accessToken: string;
}

export interface ITypeUserType {
  id: string;
  typeName: string;
}

export interface IUserSessionType {
  id: string;
  expiresAt: Date;
}

export interface IPostDataType {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
  likeCount: number;
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
//   updatedAt: string;
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
