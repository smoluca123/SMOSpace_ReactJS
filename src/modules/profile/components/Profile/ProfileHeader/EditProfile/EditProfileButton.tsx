import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

export default function EditProfileButton() {
  return (
    <div>
      <Button variant='outline' className='gap-2'>
        <Pencil className='w-4 h-4 text-primary' />
        Edit
      </Button>
    </div>
  );
}
