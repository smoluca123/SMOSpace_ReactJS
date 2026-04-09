import { Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function PostMediaItem({
  mediaItem,
  onRemove,
}: {
  mediaItem: File;
  onRemove: () => void;
}) {
  const [itemUrl, setItemUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const url = URL.createObjectURL(mediaItem);
    setItemUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [mediaItem]);

  const handleImageLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className='overflow-hidden relative w-20 h-20 rounded-md group bg-muted'>
      {/* Loading skeleton */}
      {isLoading && <div className='absolute inset-0 animate-pulse bg-muted' />}

      {/* Image */}
      {itemUrl && (
        <img
          src={itemUrl}
          alt='Post media preview'
          className='object-cover w-full h-full'
          onLoad={handleImageLoad}
        />
      )}

      {/* Remove button */}
      <div className='hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:block'>
        <button
          className='p-2 rounded-full bg-destructive/90 hover:bg-destructive transition-colors'
          onClick={onRemove}
          aria-label='Remove image'
        >
          <Trash2 className='w-4 h-4 text-destructive-foreground' />
        </button>
      </div>
    </div>
  );
}
