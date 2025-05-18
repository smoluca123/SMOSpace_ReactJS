import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';

export default function PostMediaItem({
  mediaItem,
  onRemove,
}: {
  mediaItem: File;
  onRemove: () => void;
}) {
  const [itemUrl, setItemUrl] = useState<string | null>(null);

  useEffect(() => {
    setItemUrl(URL.createObjectURL(mediaItem));

    return () => {
      if (itemUrl) {
        URL.revokeObjectURL(itemUrl);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaItem]);

  return (
    <div className='overflow-hidden relative w-20 h-20 rounded-md group'>
      <img src={itemUrl || ''} alt='' className='object-cover w-full h-full' />
      <div className='hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:block'>
        <button className='p-2 rounded-full bg-muted' onClick={onRemove}>
          <Trash2 className='w-4 h-4' />
        </button>
      </div>
    </div>
  );
}
