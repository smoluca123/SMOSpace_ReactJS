// Query keys for React Query
export const QUERY_KEYS = {
  // Posts
  POSTS: ['posts'] as const,
  POST: (id: string) => ['post', id] as const,
  FOLLOWING_POSTS: ['following-posts'] as const,

  // AI Generation
  GENERATE_POST: ['generate-post'] as const,
  GENERATE_IMAGES: ['generate-images'] as const,
  CALCULATE_IMAGE_PRICE: ['calculate-image-price'] as const,

  // User
  USER: (userId: string) => ['user', userId] as const,
  CURRENT_USER: ['current-user'] as const,
} as const;
