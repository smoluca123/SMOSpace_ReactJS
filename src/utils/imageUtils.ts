import imageCompression from 'browser-image-compression';
import { IMAGE_COMPRESSION, POST_LIMITS, POST_VALIDATION_MESSAGES } from '@/constants/post';

/**
 * Validate image file
 * @param file - File to validate
 * @returns Error message if invalid, null if valid
 */
export function validateImage(file: File): string | null {
  // Check file size
  if (file.size > POST_LIMITS.MAX_IMAGE_SIZE_BYTES) {
    return POST_VALIDATION_MESSAGES.FILE_TOO_LARGE(file.name, POST_LIMITS.MAX_IMAGE_SIZE_MB);
  }

  // Check file type
  const acceptedTypes = POST_LIMITS.ACCEPTED_IMAGE_TYPES as readonly string[];
  if (!acceptedTypes.includes(file.type)) {
    return POST_VALIDATION_MESSAGES.INVALID_FILE_TYPE(file.name);
  }

  return null;
}

/**
 * Compress image file
 * @param file - File to compress
 * @returns Compressed file or original if compression fails
 */
export async function compressImage(file: File): Promise<File> {
  try {
    const options = {
      maxSizeMB: IMAGE_COMPRESSION.MAX_SIZE_MB,
      maxWidthOrHeight: IMAGE_COMPRESSION.MAX_WIDTH_OR_HEIGHT,
      useWebWorker: IMAGE_COMPRESSION.USE_WEB_WORKER,
    };

    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.warn(POST_VALIDATION_MESSAGES.COMPRESSION_FAILED, error);
    return file; // Return original file if compression fails
  }
}

/**
 * Validate and compress multiple images
 * @param files - Files to process
 * @returns Object with valid compressed files and error messages
 */
export async function processImages(files: File[]): Promise<{
  validFiles: File[];
  errors: string[];
}> {
  const validFiles: File[] = [];
  const errors: string[] = [];

  for (const file of files) {
    // Validate
    const error = validateImage(file);
    if (error) {
      errors.push(error);
      continue;
    }

    // Compress
    const compressedFile = await compressImage(file);
    validFiles.push(compressedFile);
  }

  return { validFiles, errors };
}
