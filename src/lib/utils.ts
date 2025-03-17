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
}: {
  imageSrc: string;
  croppedAreaPixels: ICroppedAreaType;
  isCircle?: boolean;
}): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;

    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // Đặt kích thước canvas bằng kích thước phần đã cắt
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      if (!ctx) return;
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
        ctx.globalCompositeOperation = 'destination-in'; // Cắt phần bên ngoài hình tròn
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, 2 * Math.PI);
        ctx.fill();
      }

      // Trả về ảnh đã cắt dưới dạng Blob hoặc base64
      canvas.toBlob((blob) => {
        if (!blob) return;
        // const url = URL.createObjectURL(blob)
        resolve(blob); // Trả về Blob của ảnh đã cắt
      }, 'image/jpeg');
    };

    image.onerror = (error) => reject(error);
  });
};

export const blobToFile = (blob: Blob, fileName?: string) => {
  if (!fileName) fileName = Date.now() + '_' + 'image';
  return new File([blob], fileName, { type: blob.type });
};
