import { useMediaLightbox, MediaItem } from '@/components/MediaLightbox';

/**
 * Example usage of MediaLightbox component
 * Shows how to use with images and videos
 */
export default function MediaLightboxExample() {
  // Example media with mixed images and videos
  const media: MediaItem[] = [
    {
      type: 'IMAGE',
      src: 'https://picsum.photos/1920/1080?random=1',
      alt: 'Beautiful landscape',
      title: 'Sunset at the beach',
      description: 'A stunning sunset captured at the California coast',
    },
    {
      type: 'IMAGE',
      src: 'https://picsum.photos/1920/1080?random=2',
      alt: 'Mountain view',
      title: 'Mountain peaks',
    },
    {
      type: 'VIDEO',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      poster:
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
      title: 'Big Buck Bunny',
      description: 'Sample video file',
      width: 1920,
      height: 1080,
    },
    {
      type: 'IMAGE',
      src: 'https://picsum.photos/1920/1080?random=3',
      alt: 'City lights',
      title: 'Night cityscape',
    },
  ];

  const { openLightbox, LightboxComponent } = useMediaLightbox(media);

  return (
    <div className='container mx-auto p-8'>
      <h1 className='text-2xl font-bold mb-6'>Media Gallery Example</h1>

      <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
        {media.map((item, index) => (
          <div
            key={index}
            className='relative aspect-square cursor-pointer overflow-hidden rounded-lg border border-border hover:opacity-80 transition-opacity'
            onClick={() => openLightbox(index)}
          >
            {item.type === 'IMAGE' ? (
              <img src={item.src} alt={item.alt} className='w-full h-full object-cover' />
            ) : (
              <div className='relative w-full h-full'>
                <img
                  src={item.poster || 'https://via.placeholder.com/400x300?text=Video'}
                  alt={item.alt}
                  className='w-full h-full object-cover'
                />
                {/* Play icon overlay */}
                <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                  <svg className='w-16 h-16 text-white' fill='currentColor' viewBox='0 0 20 20'>
                    <path d='M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z' />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Lightbox component */}
      {LightboxComponent}
    </div>
  );
}
