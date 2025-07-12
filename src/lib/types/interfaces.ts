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
  websites: string[];
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
  updatedAt: string;
  credits: number;
  followerCount: number;
  followingCount: number;
  friendCount: number;
  postCount: number;
  additionalInfo: IAdditionalInfoType | null;
}

export interface IUserDataTypeWithFriendStatus extends IUserDataType {
  friend: IFriendRequestWithFriendDataType;
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
  typeName: 'USER' | 'VIP_USER' | 'MODERATOR' | 'SUPER_ADMIN';
}

export interface IUserSessionType {
  id: UUID;
  expiresAt: string;
}

export interface IMediaDataType {
  data: {
    id: string;
    url: string;
    type: string;
    size: number;
    format: string;
    createdAt: string;
    updatedAt: string;
    height: null;
    width: null;
    duration: null;
    uploadedFile: IUploadedFileType;
  };
  url: string;
}

interface IUploadedFileType {
  $metadata: IUploadedFileMetadataType;
  ETag: string;
  VersionId: string;
  Bucket: string;
  Key: string;
  Location: string;
}

interface IUploadedFileMetadataType {
  httpStatusCode: number;
  requestId: string;
  attempts: number;
  totalRetryDelay: number;
}

export interface IPostDataType {
  id: UUID;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  isPrivate: boolean;
  likeCount: number;
  commentCount: number;
  media: IMediaDataType[];
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

export interface ICroppedAreaType {
  width: number;
  height: number;
  x: number;
  y: number;
}

export interface INotificationType {
  id: string;
  isRead: boolean;
  createdAt: string;
  type: ITypeNotification;
  priority: 'NORMAL';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any;
  content: INotificationContent;
  entityType: 'FOLLOW' | 'COMMENT' | 'FRIENDSHIP';
  recipientId: string;
  readAt: null;
  sender: IUserDataType;
}

export interface IFollowNotificationType extends INotificationType {
  metadata: IFollowNotificationMetadata;
}

export interface ICommentNotificationType extends INotificationType {
  metadata: IMetadataComment;
}

export interface IFriendRequestNotificationType extends INotificationType {
  metadata: IFriendRequestNotificationMetadata;
}

interface INotificationContent {
  title: string;
  message: string;
}

interface IFollowNotificationMetadata {
  follower: IMetadataFollower;
}

interface IFriendRequestNotificationMetadata {
  friend: {
    id: UUID;
    avatar: string;
    fullName: string;
    username: string;
  };
}

interface IMetadataFollower {
  id: UUID;
  avatar: string;
  fullName: string;
  username: string;
}

interface IMetadataComment {
  postId: UUID;
  commentId: UUID;
  commentAuthor: {
    avatar: string;
    fullName: string;
    username: string;
  };
}

interface ITypeNotification {
  id: string;
  type: 'FOLLOW_USER' | 'REPLY_COMMENT' | 'COMMENT_POST' | 'FRIEND_REQUEST';
}

export interface IFriendRequestDataType {
  id: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'BLOCKED';
  createdAt: string;
  updatedAt: string;
}

export interface IFriendRequestWithUserDataType extends IFriendRequestDataType {
  user: IUserDataType;
}

export interface IFriendRequestWithFriendDataType extends IFriendRequestDataType {
  friend: IUserDataType;
}

export interface StatItem {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ElementType;
  description: string;
}
