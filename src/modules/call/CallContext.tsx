import { toast } from '@/hooks/use-toast';
import { CallType, ICallPeer, callSocket } from '@/lib/sockets';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type CallStatus = 'idle' | 'calling' | 'ringing' | 'connecting' | 'in-call';

export interface RemoteParticipant {
  peer: ICallPeer;
  stream: MediaStream | null;
}

interface CallContextValue {
  status: CallStatus;
  callType: CallType;
  /** The user who is ringing us (callee side, while status === 'ringing'). */
  incomingFrom: ICallPeer | null;
  isCaller: boolean;
  isMuted: boolean;
  isCameraOff: boolean;
  isScreenSharing: boolean;
  localStream: MediaStream | null;
  participants: RemoteParticipant[];
  startCall: (roomId: string, callType: CallType) => void;
  acceptCall: () => void;
  rejectCall: () => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleCamera: () => void;
  toggleScreenShare: () => void;
}

const CallContext = createContext<CallContextValue | null>(null);

// How long we ring before giving up (caller side) / auto-missing (callee side).
const RING_TIMEOUT_MS = 35_000;

const DEFAULT_ICE_SERVERS: RTCIceServer[] = [
  { urls: ['stun:stun.l.google.com:19302', 'stun:stun1.l.google.com:19302'] },
];

interface IncomingInfo {
  callId: string;
  callType: CallType;
  fromUser: ICallPeer;
}

