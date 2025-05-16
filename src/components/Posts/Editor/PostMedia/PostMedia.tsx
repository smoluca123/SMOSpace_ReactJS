import AddMediaButton from '@/components/Posts/Editor/PostMedia/AddMediaButton';
import PostMediaItem from '@/components/Posts/Editor/PostMedia/PostMediaItem';

export default function PostMedia({
  media,
  onChangeMedia,
}: {
  media: File[];
  onChangeMedia: React.Dispatch<React.SetStateAction<File[]>>;
}) {
  const handleRemoveMedia = (index: number) => {
    const newMedia = [...media];
    newMedia.splice(index, 1);
    onChangeMedia(newMedia);
  };

  return (
    <div className='flex overflow-x-auto gap-x-4'>
      <div className='flex-shrink-0'>
        <AddMediaButton onChangeMedia={onChangeMedia} />
      </div>
      {media.map((item, index) => (
        <div className='flex-shrink-0'>
          <PostMediaItem
            onRemove={() => handleRemoveMedia(index)}
            mediaItem={item}
            key={item.name}
          />
        </div>
      ))}
    </div>
  );
}
