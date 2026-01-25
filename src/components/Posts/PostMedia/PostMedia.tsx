import { IMediaDataType } from '@/lib/types/interfaces';
import PostMediaGrid from './PostMediaGrid';
import { useMediaLightbox, MediaItem } from '@/components/MediaLightbox';

export default function PostMedia({ media }: { media: IMediaDataType[] }) {
  // Convert IMediaDataType to MediaItem format
  const mediaItems: MediaItem[] = media.map((item) => ({
    type: item.type, // Currently only images, will add video support later
    src: item.url,
    alt: `Post media`,
  }));

  const { openLightbox, LightboxComponent } = useMediaLightbox(mediaItems);

  if (media.length === 0) return null;

  return (
    <>
      <PostMediaGrid media={media} onImageClick={openLightbox} />
      {LightboxComponent}
    </>
  );
}