export function CallProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<CallStatus>('idle');
  const [callType, setCallType] = useState<CallType>('audio');
  const [incomingFrom, setIncomingFrom] = useState<ICallPeer | null>(null);
  const [isCaller, setIsCaller] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Map<string, RemoteParticipant>>(new Map());

  // Refs so socket handlers always see the latest values (no stale closures).
  const pcsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const localStreamRef = useRef<MediaStream | null>(null);
  // The original camera track, kept alive while screen sharing so we can swap
  // back to it. The display stream is tracked so we can stop it on teardown.
  const cameraTrackRef = useRef<MediaStreamTrack | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const iceServersRef = useRef<RTCIceServer[]>(DEFAULT_ICE_SERVERS);
  const pendingCandidatesRef = useRef<Map<string, RTCIceCandidateInit[]>>(new Map());
  const peersRef = useRef<Map<string, ICallPeer>>(new Map());
  const incomingRef = useRef<IncomingInfo | null>(null);
  const callIdRef = useRef<string | null>(null);
  const statusRef = useRef<CallStatus>('idle');
  const ringTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setStatusSafe = useCallback((next: CallStatus) => {
    statusRef.current = next;
    setStatus(next);
  }, []);

  const clearRingTimeout = useCallback(() => {
    if (ringTimeoutRef.current) {
      clearTimeout(ringTimeoutRef.current);
      ringTimeoutRef.current = null;
    }
  }, []);

  // ---- Participant roster helpers ----------------------------------------

  const addParticipant = useCallback((peer: ICallPeer) => {
    peersRef.current.set(peer.id, peer);
    setParticipants((prev) => {
      if (prev.has(peer.id)) return prev;
      const next = new Map(prev);
      next.set(peer.id, { peer, stream: null });
      return next;
    });
  }, []);

  const setParticipantStream = useCallback((userId: string, stream: MediaStream | null) => {
    setParticipants((prev) => {
      const existing = prev.get(userId);
      const peer = existing?.peer ?? peersRef.current.get(userId);
      if (!peer) return prev;
      const next = new Map(prev);
      next.set(userId, { peer, stream });
      return next;
    });
  }, []);

  const closePeer = useCallback((userId: string) => {
    const pc = pcsRef.current.get(userId);
    if (pc) {
      pc.onicecandidate = null;
      pc.ontrack = null;
      pc.onconnectionstatechange = null;
      try {
        pc.close();
      } catch {
        /* noop */
      }
      pcsRef.current.delete(userId);
    }
    pendingCandidatesRef.current.delete(userId);
    setParticipants((prev) => {
      if (!prev.has(userId)) return prev;
      const next = new Map(prev);
      next.delete(userId);
      return next;
    });
  }, []);

  /** Tear everything down and return to idle. Safe to call repeatedly. */
  const cleanup = useCallback(() => {
    clearRingTimeout();

    pcsRef.current.forEach((pc) => {
      pc.onicecandidate = null;
      pc.ontrack = null;
      pc.onconnectionstatechange = null;
      try {
        pc.close();
      } catch {
        /* noop */
      }
    });
    pcsRef.current.clear();

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((t) => t.stop());
      localStreamRef.current = null;
    }

    // Screen share + the original camera track may live outside localStream.
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks().forEach((t) => t.stop());
      screenStreamRef.current = null;
    }
    if (cameraTrackRef.current) {
      cameraTrackRef.current.stop();
      cameraTrackRef.current = null;
    }

    pendingCandidatesRef.current.clear();
    peersRef.current.clear();
    incomingRef.current = null;
    callIdRef.current = null;

    setLocalStream(null);
    setParticipants(new Map());
    setIncomingFrom(null);
    setIsCaller(false);
    setIsMuted(false);
    setIsCameraOff(false);
    setIsScreenSharing(false);
    setStatusSafe('idle');
  }, [clearRingTimeout, setStatusSafe]);

  const getLocalMedia = useCallback(async (type: CallType) => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: type === 'video',
    });
    localStreamRef.current = stream;
    cameraTrackRef.current = stream.getVideoTracks()[0] ?? null;
    setLocalStream(stream);
    return stream;
  }, []);

  const drainPendingCandidates = useCallback(async (userId: string) => {
    const pc = pcsRef.current.get(userId);
    if (!pc) return;
    const pending = pendingCandidatesRef.current.get(userId) ?? [];
    pendingCandidatesRef.current.delete(userId);
    for (const candidate of pending) {
      try {
        await pc.addIceCandidate(candidate);
      } catch {
        /* ignore individual candidate errors */
      }
    }
  }, []);

  /**
   * Create (or fetch) the peer connection to a given user. When `initiator` is
   * true we also create and send the SDP offer - only the peer that was already
   * in the session does this, which keeps negotiation glare-free.
   */
  const ensurePeerConnection = useCallback(
    (peerUserId: string, initiator: boolean) => {
      const existing = pcsRef.current.get(peerUserId);
      if (existing) return existing;

      const pc = new RTCPeerConnection({ iceServers: iceServersRef.current });

      const localStreamValue = localStreamRef.current;
      if (localStreamValue) {
        localStreamValue.getTracks().forEach((track) => pc.addTrack(track, localStreamValue));
      }

      pc.onicecandidate = (event) => {
        if (event.candidate && callIdRef.current) {
          callSocket.emit('call:ice', {
            callId: callIdRef.current,
            toUserId: peerUserId,
            candidate: event.candidate.toJSON(),
          });
        }
      };

      pc.ontrack = (event) => {
        setParticipantStream(peerUserId, event.streams[0] ?? null);
      };

      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        if (state === 'connected') {
          clearRingTimeout();
          if (statusRef.current !== 'in-call') setStatusSafe('in-call');
        } else if (state === 'failed' || state === 'closed') {
          // Drop just this peer; the session continues if others remain.
          closePeer(peerUserId);
        }
      };

      pcsRef.current.set(peerUserId, pc);

      if (initiator) {
        void (async () => {
          try {
            const offer = await pc.createOffer();
            await pc.setLocalDescription(offer);
            if (callIdRef.current) {
              callSocket.emit('call:offer', {
                callId: callIdRef.current,
                toUserId: peerUserId,
                offer,
              });
            }
          } catch {
            closePeer(peerUserId);
          }
        })();
      }

      return pc;
    },
    [clearRingTimeout, closePeer, setParticipantStream, setStatusSafe],
  );

  // ---- Public actions -----------------------------------------------------

  const startCall = useCallback(
    async (roomId: string, type: CallType) => {
      if (statusRef.current !== 'idle') return;

      setIsCaller(true);
      setCallType(type);
      setStatusSafe('calling');

      try {
        await getLocalMedia(type);
      } catch (error) {
        toast({
          title: 'Cannot start call',
          description:
            error instanceof DOMException && error.name === 'NotAllowedError'
              ? 'Microphone/camera permission denied.'
              : 'Failed to access your microphone or camera.',
          variant: 'destructive',
          duration: 3500,
        });
        cleanup();
        return;
      }

      callSocket.emit('call:start', { roomId, callType: type }, (ack) => {
        if (!ack?.success || !ack.callId) {
          const reason = ack?.reason;
          toast({
            title: 'Call not started',
            description:
              reason === 'busy'
                ? 'You are already in a call.'
                : reason === 'no-invitees'
                  ? 'Nobody is available to call right now.'
                  : 'Could not start the call.',
            duration: 3000,
          });
          cleanup();
          return;
        }

        callIdRef.current = ack.callId;
        if (ack.iceServers?.length) iceServersRef.current = ack.iceServers;

        ringTimeoutRef.current = setTimeout(() => {
          if (statusRef.current === 'calling' && pcsRef.current.size === 0) {
            if (callIdRef.current) callSocket.emit('call:leave', { callId: callIdRef.current });
            toast({ title: 'No answer', duration: 3000 });
            cleanup();
          }
        }, RING_TIMEOUT_MS);
      });
    },
    [cleanup, getLocalMedia, setStatusSafe],
  );

  const acceptCall = useCallback(async () => {
    const incoming = incomingRef.current;
    if (statusRef.current !== 'ringing' || !incoming) return;

    clearRingTimeout();
    setStatusSafe('connecting');

    try {
      await getLocalMedia(incoming.callType);
    } catch (error) {
      toast({
        title: 'Cannot answer call',
        description:
          error instanceof DOMException && error.name === 'NotAllowedError'
            ? 'Microphone/camera permission denied.'
            : 'Failed to access your microphone or camera.',
        variant: 'destructive',
        duration: 3500,
      });
      callSocket.emit('call:reject', { callId: incoming.callId });
      cleanup();
      return;
    }

    callSocket.emit('call:accept', { callId: incoming.callId }, (ack) => {
      if (!ack?.success) {
        toast({
          title: 'Cannot join call',
          description: ack?.reason === 'full' ? 'The call is full.' : 'The call has ended.',
          duration: 3000,
        });
        cleanup();
        return;
      }

      callIdRef.current = incoming.callId;
      if (ack.iceServers?.length) iceServersRef.current = ack.iceServers;
      setIncomingFrom(null);

      // Existing participants will send us offers; pre-register them in the UI.
      (ack.participants ?? []).forEach((p) => addParticipant(p));
    });
  }, [addParticipant, cleanup, clearRingTimeout, getLocalMedia, setStatusSafe]);

  const rejectCall = useCallback(() => {
    const incoming = incomingRef.current;
    if (incoming) callSocket.emit('call:reject', { callId: incoming.callId });
    cleanup();
  }, [cleanup]);

  const endCall = useCallback(() => {
    if (callIdRef.current) callSocket.emit('call:leave', { callId: callIdRef.current });
    cleanup();
  }, [cleanup]);

  const toggleMute = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const next = !isMuted;
    stream.getAudioTracks().forEach((track) => (track.enabled = !next));
    setIsMuted(next);
  }, [isMuted]);

  const toggleCamera = useCallback(() => {
    const stream = localStreamRef.current;
    if (!stream) return;
    const next = !isCameraOff;
    stream.getVideoTracks().forEach((track) => (track.enabled = !next));
    setIsCameraOff(next);
  }, [isCameraOff]);

  /** Swap the outgoing video track between the camera and a screen capture. */
  const replaceVideoTrackEverywhere = useCallback((track: MediaStreamTrack | null) => {
    pcsRef.current.forEach((pc) => {
      const sender = pc.getSenders().find((s) => s.track?.kind === 'video');
      if (sender && track) void sender.replaceTrack(track);
    });

    // Keep localStream (self-view + source for late-joining peers) in sync.
    const stream = localStreamRef.current;
    if (stream && track) {
      stream.getVideoTracks().forEach((t) => stream.removeTrack(t));
      stream.addTrack(track);
      setLocalStream(new MediaStream(stream.getTracks()));
    }
  }, []);

  const stopScreenShare = useCallback(() => {
    if (!screenStreamRef.current) return;
    screenStreamRef.current.getTracks().forEach((t) => t.stop());
    screenStreamRef.current = null;

    // Restore the camera track (re-acquire if it was stopped).
    const camera = cameraTrackRef.current;
    if (camera && camera.readyState === 'live') {
      replaceVideoTrackEverywhere(camera);
      setIsScreenSharing(false);
    } else {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((s) => {
          const newCam = s.getVideoTracks()[0] ?? null;
          cameraTrackRef.current = newCam;
          replaceVideoTrackEverywhere(newCam);
        })
        .catch(() => {
          /* camera unavailable - stay without video */
        })
        .finally(() => setIsScreenSharing(false));
    }
  }, [replaceVideoTrackEverywhere]);

  const toggleScreenShare = useCallback(async () => {
    // Only meaningful for video calls (a video sender must already exist so we
    // can replace the track without renegotiating).
    if (callType !== 'video' || statusRef.current === 'idle') return;

    if (isScreenSharing) {
      stopScreenShare();
      return;
    }

    try {
      const display = await navigator.mediaDevices.getDisplayMedia({ video: true });
      const screenTrack = display.getVideoTracks()[0];
      if (!screenTrack) return;

      screenStreamRef.current = display;
      // Stopping from the browser's native "Stop sharing" bar reverts cleanly.
      screenTrack.onended = () => stopScreenShare();

      replaceVideoTrackEverywhere(screenTrack);
      setIsScreenSharing(true);
    } catch {
      // User cancelled the picker or permission denied - no-op.
    }
  }, [callType, isScreenSharing, replaceVideoTrackEverywhere, stopScreenShare]);

  // ---- Socket wiring ------------------------------------------------------

  useEffect(() => {
    callSocket.connect();

    const subscribe = () => {
      callSocket.emit('call:subscribe', (response) => {
        if (response?.iceServers?.length) iceServersRef.current = response.iceServers;
      });
    };

    const handleIncoming = (data: {
      callId: string;
      roomId: string;
      callType: CallType;
      fromUser: ICallPeer;
    }) => {
      // Already busy locally -> politely decline so the caller isn't left hanging.
      if (statusRef.current !== 'idle') {
        callSocket.emit('call:reject', { callId: data.callId });
        return;
      }

      incomingRef.current = {
        callId: data.callId,
        callType: data.callType,
        fromUser: data.fromUser,
      };
      callIdRef.current = data.callId;
      setIncomingFrom(data.fromUser);
      setCallType(data.callType);
      setIsCaller(false);
      setStatusSafe('ringing');

      ringTimeoutRef.current = setTimeout(() => {
        if (statusRef.current === 'ringing') {
          callSocket.emit('call:reject', { callId: data.callId });
          cleanup();
        }
      }, RING_TIMEOUT_MS);
    };

    const handlePeerJoined = (data: { callId: string; peer: ICallPeer }) => {
      if (data.callId !== callIdRef.current) return;
      addParticipant(data.peer);
      // We were already here -> we initiate the offer to the newcomer.
      ensurePeerConnection(data.peer.id, true);
    };

    const handleOffer = async (data: {
      callId: string;
      fromUser: ICallPeer;
      offer: RTCSessionDescriptionInit;
    }) => {
      if (data.callId !== callIdRef.current) return;
      addParticipant(data.fromUser);
      const pc = ensurePeerConnection(data.fromUser.id, false);
      try {
        await pc.setRemoteDescription(data.offer);
        await drainPendingCandidates(data.fromUser.id);
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        callSocket.emit('call:answer', {
          callId: data.callId,
          toUserId: data.fromUser.id,
          answer,
        });
      } catch {
        closePeer(data.fromUser.id);
      }
    };

    const handleAnswer = async (data: {
      callId: string;
      fromUserId: string;
      answer: RTCSessionDescriptionInit;
    }) => {
      if (data.callId !== callIdRef.current) return;
      const pc = pcsRef.current.get(data.fromUserId);
      if (!pc) return;
      try {
        await pc.setRemoteDescription(data.answer);
        await drainPendingCandidates(data.fromUserId);
      } catch {
        closePeer(data.fromUserId);
      }
    };

    const handleIce = async (data: {
      callId: string;
      fromUserId: string;
      candidate: RTCIceCandidateInit;
    }) => {
      if (data.callId !== callIdRef.current) return;
      const pc = pcsRef.current.get(data.fromUserId);
      if (pc && pc.remoteDescription) {
        try {
          await pc.addIceCandidate(data.candidate);
        } catch {
          /* ignore */
        }
      } else {
        const list = pendingCandidatesRef.current.get(data.fromUserId) ?? [];
        list.push(data.candidate);
        pendingCandidatesRef.current.set(data.fromUserId, list);
      }
    };

    const handlePeerLeft = (data: { callId: string; userId: string }) => {
      if (data.callId !== callIdRef.current) return;
      closePeer(data.userId);
    };

    const handleEnded = (data: { callId: string }) => {
      if (data.callId !== callIdRef.current || statusRef.current === 'idle') return;
      toast({ title: 'Call ended', duration: 2500 });
      cleanup();
    };

    const handleUnavailable = () => {
      toast({
        title: 'Unavailable',
        description: 'Nobody is available right now.',
        duration: 3000,
      });
      cleanup();
    };

    const handleFailed = (data: { reason: string }) => {
      toast({
        title: 'Call failed',
        description:
          data.reason === 'blocked'
            ? 'You cannot call this user.'
            : data.reason === 'full'
              ? 'The call is full.'
              : 'Something went wrong.',
        variant: 'destructive',
        duration: 3000,
      });
      cleanup();
    };

    if (callSocket.connected) subscribe();
    callSocket.on('connect', subscribe);
    callSocket.on('call:incoming', handleIncoming);
    callSocket.on('call:peer-joined', handlePeerJoined);
    callSocket.on('call:offer', handleOffer);
    callSocket.on('call:answer', handleAnswer);
    callSocket.on('call:ice', handleIce);
    callSocket.on('call:peer-left', handlePeerLeft);
    callSocket.on('call:ended', handleEnded);
    callSocket.on('call:unavailable', handleUnavailable);
    callSocket.on('call:failed', handleFailed);

    return () => {
      callSocket.off('connect', subscribe);
      callSocket.off('call:incoming', handleIncoming);
      callSocket.off('call:peer-joined', handlePeerJoined);
      callSocket.off('call:offer', handleOffer);
      callSocket.off('call:answer', handleAnswer);
      callSocket.off('call:ice', handleIce);
      callSocket.off('call:peer-left', handlePeerLeft);
      callSocket.off('call:ended', handleEnded);
      callSocket.off('call:unavailable', handleUnavailable);
      callSocket.off('call:failed', handleFailed);
    };
  }, [
    addParticipant,
    cleanup,
    closePeer,
    drainPendingCandidates,
    ensurePeerConnection,
    setStatusSafe,
  ]);

  const participantList = useMemo(() => [...participants.values()], [participants]);

  const value = useMemo<CallContextValue>(
    () => ({
      status,
      callType,
      incomingFrom,
      isCaller,
      isMuted,
      isCameraOff,
      isScreenSharing,
      localStream,
      participants: participantList,
      startCall,
      acceptCall,
      rejectCall,
      endCall,
      toggleMute,
      toggleCamera,
      toggleScreenShare,
    }),
    [
      status,
      callType,
      incomingFrom,
      isCaller,
      isMuted,
      isCameraOff,
      isScreenSharing,
      localStream,
      participantList,
      startCall,
      acceptCall,
      rejectCall,
      endCall,
      toggleMute,
      toggleCamera,
      toggleScreenShare,
    ],
  );

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
}

export function useCall() {
  const ctx = useContext(CallContext);
  if (!ctx) throw new Error('useCall must be used within a CallProvider');
  return ctx;
}
