'use client';

import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageIcon, Loader2, Send, Smile, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { sendChatImageAPI } from '@/apis/chatApi';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  isGroup: boolean;
  roomId: string;
  onSendMessage: (content: string) => void;
  onTyping?: (isTyping: boolean) => void;
}

export default function MessageInput({
  isGroup,
  roomId,
  onSendMessage,
  onTyping,
}: MessageInputProps) {
  const [newMessage, setNewMessage] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedFile = useRef<File | null>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { mutate: uploadImage, isPending: isUploading } = useMutation({
    mutationFn: (file: File) => sendChatImageAPI({ roomId, file }),
    onSuccess: () => clearImage(),
    onError: (error) => {
      toast({ title: 'Failed to send image', description: String(error), variant: 'destructive' });
    },
  });

  const clearImage = () => {
    selectedFile.current = null;
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const setImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Only images are supported', variant: 'destructive', duration: 3000 });
      return;
    }
    selectedFile.current = file;
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSend = () => {
    if (selectedFile.current) {
      uploadImage(selectedFile.current);
      return;
    }
    if (!newMessage.trim()) return;
    onSendMessage(newMessage.trim());
    setNewMessage('');
    onTyping?.(false);
  };

  const handleChange = (value: string) => {
    setNewMessage(value);
    if (!onTyping) return;
    onTyping(true);
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => onTyping(false), 1500);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setImageFile(file);
  };

  // Drag & drop
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = Array.from(e.dataTransfer.files).find((f) => f.type.startsWith('image/'));
    if (file) setImageFile(file);
  };

  // Paste image from clipboard
  const handlePaste = (e: React.ClipboardEvent) => {
    const item = Array.from(e.clipboardData.items).find((i) => i.type.startsWith('image/'));
    if (item) {
      const file = item.getAsFile();
      if (file) {
        e.preventDefault();
        setImageFile(file);
      }
    }
  };

  const canSend = (!!newMessage.trim() || !!selectedFile.current) && !isUploading;

  return (
    <div
      className={cn('relative border-t bg-card', isDragging && 'ring-2 ring-primary ring-inset')}
      onDragOver={(e) => {
        e.preventDefault();
        if (!isDragging) setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        if (e.currentTarget.contains(e.relatedTarget as Node)) return;
        setIsDragging(false);
      }}
      onDrop={handleDrop}
    >
      {isDragging && (
        <div className='flex absolute inset-0 z-10 justify-center items-center pointer-events-none bg-primary/10'>
          <span className='flex gap-2 items-center text-sm font-medium text-primary'>
            <ImageIcon className='w-5 h-5' /> Drop an image here to send
          </span>
        </div>
      )}

      {imagePreview && (
        <div className='p-4 bg-muted/50'>
          <div className='inline-block relative'>
            <img src={imagePreview} alt='Preview' className='max-w-full rounded-lg max-h-32' />
            <Button
              variant='destructive'
              size='icon'
              className='absolute -top-2 -right-2 p-0 w-6 h-6 rounded-full'
              onClick={clearImage}
            >
              <X className='w-3 h-3' />
            </Button>
          </div>
        </div>
      )}

      <div className='p-4'>
        <div className='flex items-center w-full gap-2'>
          <div className='flex-1'>
            <div className='flex items-center px-4 py-2 space-x-2 rounded-full bg-muted'>
              <Input
                value={newMessage}
                onChange={(e) => handleChange(e.target.value)}
                onPaste={handlePaste}
                placeholder={isGroup ? 'Message the group...' : 'Type a message...'}
                className='flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                disabled={isUploading}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button
                variant='ghost'
                size='icon'
                className='w-8 h-8 rounded-full'
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                <ImageIcon className='w-4 h-4' />
              </Button>
              <Button variant='ghost' size='icon' className='w-8 h-8 rounded-full'>
                <Smile className='w-4 h-4' />
              </Button>
            </div>
          </div>
          <Button onClick={handleSend} disabled={!canSend} className='w-10 h-10 p-0 rounded-full'>
            {isUploading ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              <Send className='w-4 h-4' />
            )}
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleImageSelect}
          className='hidden'
        />
      </div>
    </div>
  );
}
