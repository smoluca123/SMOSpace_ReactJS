import { Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from '@/components/ui/emoji-picker';
import { Editor } from '@tiptap/react';

interface EmojiPickerButtonProps {
  editor: Editor | null;
}

interface EmojiData {
  emoji: string;
  label: string;
}

export default function EmojiPickerButton({ editor }: EmojiPickerButtonProps) {
  const handleEmojiSelect = (emoji: EmojiData) => {
    if (!editor) return;
    editor.chain().focus().insertContent(emoji.emoji).run();
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant='outline' size='sm' className='gap-2'>
          <Smile className='w-4 h-4' />
          Emoji
        </Button>
      </PopoverTrigger>
      <PopoverContent className='p-0 w-fit' align='start'>
        <EmojiPicker onEmojiSelect={handleEmojiSelect}>
          <EmojiPickerSearch placeholder='Search emoji...' />
          <EmojiPickerContent className='max-h-[300px] overflow-y-auto w-full' />
          <EmojiPickerFooter />
        </EmojiPicker>
      </PopoverContent>
    </Popover>
  );
}
