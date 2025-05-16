import { IMediaDataType } from '@/lib/types/interfaces';
import PostMediaGrid from './PostMediaGrid';

export default function PostMedia({ media }: { media: IMediaDataType[] }) {
  if (media.length === 0) return null;

  return <PostMediaGrid media={media} />;
}
