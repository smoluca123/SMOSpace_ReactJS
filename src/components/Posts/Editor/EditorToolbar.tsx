import { Editor } from '@tiptap/react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Strikethrough, Code, List, ListOrdered, Quote } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EditorToolbarProps {
  editor: Editor;
}

export default function EditorToolbar({ editor }: EditorToolbarProps) {
  const toolbarButtons = [
    {
      icon: Bold,
      label: 'Bold (Ctrl+B)',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold'),
    },
    {
      icon: Italic,
      label: 'Italic (Ctrl+I)',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic'),
    },
    {
      icon: Strikethrough,
      label: 'Strikethrough (Ctrl+Shift+S)',
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive('strike'),
    },
    {
      icon: Code,
      label: 'Code (Ctrl+E)',
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: () => editor.isActive('code'),
    },
  ];

  const listButtons = [
    {
      icon: List,
      label: 'Bullet List (Ctrl+Shift+8)',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList'),
    },
    {
      icon: ListOrdered,
      label: 'Ordered List (Ctrl+Shift+7)',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList'),
    },
    {
      icon: Quote,
      label: 'Block Quote (Ctrl+Shift+B)',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote'),
    },
  ];

  return (
    <TooltipProvider>
      <div className='flex flex-wrap items-center gap-1 pb-2 mb-2 border-b border-border'>
        {/* Text Formatting */}
        <div className='flex items-center gap-1'>
          {toolbarButtons.map((button, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={button.action}
                  className={`h-8 w-8 p-0 ${
                    button.isActive() ? 'bg-accent text-accent-foreground' : ''
                  }`}
                >
                  <button.icon className='w-4 h-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-xs'>{button.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        <Separator orientation='vertical' className='h-6' />

        {/* List & Quote */}
        <div className='flex items-center gap-1'>
          {listButtons.map((button, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={button.action}
                  className={`h-8 w-8 p-0 ${
                    button.isActive() ? 'bg-accent text-accent-foreground' : ''
                  }`}
                >
                  <button.icon className='w-4 h-4' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-xs'>{button.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}
