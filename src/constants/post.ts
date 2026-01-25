// Post-related constants and limits
export const POST_LIMITS = {
  MAX_IMAGES: 10,
  MAX_IMAGE_SIZE_MB: 5,
  MAX_IMAGE_SIZE_BYTES: 5 * 1024 * 1024, // 5MB in bytes
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] as const,
  ACCEPTED_IMAGE_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp', '.gif'] as const,
} as const;

// Image compression settings
export const IMAGE_COMPRESSION = {
  MAX_SIZE_MB: 1,
  MAX_WIDTH_OR_HEIGHT: 1920,
  USE_WEB_WORKER: true,
} as const;

// Post validation messages
export const POST_VALIDATION_MESSAGES = {
  FILE_TOO_LARGE: (filename: string, maxSizeMB: number) =>
    `${filename} exceeds ${maxSizeMB}MB file size limit`,
  INVALID_FILE_TYPE: (filename: string) => `${filename} is not a supported image format`,
  TOO_MANY_IMAGES: (maxImages: number) => `You can only upload up to ${maxImages} images`,
  COMPRESSION_FAILED: 'Image compression failed, using original file',
} as const;
