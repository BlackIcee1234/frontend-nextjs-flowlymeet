import { PeerConnectionConfig, SignalData } from "../types/webrtc.types";
import { Socket } from "socket.io-client";
export const initializePeerConnection = (config: PeerConnectionConfig) => {
  const { userId, type, stream, socket, roomId, onTrack } = config;
  const peer = new RTCPeerConnection({
    iceServers: 
    [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun.l.google.com:5349" },
      { urls: "stun:stun1.l.google.com:3478" },
      { urls: "stun:stun1.l.google.com:5349" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:5349" },
      { urls: "stun:stun3.l.google.com:3478" },
      { urls: "stun:stun3.l.google.com:5349" },
      { urls: "stun:stun4.l.google.com:19302" },
      { urls: "stun:stun4.l.google.com:5349" }
    ]
  });

  if (stream) {
    stream.getTracks().forEach(track => peer.addTrack(track, stream));
  }

  peer.onicecandidate = (event) => {
    if (event.candidate) {
      socket?.emit('signal', {
        room: roomId,
        to: userId,
        signal: event.candidate,
        type
      });
    }
  };

  peer.ontrack = (event) => {
    const remoteStream = event.streams[0];
    if (onTrack) {
      onTrack(remoteStream);
    }
  };

  return peer;
};

export const handleSignal = async (
  peer: RTCPeerConnection,
  signal: SignalData,
  socket: Socket,
  roomId: string,
  to: string,
  type: 'video' | 'screen' | 'audio'
) => {
  try {
    if (signal.type === 'offer') {
      await peer.setRemoteDescription(new RTCSessionDescription(signal as RTCSessionDescriptionInit));
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit('signal', {
        room: roomId,
        to,
        signal: answer,
        type
      });
    } else if (signal.type === 'answer') {
      await peer.setRemoteDescription(new RTCSessionDescription(signal as RTCSessionDescriptionInit));
    } else if (signal.candidate) {
      await peer.addIceCandidate(new RTCIceCandidate(signal.candidate as RTCIceCandidateInit));
    }
  } catch (error) {
    console.error('Error handling signal:', error);
  }
};

export const toggleMediaTrack = (stream: MediaStream, type: 'video' | 'audio') => {
  const track = stream.getTracks().find(t => 
    type === 'video' ? t.kind === 'video' : t.kind === 'audio'
  );
  if (track) {
    track.enabled = !track.enabled;
    return {
      hasVideo: stream.getVideoTracks()[0].enabled,
      hasAudio: stream.getAudioTracks()[0].enabled
    };
  }
  return null;
};

export const stopMediaStream = (stream: MediaStream | null) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};