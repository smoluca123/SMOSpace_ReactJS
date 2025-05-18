import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDate, formatDistanceToNowStrict } from 'date-fns';
import { ICroppedAreaType } from '@/lib/types/interfaces';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeDate(from: Date) {
  const currentDate = new Date();

  if (currentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (currentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, 'MMM d');
    } else {
      return formatDate(from, 'MMM d, yyyy');
    }
  }
}

export const formatNumber = (number: number) => {
  return Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number);
};

export const getTimeFromDate = (date: Date = new Date()) => {
  const hours = date.getHours();
  const period = hours < 12 ? 'AM' : 'PM';
  const isMorning = !!(hours >= 0 && hours < 12);
  const isAfternoon = !!(hours >= 12 && hours < 18);
  const isEvening = !!(hours >= 18 && hours < 24);
  return { date, period, isMorning, isAfternoon, isEvening };
};

export const getCroppedImg = ({
  imageSrc,
  croppedAreaPixels,
  isCircle = false,
  format = 'png',
}: {
  imageSrc: string;
  croppedAreaPixels: ICroppedAreaType;
  isCircle?: boolean;
  format?: 'png' | 'jpeg' | 'webp';
}): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { alpha: true });

      // Đặt kích thước canvas bằng kích thước phần đã cắt
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      if (!ctx) return;

      // Xóa canvas để đảm bảo nền trong suốt
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Vẽ phần ảnh đã cắt lên canvas
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
      );

      // Nếu yêu cầu hình tròn, ta sẽ vẽ hình tròn lên canvas
      if (isCircle) {
        ctx.globalCompositeOperation = 'destination-in';
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Trả về ảnh đã cắt dưới dạng Blob với định dạng PNG để giữ độ trong suốt
      canvas.toBlob((blob) => {
        if (!blob) return;
        resolve(blob);
      }, 'image/' + format);
    };

    image.onerror = (error) => reject(error);
  });
};

export const blobToFile = (blob: Blob, fileName?: string) => {
  if (!fileName) fileName = Date.now() + '_' + 'image';
  return new File([blob], fileName, { type: blob.type });
};

export const handleMaskEmail = (email: string | undefined): string | undefined => {
  if (!email) return;
  const [local, domain] = email.split('@');
  const visiblePart = local.slice(-2);
  const fristChar = local.slice(0, 1);
  const maskedPart = '*'.repeat(local.length - 3);
  return fristChar + maskedPart + visiblePart + '@' + domain;
};
