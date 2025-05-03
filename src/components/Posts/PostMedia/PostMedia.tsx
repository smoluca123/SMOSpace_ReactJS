import { IMediaDataType } from '@/lib/types/interfaces';

export default function PostMedia({ media }: { media: IMediaDataType[] }) {
  console.log(media);
  if (media.length === 0) return null;
  return (
    <div>
      <img className='object-cover w-full h-full' src={media[0].url} alt={media[0].url} />
    </div>
  );
}
