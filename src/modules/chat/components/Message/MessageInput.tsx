'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from '@/components/ui/emoji-picker';
import { ImageIcon, Loader2, Mic, Paperclip, Send, Smile, Trash2, X } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { sendChatFileAPI, sendChatImageAPI, sendChatVoiceAPI } from '@/apis/chatApi';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface MessageInputProps {
  isGroup: boolean;
  roomId: string;
  onSendMessage: (content: string) => void;
  onTyping?: (isTyping: boolean) => void;
}

function formatElapsed(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
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
  const [emojiOpen, setEmojiOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const attachInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const caretRef = useRef<{ start: number; end: number } | null>(null);
  const selectedFile = useRef<File | null>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Voice recording state
  const [isRecording, setIsRecording] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cancelledRef = useRef(false);
  // Keep the latest elapsed available inside recorder.onstop closure.
  const elapsedRef = useRef(0);

  const { mutate: uploadImage, isPending: isUploadingImage } = useMutation({
    mutationFn: (file: File) => sendChatImageAPI({ roomId, file }),
    onSuccess: () => clearImage(),
    onError: (error) => {
      toast({ title: 'Failed to send image', description: String(error), variant: 'destructive' });
    },
  });

  const { mutate: uploadFile, isPending: isUploadingFile } = useMutation({
    mutationFn: (file: File) => sendChatFileAPI({ roomId, file }),
    onError: (error) => {
      toast({ title: 'Failed to send file', description: String(error), variant: 'destructive' });
    },
  });

  const { mutate: uploadVoice, isPending: isUploadingVoice } = useMutation({
    mutationFn: ({ file, duration }: { file: File; duration: number }) =>
      sendChatVoiceAPI({ roomId, file, duration }),
    onError: (error) => {
      toast({ title: 'Failed to send voice', description: String(error), variant: 'destructive' });
    },
  });

  const isBusy = isUploadingImage || isUploadingFile || isUploadingVoice;

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

  // Insert an emoji at the last known caret position (falls back to append).
  // We intentionally do NOT refocus the input so the emoji popover stays open
  // for picking multiple emojis in a row.
  const insertEmoji = (emoji: string) => {
    const caret = caretRef.current;
    const start = caret?.start ?? newMessage.length;
    const end = caret?.end ?? newMessage.length;
    const next = newMessage.slice(0, start) + emoji + newMessage.slice(end);
    handleChange(next);
    // Advance the stored caret so consecutive picks insert sequentially.
    const pos = start + emoji.length;
    caretRef.current = { start: pos, end: pos };
  };

  // Remember where the caret is whenever the input is interacted with, so we
  // can insert emojis there even after focus moves to the picker popover.
  const rememberCaret = () => {
    const input = messageInputRef.current;
    if (!input) return;
    caretRef.current = {
      start: input.selectionStart ?? input.value.length,
      end: input.selectionEnd ?? input.value.length,
    };
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleAttachSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) uploadFile(file);
    if (attachInputRef.current) attachInputRef.current.value = '';
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

  // ----- Voice recording -----
  const stopTimer = () => {
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
  };

  const startRecording = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      toast({ title: 'Recording not supported on this browser', variant: 'destructive' });
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      audioChunksRef.current = [];
      cancelledRef.current = false;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop());
        const duration = elapsedRef.current;
        if (cancelledRef.current) return;
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        if (blob.size === 0) return;
        const file = new File([blob], `voice-${Date.now()}.webm`, { type: 'audio/webm' });
        uploadVoice({ file, duration });
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
      setElapsed(0);
      elapsedRef.current = 0;
      recordTimerRef.current = setInterval(() => {
        elapsedRef.current += 1;
        setElapsed(elapsedRef.current);
      }, 1000);
    } catch {
      toast({ title: 'Microphone permission denied', variant: 'destructive' });
    }
  };

  const stopRecording = (cancel: boolean) => {
    cancelledRef.current = cancel;
    stopTimer();
    setIsRecording(false);
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
  };

  useEffect(() => {
    return () => {
      stopTimer();
      const recorder = mediaRecorderRef.current;
      if (recorder && recorder.state !== 'inactive') {
        cancelledRef.current = true;
        recorder.stop();
      }
    };
  }, []);

  const canSend = (!!newMessage.trim() || !!selectedFile.current) && !isBusy;

  // Recording bar replaces the normal composer while recording.
  if (isRecording) {
    return (
      <div className='flex gap-3 items-center p-4 border-t bg-card'>
        <span className='flex gap-2 items-center text-sm text-destructive'>
          <span className='inline-block w-2.5 h-2.5 rounded-full bg-destructive animate-pulse' />
          Recording {formatElapsed(elapsed)}
        </span>
        <div className='flex-1' />
        <Button
          variant='ghost'
          size='icon'
          className='w-10 h-10 rounded-full'
          onClick={() => stopRecording(true)}
          aria-label='Cancel recording'
        >
          <Trash2 className='w-4 h-4' />
        </Button>
        <Button
          className='w-10 h-10 p-0 rounded-full'
          onClick={() => stopRecording(false)}
          aria-label='Send voice message'
        >
          <Send className='w-4 h-4' />
        </Button>
      </div>
    );
  }

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
        <div className='flex gap-2 items-center w-full'>
          <div className='flex-1'>
            <div className='flex items-center px-4 py-2 space-x-2 rounded-full bg-muted'>
              <Input
                ref={messageInputRef}
                value={newMessage}
                onChange={(e) => handleChange(e.target.value)}
                onPaste={handlePaste}
                onSelect={rememberCaret}
                onKeyUp={rememberCaret}
                onClick={rememberCaret}
                onBlur={rememberCaret}
                placeholder={isGroup ? 'Message the group...' : 'Type a message...'}
                className='flex-1 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0'
                disabled={isBusy}
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
                onClick={() => attachInputRef.current?.click()}
                disabled={isBusy}
                aria-label='Attach file'
              >
                {isUploadingFile ? (
                  <Loader2 className='w-4 h-4 animate-spin' />
                ) : (
                  <Paperclip className='w-4 h-4' />
                )}
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='w-8 h-8 rounded-full'
                onClick={() => fileInputRef.current?.click()}
                disabled={isBusy}
                aria-label='Send image'
              >
                <ImageIcon className='w-4 h-4' />
              </Button>
              <Popover open={emojiOpen} onOpenChange={setEmojiOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant='ghost'
                    size='icon'
                    className='w-8 h-8 rounded-full'
                    disabled={isBusy}
                    aria-label='Emoji'
                  >
                    <Smile className='w-4 h-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='p-0 w-fit' align='end' side='top'>
                  <EmojiPicker
                    onEmojiSelect={(emoji: { emoji: string }) => {
                      insertEmoji(emoji.emoji);
                    }}
                  >
                    <EmojiPickerSearch placeholder='Search emoji...' />
                    <EmojiPickerContent className='max-h-[300px] overflow-y-auto w-full' />
                    <EmojiPickerFooter />
                  </EmojiPicker>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {canSend ? (
            <Button onClick={handleSend} disabled={!canSend} className='w-10 h-10 p-0 rounded-full'>
              {isBusy ? <Loader2 className='w-4 h-4 animate-spin' /> : <Send className='w-4 h-4' />}
            </Button>
          ) : (
            <Button
              onClick={startRecording}
              disabled={isBusy}
              className='w-10 h-10 p-0 rounded-full'
              aria-label='Record voice message'
            >
              {isUploadingVoice ? (
                <Loader2 className='w-4 h-4 animate-spin' />
              ) : (
                <Mic className='w-4 h-4' />
              )}
            </Button>
          )}
        </div>

        <input
          ref={fileInputRef}
          type='file'
          accept='image/*'
          onChange={handleImageSelect}
          className='hidden'
        />
        <input ref={attachInputRef} type='file' onChange={handleAttachSelect} className='hidden' />
      </div>
    </div>
  );
}
