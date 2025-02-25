import { useEffect, useRef, useState } from 'react';
import { formatDistanceToNowStrict, parseISO } from 'date-fns';

export default function useTimeDistance({ dateString }: { dateString: string }) {
  const [distance, setDistance] = useState<string>('');
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    const date = parseISO(dateString);
    const currentDate = new Date();
    function updateDistance() {
      const distanceString = formatDistanceToNowStrict(date, {
        addSuffix: true,
      });
      setDistance(distanceString);
    }

    updateDistance();
    if (currentDate.getTime() - date.getTime() < 1 * 60 * 60 * 1000) {
      timer.current = setInterval(updateDistance, 60 * 1000); // Update every minute
    }
    return () => clearInterval(timer.current || undefined); // Clean up the interval when the component unmounts
  }, [dateString]);
  return distance;
}
