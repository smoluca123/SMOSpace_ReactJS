import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatDate, formatDistanceToNowStrict } from 'date-fns';

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
