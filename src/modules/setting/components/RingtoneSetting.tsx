import { Button } from '@/components/ui/button';
import {
  getRingtonePreference,
  RINGTONE_OPTIONS,
  RingtoneOption,
  previewRingtone,
  setRingtonePreference,
} from '@/lib/ringtone';
import { cn } from '@/lib/utils';
import { Bell, Play, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';

/**
 * Settings panel that lets the user choose a ringtone for incoming calls.
 * Preference is persisted to localStorage via the ringtone utility module.
 */
export default function RingtoneSetting() {
  const [selected, setSelected] = useState<RingtoneOption>(getRingtonePreference);
  const [previewingOption, setPreviewingOption] = useState<RingtoneOption | null>(null);

  const handleSelect = (option: RingtoneOption) => {
    setSelected(option);
    setRingtonePreference(option);
  };

  const handlePreview = (option: RingtoneOption) => {
    if (option === 'none') return;
    setPreviewingOption(option);
    previewRingtone(option);
    // Reset the preview indicator after the burst (~700ms)
    setTimeout(() => setPreviewingOption(null), 700);
  };

  return (
    <div className='space-y-3'>
      <div className='flex gap-3 items-start'>
        <Bell className='mt-0.5 w-5 h-5 text-muted-foreground' />
        <div>
          <p className='font-medium'>Incoming call ringtone</p>
          <p className='text-sm text-muted-foreground'>
            Choose the sound played when someone calls you.
          </p>
        </div>
      </div>

      <div className='grid gap-2 ml-8 sm:grid-cols-2'>
        {RINGTONE_OPTIONS.map((option) => {
          const isActive = selected === option.value;
          const isPreviewing = previewingOption === option.value;

          return (
            <button
              key={option.value}
              id={`ringtone-option-${option.value}`}
              onClick={() => handleSelect(option.value)}
              className={cn(
                'flex justify-between items-center px-4 py-3 rounded-xl border text-left transition-all duration-150',
                isActive
                  ? 'border-primary bg-primary/10 ring-1 ring-primary'
                  : 'border-border hover:border-primary/50 hover:bg-muted/50',
              )}
            >
              <div className='flex gap-3 items-center'>
                {/* Active indicator dot */}
                <span
                  className={cn(
                    'inline-block w-3 h-3 rounded-full border-2 transition-colors',
                    isActive ? 'border-primary bg-primary' : 'border-muted-foreground',
                  )}
                />
                <div>
                  <p className={cn('text-sm font-medium', isActive && 'text-primary')}>
                    {option.label}
                  </p>
                  <p className='text-xs text-muted-foreground'>{option.description}</p>
                </div>
              </div>

              {/* Preview button - only for non-silent options */}
              {option.value !== 'none' && (
                <Button
                  id={`ringtone-preview-${option.value}`}
                  type='button'
                  variant='ghost'
                  size='icon'
                  aria-label={`Preview ${option.label} ringtone`}
                  className='w-8 h-8 shrink-0'
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(option.value);
                  }}
                >
                  {isPreviewing ? (
                    <Volume2 className='w-4 h-4 text-primary animate-pulse' />
                  ) : (
                    <Play className='w-4 h-4' />
                  )}
                </Button>
              )}

              {option.value === 'none' && (
                <VolumeX className='w-4 h-4 text-muted-foreground shrink-0' />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
