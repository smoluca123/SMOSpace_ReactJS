import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical } from 'lucide-react';
import { useState, useEffect } from 'react';

interface SortableMediaItemProps {
  id: string;
  mediaItem: File;
  onRemove: () => void;
}

export default function SortableMediaItem({ id, mediaItem, onRemove }: SortableMediaItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
  });

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

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className='flex-shrink-0 relative group' {...attributes}>
      <div className='overflow-hidden relative w-20 h-20 rounded-md bg-muted'>
        {/* Drag handle */}
        <div
          {...listeners}
          className='absolute top-1 left-1 z-10 p-1 rounded bg-black/50 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity'
        >
          <GripVertical className='w-3 h-3 text-white' />
        </div>

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
            type='button'
          >
            <Trash2 className='w-4 h-4 text-destructive-foreground' />
          </button>
        </div>
      </div>
    </div>
  );
}
