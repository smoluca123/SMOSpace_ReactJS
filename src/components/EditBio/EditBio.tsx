import EditBioDialog from '@/components/EditBio/EditBioDialog';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface EditBioProps extends ButtonProps {
  content?: string;
  onChangeContent?: (content: string) => void;
}

export default function EditBio({ className, content, onChangeContent, ...props }: EditBioProps) {
  const [openEditBioDialog, setOpenEditBioDialog] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpenEditBioDialog(true)}
        variant='secondary'
        className={cn('w-full', className)}
        {...props}
      >
        Edit Bio
      </Button>
      <EditBioDialog
        open={openEditBioDialog}
        onClose={() => setOpenEditBioDialog(false)}
        content={content}
        onChangeContent={onChangeContent}
      />
    </>
  );
}
