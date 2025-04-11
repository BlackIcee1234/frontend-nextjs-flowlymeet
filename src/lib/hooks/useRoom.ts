import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { BACKEND_URL } from '@/lib/constants/room.constants';
import { Participant } from '@/lib/types/room.types';
import { Message } from '@/lib/types/webrtc.types';
import { initializePeerConnection, handleSignal, toggleMediaTrack, stopMediaStream } from '@/lib/utils/webrtc';
import { setupSocketEvents, emitJoinRoom, emitLeaveRoom, emitMediaStateChange, emitScreenShareStart, emitScreenShareStop, emitMessage } from '@/lib/utils/socket';

export const useRoom = (roomId: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const peers = useRef<Record<string, RTCPeerConnection>>({});
  console.log(socket)

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setLocalStream(stream);
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    const initializeSocket = () => {
      const socketInstance = io(BACKEND_URL);
      setSocket(socketInstance);
      emitJoinRoom(socketInstance, roomId);

      setupSocketEvents(socketInstance, {
        onUserJoined: (userId, roomParticipants) => {
          setParticipants(roomParticipants);
          if (localStream) {
            const peer = initializePeerConnection({
              userId,
              type: 'video',
              stream: localStream,
              socket: socketInstance,
              roomId
            });
            peers.current[userId] = peer;
          }
        },
        onUserDisconnected: (userId) => {
          if (peers.current[userId]) {
            peers.current[userId].close();
            delete peers.current[userId];
          }
          setParticipants(prev => prev.filter(p => p.id !== userId));
        },
        onMessage: (message) => {
          setMessages(prev => [...prev, message]);
        },
        onMediaStateChange: (userId, hasVideo, hasAudio) => {
          setParticipants(prev =>
            prev.map(p => p.id === userId ? { ...p, hasVideo, hasAudio } : p)
          );
        },
        onScreenShareStart: (userId) => {
          setParticipants(prev =>
            prev.map(p => p.id === userId ? { ...p, isScreenSharing: true } : p)
          );
        },
        onScreenShareStop: (userId) => {
          setParticipants(prev =>
            prev.map(p => p.id === userId ? { ...p, isScreenSharing: false } : p)
          );
        },
        onSignal: async (payload) => {
          const { from, signal, type } = payload;
          if (!peers.current[from]) {
            const peer = initializePeerConnection({
              userId: from,
              type,
              stream: type === 'screen' ? screenStream : localStream,
              socket: socketInstance,
              roomId
            });
            peers.current[from] = peer;
          }
          await handleSignal(peers.current[from], signal, socketInstance, roomId, from, type);
        }
      });

      return socketInstance;
    };

    initializeMedia();
    const socketInstance = initializeSocket();

    return () => {
      stopMediaStream(localStream);
      stopMediaStream(screenStream);
      Object.values(peers.current).forEach(peer => peer.close());
      if (socketInstance) {
        emitLeaveRoom(socketInstance, roomId);
        socketInstance.disconnect();
      }
    };
  }, [roomId]);

  useEffect(() => {
    const currentPeers = peers.current;
    return () => {
      Object.values(currentPeers).forEach(peer => {
        peer.close();
      });
    };
  }, []);

  useEffect(() => {
    if (localStream && socket) {
      participants.forEach(participant => {
        if (!peers.current[participant.id]) {
          const peer = initializePeerConnection({
            userId: participant.id,
            type: 'video',
            stream: localStream,
            socket,
            roomId
          });
          peers.current[participant.id] = peer;
        }
      });
    }
  }, [localStream, screenStream, socket, roomId, participants]);

  const toggleMedia = (type: 'video' | 'audio') => {
    if (localStream && socket) {
      const mediaState = toggleMediaTrack(localStream, type);
      if (mediaState) {
        emitMediaStateChange(socket, roomId, mediaState.hasVideo, mediaState.hasAudio);
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (screenStream) {
        stopMediaStream(screenStream);
        setScreenStream(null);
        if (socket) {
          emitScreenShareStop(socket, roomId);
        }
      } else {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
        setScreenStream(stream);
        if (socket) {
          emitScreenShareStart(socket, roomId);
          participants.forEach(participant => {
            const peer = initializePeerConnection({
              userId: participant.id,
              type: 'screen',
              stream,
              socket,
              roomId
            });
            peers.current[participant.id] = peer;
          });
        }
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  const sendMessage = () => {
    if (!message.trim() || !socket) return;
    emitMessage(socket, roomId, message);
    setMessage('');
  };

  const disconnect = () => {
    if (socket) {
      emitLeaveRoom(socket, roomId);
      socket.disconnect();
      setSocket(null);
    }
  };

  return {
    localStream,
    screenStream,
    participants,
    messages,
    message,
    setMessage,
    toggleMedia,
    toggleScreenShare,
    sendMessage,
    disconnect
  };
};