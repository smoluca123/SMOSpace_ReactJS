import { Plus } from 'lucide-react';
import { useRef } from 'react';

export default function AddMediaButton({
  onChangeMedia,
}: {
  onChangeMedia: React.Dispatch<React.SetStateAction<File[]>>;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    onChangeMedia((prev) => [...files, ...prev]);
  };

  return (
    <div
      className='flex justify-center items-center w-20 h-20 rounded-md cursor-pointer bg-muted'
      onClick={() => inputRef.current?.click()}
    >
      <Plus className='w-5 h-5' />
      <input type='file' accept='image/*' multiple onChange={handleChange} hidden ref={inputRef} />
    </div>
  );
}
