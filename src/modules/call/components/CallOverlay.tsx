import UserAvatar from '@/components/UserAvatar';
import { Button } from '@/components/ui/button';
import { RemoteParticipant, useCall } from '@/modules/call/CallContext';
import { Mic, MicOff, MonitorUp, Phone, PhoneOff, Video, VideoOff } from 'lucide-react';
import { useEffect, useRef } from 'react';

/** Attaches a MediaStream to a <video> element (srcObject can't be set via JSX). */
function StreamVideo({
  stream,
  muted = false,
  className,
}: {
  stream: MediaStream | null;
  muted?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current && ref.current.srcObject !== stream) {
      ref.current.srcObject = stream;
    }
  }, [stream]);
  return <video ref={ref} autoPlay playsInline muted={muted} className={className} />;
}

function RemoteTile({
  participant,
  isVideo,
}: {
  participant: RemoteParticipant;
  isVideo: boolean;
}) {
  const { peer, stream } = participant;
  const hasVideo = isVideo && !!stream && stream.getVideoTracks().some((t) => t.enabled);

  return (
    <div className='flex overflow-hidden relative justify-center items-center bg-neutral-800 rounded-xl aspect-video'>
      {/* Always render audio so voice plays even when there's no video tile. */}
      {stream && !hasVideo && <StreamVideo stream={stream} className='hidden' />}

      {hasVideo ? (
        <StreamVideo stream={stream} className='object-cover w-full h-full' />
      ) : (
        <div className='flex flex-col items-center'>
          <UserAvatar
            userId={peer.id}
            avatarUrl={peer.avatar ?? undefined}
            fallbackName={peer.fullName}
            className='w-20 h-20'
          />
          <span className='mt-2 text-sm text-white/80'>{peer.fullName || peer.username}</span>
        </div>
      )}
    </div>
  );
}

export default function CallOverlay() {
  const {
    status,
    callType,
    incomingFrom,
    isMuted,
    isCameraOff,
    isScreenSharing,
    localStream,
    participants,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleCamera,
    toggleScreenShare,
  } = useCall();

  if (status === 'idle') return null;

  const isVideo = callType === 'video';

  // --- Incoming call prompt (ringing, callee side) ---
  if (status === 'ringing' && incomingFrom) {
    return (
      <div className='flex fixed inset-0 z-[100] justify-center items-center bg-black/60 backdrop-blur-sm'>
        <div className='flex flex-col items-center p-8 mx-4 w-full max-w-sm rounded-2xl border shadow-xl bg-card'>
          <UserAvatar
            userId={incomingFrom.id}
            avatarUrl={incomingFrom.avatar ?? undefined}
            fallbackName={incomingFrom.fullName}
            className='w-24 h-24'
          />
          <h2 className='mt-4 text-xl font-semibold'>
            {incomingFrom.fullName || incomingFrom.username}
          </h2>
          <p className='mt-1 text-sm text-muted-foreground'>
            Incoming {isVideo ? 'video' : 'voice'} call...
          </p>

          <div className='flex gap-6 justify-center mt-8'>
            <button
              onClick={rejectCall}
              className='flex justify-center items-center w-14 h-14 text-white bg-red-500 rounded-full transition-colors hover:bg-red-600'
              aria-label='Decline'
            >
              <PhoneOff className='w-6 h-6' />
            </button>
            <button
              onClick={acceptCall}
              className='flex justify-center items-center w-14 h-14 text-white bg-green-500 rounded-full transition-colors animate-pulse hover:bg-green-600'
              aria-label='Accept'
            >
              <Phone className='w-6 h-6' />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- Active / outgoing call window ---
  const connectedCount = participants.filter((p) => !!p.stream).length;
  const statusText =
    status === 'calling'
      ? 'Calling...'
      : status === 'connecting'
        ? 'Connecting...'
        : connectedCount > 0
          ? `${connectedCount + 1} in call`
          : 'Connected';

  const hasRemotes = participants.length > 0;
  // Single remote -> 1 column; 2 remotes -> 2 columns.
  const gridCols = participants.length >= 2 ? 'grid-cols-2' : 'grid-cols-1';

  return (
    <div className='flex fixed inset-0 z-[100] flex-col bg-neutral-900 text-white'>
      <div className='flex relative flex-1 justify-center items-center p-4 overflow-hidden'>
        {hasRemotes ? (
          <div className={`grid gap-3 w-full max-w-5xl ${gridCols}`}>
            {participants.map((p) => (
              <RemoteTile key={p.peer.id} participant={p} isVideo={isVideo} />
            ))}
          </div>
        ) : (
          <div className='flex flex-col items-center'>
            <p className='text-lg text-white/70'>{statusText}</p>
            <p className='mt-2 text-sm text-white/50'>Waiting for others to join...</p>
          </div>
        )}

        {/* Self-view (only meaningful for video calls) */}
        {isVideo && localStream && !isCameraOff && (
          <StreamVideo
            stream={localStream}
            muted
            className='object-cover absolute right-4 bottom-4 w-32 h-44 rounded-lg border shadow-lg border-white/20 bg-black'
          />
        )}

        {hasRemotes && (
          <div className='absolute top-4 left-1/2 px-3 py-1 text-sm rounded-full -translate-x-1/2 bg-black/40'>
            {statusText}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className='flex gap-5 justify-center items-center p-6 bg-black/40'>
        <button
          onClick={toggleMute}
          className={`flex justify-center items-center w-12 h-12 rounded-full transition-colors ${
            isMuted ? 'bg-white text-neutral-900' : 'bg-white/15 hover:bg-white/25'
          }`}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <MicOff className='w-5 h-5' /> : <Mic className='w-5 h-5' />}
        </button>

        {isVideo && (
          <button
            onClick={toggleCamera}
            className={`flex justify-center items-center w-12 h-12 rounded-full transition-colors ${
              isCameraOff ? 'bg-white text-neutral-900' : 'bg-white/15 hover:bg-white/25'
            }`}
            aria-label={isCameraOff ? 'Turn camera on' : 'Turn camera off'}
          >
            {isCameraOff ? <VideoOff className='w-5 h-5' /> : <Video className='w-5 h-5' />}
          </button>
        )}

        {isVideo && (
          <button
            onClick={toggleScreenShare}
            className={`flex justify-center items-center w-12 h-12 rounded-full transition-colors ${
              isScreenSharing ? 'bg-white text-neutral-900' : 'bg-white/15 hover:bg-white/25'
            }`}
            aria-label={isScreenSharing ? 'Stop sharing screen' : 'Share screen'}
          >
            <MonitorUp className='w-5 h-5' />
          </button>
        )}

        <Button
          onClick={endCall}
          className='flex justify-center items-center p-0 w-14 h-14 bg-red-500 rounded-full hover:bg-red-600'
          aria-label='End call'
        >
          <PhoneOff className='w-6 h-6' />
        </Button>
      </div>
    </div>
  );
}
