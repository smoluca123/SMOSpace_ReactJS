import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import AddMediaButton from '@/components/Posts/Editor/PostMedia/AddMediaButton';
import SortableMediaItem from '@/components/Posts/Editor/PostMedia/SortableMediaItem';

export default function PostMedia({
  media,
  onChangeMedia,
}: {
  media: File[];
  onChangeMedia: React.Dispatch<React.SetStateAction<File[]>>;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = media.findIndex((item) => item.name === active.id);
      const newIndex = media.findIndex((item) => item.name === over.id);

      onChangeMedia(arrayMove(media, oldIndex, newIndex));
    }
  };

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

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={media.map((item) => item.name)}
          strategy={horizontalListSortingStrategy}
        >
          {media.map((item, index) => (
            <SortableMediaItem
              key={item.name}
              id={item.name}
              mediaItem={item}
              onRemove={() => handleRemoveMedia(index)}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
}
