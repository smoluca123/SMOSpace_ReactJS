import { IStoryGroupType } from '@/apis/storyApi';
import { deleteStoryAPI, viewStoryAPI } from '@/apis/storyApi';
import UserAvatar from '@/components/UserAvatar';
import { toast } from '@/hooks/use-toast';
import useTimeDistance from '@/hooks/useTimeDistance';
import { IApiPaginationResponseWrapper } from '@/lib/types/interfaces';
import { storyFeedQueryKey, useGetStoryViewers } from '@/modules/story/querys';
import { useAppSelector } from '@/redux/hooks';
import { selectAuth } from '@/redux/slices/authSlice';
import { InfiniteData, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight, Eye, Trash2, Volume2, VolumeX, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

type StoryFeedData = InfiniteData<IApiPaginationResponseWrapper<IStoryGroupType>['data']>;

const IMAGE_DURATION_MS = 5000;
const VOLUME_KEY = 'story-volume';
const MUTED_KEY = 'story-muted';

function readStoredVolume() {
  const v = parseFloat(localStorage.getItem(VOLUME_KEY) ?? '1');
  return Number.isFinite(v) ? Math.min(Math.max(v, 0), 1) : 1;
}

export default function StoryViewer({
  groups,
  initialGroupIndex,
  onClose,
}: {
  groups: IStoryGroupType[];
  initialGroupIndex: number;
  onClose: () => void;
}) {
  const { user } = useAppSelector(selectAuth);
  const queryClient = useQueryClient();

  const [groupIndex, setGroupIndex] = useState(initialGroupIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  // Default to muted so autoplay is never blocked; respect the user's saved choice.
  const [muted, setMuted] = useState(() => localStorage.getItem(MUTED_KEY) !== '0');
  const [volume, setVolume] = useState(readStoredVolume);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const elapsedRef = useRef<number>(0);

  const group = groups[groupIndex];
  const story = group?.stories[storyIndex];
  const isOwn = group?.author.id === user?.id;
  const createdAt = useTimeDistance({ dateString: story?.createdAt ?? new Date().toISOString() });

  const { data: viewersData } = useGetStoryViewers(story?.id ?? '', !!story && isOwn);

  const viewMutation = useMutation({
    mutationFn: (storyId: string) => viewStoryAPI({ storyId }),
  });
  const deleteMutation = useMutation({
    mutationFn: (storyId: string) => deleteStoryAPI({ storyId }),
    onSuccess: (_data, storyId) => {
      toast({ description: 'Story deleted', duration: 2000 });
      // Remove the story from the feed cache (and drop now-empty groups) so the
      // viewer + story bar update immediately without a refetch/F5.
      queryClient.setQueryData<StoryFeedData>(storyFeedQueryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items
              .map((g) => ({
                ...g,
                stories: g.stories.filter((s) => s.id !== storyId),
              }))
              .filter((g) => g.stories.length > 0),
          })),
        };
      });
      // Index clamping is handled by the effect below as `groups` updates.
    },
  });

  // Advance helpers --------------------------------------------------------
  const goToGroup = useCallback(
    (index: number) => {
      if (index < 0 || index >= groups.length) {
        onClose();
        return;
      }
      setGroupIndex(index);
      setStoryIndex(0);
    },
    [groups.length, onClose],
  );

  const handleNextStory = useCallback(() => {
    if (!group) return;
    if (storyIndex < group.stories.length - 1) {
      setStoryIndex((i) => i + 1);
    } else {
      goToGroup(groupIndex + 1);
    }
  }, [group, storyIndex, groupIndex, goToGroup]);

  const handlePrevStory = useCallback(() => {
    if (storyIndex > 0) {
      setStoryIndex((i) => i - 1);
    } else {
      goToGroup(groupIndex - 1);
    }
  }, [storyIndex, groupIndex, goToGroup]);

  // Keep the current indices valid as `groups` changes (e.g. after a delete).
  useEffect(() => {
    if (groups.length === 0) {
      onClose();
      return;
    }
    if (groupIndex > groups.length - 1) {
      setGroupIndex(groups.length - 1);
      setStoryIndex(0);
      return;
    }
    const currentGroup = groups[groupIndex];
    if (currentGroup && storyIndex > currentGroup.stories.length - 1) {
      setStoryIndex(Math.max(0, currentGroup.stories.length - 1));
    }
  }, [groups, groupIndex, storyIndex, onClose]);

  // Mark current story as viewed (once).
  useEffect(() => {
    if (story && !isOwn) {
      viewMutation.mutate(story.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id]);

  // Progress driver. Images use a timer; videos follow their own playback.
  useEffect(() => {
    if (!story) return;
    setProgress(0);
    elapsedRef.current = 0;

    if (story.type === 'VIDEO') {
      // Video progress is handled by its timeupdate handler below.
      return;
    }

    let frame: number;
    const tick = (now: number) => {
      if (paused) {
        startRef.current = now - elapsedRef.current;
        frame = requestAnimationFrame(tick);
        rafRef.current = frame;
        return;
      }
      if (!startRef.current) startRef.current = now;
      elapsedRef.current = now - startRef.current;
      const ratio = Math.min(elapsedRef.current / IMAGE_DURATION_MS, 1);
      setProgress(ratio);
      if (ratio >= 1) {
        handleNextStory();
        return;
      }
      frame = requestAnimationFrame(tick);
      rafRef.current = frame;
    };
    startRef.current = 0;
    frame = requestAnimationFrame(tick);
    rafRef.current = frame;

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      startRef.current = 0;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id, paused]);

  // Keyboard navigation.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNextStory();
      else if (e.key === 'ArrowLeft') handlePrevStory();
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [handleNextStory, handlePrevStory, onClose]);

  // Hold-to-pause also pauses video playback.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || story?.type !== 'VIDEO') return;
    if (paused) video.pause();
    else video.play().catch(() => undefined);
  }, [paused, story?.type]);

  // Apply + persist volume/mute for video stories.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || story?.type !== 'VIDEO') return;
    video.muted = muted;
    video.volume = volume;
  }, [muted, volume, story?.id, story?.type]);

  useEffect(() => {
    localStorage.setItem(MUTED_KEY, muted ? '1' : '0');
  }, [muted]);

  useEffect(() => {
    localStorage.setItem(VOLUME_KEY, String(volume));
  }, [volume]);

  const handleVolumeChange = (value: number) => {
    const v = Math.min(Math.max(value, 0), 1);
    setVolume(v);
    setMuted(v === 0);
  };

  if (!group || !story) return null;

  return createPortal(
    <div className='flex fixed inset-0 z-[100] justify-center items-center bg-black/90'>
      {/* Click-outside to close */}
      <div className='absolute inset-0' onClick={onClose} />

      <div className='flex relative z-10 flex-col w-full max-w-md h-[90vh] overflow-hidden rounded-lg bg-black'>
        <div className='flex relative flex-col w-full h-full'>
          {/* Progress bars */}
          <div className='flex absolute top-2 right-2 left-2 z-20 gap-1'>
            {group.stories.map((s, i) => (
              <div key={s.id} className='flex-1 h-1 rounded-full overflow-hidden bg-white/30'>
                <div
                  className='h-full bg-white'
                  style={{
                    width: i < storyIndex ? '100%' : i === storyIndex ? `${progress * 100}%` : '0%',
                  }}
                />
              </div>
            ))}
          </div>

          {/* Header */}
          <div className='flex absolute top-5 right-3 left-3 z-20 gap-2 items-center'>
            <UserAvatar
              avatarUrl={group.author.avatar}
              fallbackName={group.author.fullName}
              className='w-9 h-9'
              showStatus={false}
            />
            <div className='flex-1 min-w-0'>
              <p className='text-sm font-medium text-white truncate'>{group.author.fullName}</p>
              <p className='text-xs text-white/70'>{createdAt}</p>
            </div>
            {story.type === 'VIDEO' && (
              <div className='flex gap-1 items-center'>
                <button
                  type='button'
                  onClick={() => setMuted((m) => !m)}
                  className='p-2 rounded-full text-white/90 hover:bg-white/10'
                  aria-label={muted ? 'Unmute' : 'Mute'}
                >
                  {muted || volume === 0 ? (
                    <VolumeX className='w-5 h-5' />
                  ) : (
                    <Volume2 className='w-5 h-5' />
                  )}
                </button>
                <input
                  type='range'
                  min={0}
                  max={1}
                  step={0.05}
                  value={muted ? 0 : volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className='hidden w-16 accent-white cursor-pointer sm:block'
                  aria-label='Volume'
                />
              </div>
            )}
            {isOwn && (
              <button
                type='button'
                onClick={() => deleteMutation.mutate(story.id)}
                className='p-2 rounded-full text-white/90 hover:bg-white/10'
                aria-label='Delete story'
              >
                <Trash2 className='w-5 h-5' />
              </button>
            )}
            <button
              type='button'
              onClick={onClose}
              className='p-2 rounded-full text-white/90 hover:bg-white/10'
              aria-label='Close'
            >
              <X className='w-5 h-5' />
            </button>
          </div>

          {/* Media */}
          <div
            className='flex flex-1 justify-center items-center bg-black'
            onMouseDown={() => setPaused(true)}
            onMouseUp={() => setPaused(false)}
            onTouchStart={() => setPaused(true)}
            onTouchEnd={() => setPaused(false)}
          >
            {story.type === 'VIDEO' ? (
              <video
                ref={videoRef}
                key={story.id}
                src={story.mediaUrl}
                className='object-contain w-full h-full'
                autoPlay
                playsInline
                muted={muted}
                onTimeUpdate={(e) => {
                  const v = e.currentTarget;
                  if (v.duration) setProgress(Math.min(v.currentTime / v.duration, 1));
                }}
                onEnded={handleNextStory}
              />
            ) : (
              <img
                src={story.mediaUrl}
                alt='Story'
                className='object-contain w-full h-full'
                draggable={false}
              />
            )}
          </div>

          {/* Tap zones for navigation */}
          <button
            type='button'
            aria-label='Previous'
            onClick={handlePrevStory}
            className='absolute left-0 top-16 bottom-16 z-10 w-1/3'
          />
          <button
            type='button'
            aria-label='Next'
            onClick={handleNextStory}
            className='absolute right-0 top-16 bottom-16 z-10 w-1/3'
          />

          {/* Own story view count */}
          {isOwn && (
            <div className='flex absolute right-3 bottom-3 left-3 z-20 gap-2 items-center text-sm text-white/90'>
              <Eye className='w-4 h-4' />
              <span>{viewersData?.viewCount ?? story.viewCount} views</span>
            </div>
          )}
        </div>
      </div>

      {/* Nav arrows (desktop) */}
      {groupIndex > 0 && (
        <button
          type='button'
          onClick={() => goToGroup(groupIndex - 1)}
          className='hidden absolute left-4 top-1/2 z-20 p-2 rounded-full -translate-y-1/2 sm:block bg-white/10 text-white hover:bg-white/20'
          aria-label='Previous person'
        >
          <ChevronLeft className='w-6 h-6' />
        </button>
      )}
      {groupIndex < groups.length - 1 && (
        <button
          type='button'
          onClick={() => goToGroup(groupIndex + 1)}
          className='hidden absolute right-4 top-1/2 z-20 p-2 rounded-full -translate-y-1/2 sm:block bg-white/10 text-white hover:bg-white/20'
          aria-label='Next person'
        >
          <ChevronRight className='w-6 h-6' />
        </button>
      )}
    </div>,
    document.body,
  );
}
