import { useState } from 'react';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Video from 'yet-another-react-lightbox/plugins/video';
import Thumbnails from 'yet-another-react-lightbox/plugins/thumbnails';
import Captions from 'yet-another-react-lightbox/plugins/captions';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import { IMediaDataType } from '@/lib/types/interfaces';

export interface MediaItem {
  type: IMediaDataType['type'];
  src: string;
  alt?: string;
  title?: string;
  description?: string;
  // Video specific props
  width?: number;
  height?: number;
  poster?: string; // Thumbnail for video
}

interface MediaLightboxProps {
  media: MediaItem[];
  initialIndex?: number;
  open: boolean;
  onClose: () => void;
}

/**
 * MediaLightbox component for displaying images and videos in a lightbox
 * Supports zoom, thumbnails, captions, and video playback
 *
 * @example
 * ```tsx
 * const [open, setOpen] = useState(false);
 * const media = [
 *   { type: 'image', src: '/photo.jpg', alt: 'Photo' },
 *   { type: 'video', src: '/video.mp4', poster: '/thumb.jpg' }
 * ];
 *
 * <MediaLightbox media={media} open={open} onClose={() => setOpen(false)} />
 * ```
 */
export default function MediaLightbox({
  media,
  initialIndex = 0,
  open,
  onClose,
}: MediaLightboxProps) {
  // Convert MediaItem to Lightbox slides format
  const slides = media.map((item) => {
    if (item.type === 'VIDEO') {
      return {
        type: 'video' as const,
        sources: [
          {
            src: item.src,
            type: 'video/mp4',
          },
        ],
        width: item.width || 1920,
        height: item.height || 1080,
        poster: item.poster,
        alt: item.alt,
        title: item.title,
        description: item.description,
      };
    }

    return {
      src: item.src,
      alt: item.alt,
      title: item.title,
      description: item.description,
    };
  });

  return (
    <Lightbox
      open={open}
      close={onClose}
      slides={slides}
      index={initialIndex}
      plugins={[Zoom, Video, Thumbnails, Captions]}
      zoom={{
        maxZoomPixelRatio: 3,
        scrollToZoom: true,
      }}
      thumbnails={{
        position: 'bottom',
        width: 120,
        height: 80,
        border: 1,
        borderRadius: 4,
        padding: 4,
        gap: 16,
      }}
      captions={{
        showToggle: true,
        descriptionTextAlign: 'center',
      }}
      animation={{
        fade: 250,
        swipe: 500,
      }}
      controller={{
        closeOnBackdropClick: true,
      }}
    />
  );
}

/**
 * Hook to use MediaLightbox easily
 * @example
 * ```tsx
 * const { openLightbox, LightboxComponent } = useMediaLightbox(media);
 *
 * <img onClick={() => openLightbox(0)} />
 * {LightboxComponent}
 * ```
 */
export function useMediaLightbox(media: MediaItem[]) {
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const openLightbox = (initialIndex: number) => {
    setIndex(initialIndex);
    setOpen(true);
  };

  const LightboxComponent = (
    <MediaLightbox media={media} initialIndex={index} open={open} onClose={() => setOpen(false)} />
  );

  return {
    openLightbox,
    closeLightbox: () => setOpen(false),
    LightboxComponent,
    isOpen: open,
  };
}
