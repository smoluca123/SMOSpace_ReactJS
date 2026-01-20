'use client';

import type React from 'react';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, ImageIcon, Smile } from 'lucide-react';

interface MessageInputProps {
  // onSendMessage: (text: string, image?: string) => void;
  isGroup: boolean;
}

export default function MessageInput({ isGroup }: MessageInputProps) {
  const [newMessage, setNewMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (!newMessage.trim() && !selectedImage) return;

    // onSendMessage(newMessage.trim(), imagePreview || undefined);
    setNewMessage('');
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className='border-t bg-card'>
      {/* Image Preview */}
      {imagePreview && (
        <div className='p-4 bg-muted/50'>
          <div className='relative inline-block'>
            <img
              src={imagePreview || '/placeholder.svg'}
              alt='Preview'
              className='max-w-full rounded-lg max-h-32'
            />
            <Button
              variant='destructive'
              size='sm'
              className='absolute w-6 h-6 p-0 rounded-full -top-2 -right-2'
              onClick={removeImage}
            >
              ×
            </Button>
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className='p-4'>
        <div className='flex items-end'>
          <div className='flex items-center w-full gap-2'>
            <div className='flex-1 '>
              <div className='flex items-center px-4 py-2 space-x-2 rounded-full bg-muted'>
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={isGroup ? 'Message group...' : 'Type a message...'}
                  className='flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <div className='flex items-center space-x-1'>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='w-8 h-8 rounded-full'
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImageIcon className='w-4 h-4' />
                  </Button>
                  <Button variant='ghost' size='icon' className='w-8 h-8 rounded-full'>
                    <Smile className='w-4 h-4' />
                  </Button>
                </div>
              </div>
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim() && !selectedImage}
              className='w-10 h-10 p-0 rounded-full'
            >
              <Send className='w-4 h-4' />
            </Button>
          </div>
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
