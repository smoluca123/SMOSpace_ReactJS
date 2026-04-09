import { IMediaDataType } from '@/lib/types/interfaces';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface PostMediaGridProps {
  media: IMediaDataType[];
  onImageClick?: (index: number) => void;
}

export default function PostMediaGrid({ media, onImageClick }: PostMediaGridProps) {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set());

  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  };

  if (media.length === 0) return null;

  // Render single image
  if (media.length === 1) {
    return (
      <div className='relative aspect-[16/9] overflow-hidden'>
        <img
          src={media[0].url}
          alt={`Post image 1`}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300 border-2 border-black cursor-pointer hover:opacity-90',
            loadedImages.has(0) ? 'opacity-100' : 'opacity-0',
          )}
          loading='lazy'
          onClick={() => onImageClick?.(0)}
          onLoad={() => handleImageLoad(0)}
        />
      </div>
    );
  }

  // Render two images
  if (media.length === 2) {
    return (
      <div className='grid grid-cols-2 gap-1'>
        {media.map((image, index) => (
          <div key={image.url} className='relative overflow-hidden aspect-square'>
            <img
              src={image.url}
              alt={`Post image ${index + 1}`}
              className={cn(
                'w-full h-full object-cover transition-opacity duration-300 border-2 border-black cursor-pointer hover:opacity-90',
                loadedImages.has(index) ? 'opacity-100' : 'opacity-0',
              )}
              loading='lazy'
              onClick={() => onImageClick?.(index)}
              onLoad={() => handleImageLoad(index)}
            />
          </div>
        ))}
      </div>
    );
  }

  // Render three images
  if (media.length === 3) {
    return (
      <div className='grid grid-cols-2 gap-1'>
        <div className='relative overflow-hidden'>
          <img
            src={media[0].url}
            alt='Post image 1'
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300 border-2 border-black cursor-pointer hover:opacity-90',
              loadedImages.has(0) ? 'opacity-100' : 'opacity-0',
            )}
            loading='lazy'
            onClick={() => onImageClick?.(0)}
            onLoad={() => handleImageLoad(0)}
          />
        </div>
        <div className='grid grid-rows-2 gap-1'>
          {media.slice(1).map((image, index) => (
            <div key={image.url} className='relative aspect-[4/3] overflow-hidden'>
              <img
                src={image.url}
                alt={`Post image ${index + 2}`}
                className={cn(
                  'w-full h-full object-cover transition-opacity duration-300 border-2 border-black cursor-pointer hover:opacity-90',
                  loadedImages.has(index + 1) ? 'opacity-100' : 'opacity-0',
                )}
                loading='lazy'
                onClick={() => onImageClick?.(index + 1)}
                onLoad={() => handleImageLoad(index + 1)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Render four or more images
  return (
    <div className='grid grid-cols-2 gap-1'>
      {media.slice(0, 4).map((image, index) => (
        <div key={image.url} className='relative overflow-hidden aspect-square'>
          <img
            src={image.url}
            alt={`Post image ${index + 1}`}
            className={cn(
              'w-full h-full object-cover transition-opacity duration-300 border-2 border-black cursor-pointer hover:opacity-90',
              loadedImages.has(index) ? 'opacity-100' : 'opacity-0',
            )}
            loading='lazy'
            onClick={() => onImageClick?.(index)}
            onLoad={() => handleImageLoad(index)}
          />
          {index === 3 && media.length > 4 && (
            <div
              className='absolute inset-0 flex items-center justify-center text-2xl font-bold text-white cursor-pointer bg-black/50'
              onClick={() => onImageClick?.(3)}
            >
              +{media.length - 4}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
