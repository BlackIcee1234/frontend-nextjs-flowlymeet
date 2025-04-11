import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { BACKEND_URL, ROOM_EVENTS } from '@/lib/constants/room.constants';
import { Participant } from '@/lib/types/room.types';
import { Message } from '@/lib/types/webrtc.types';
import { initializePeerConnection, handleSignal, toggleMediaTrack, stopMediaStream } from '@/lib/utils/webrtc';
import { setupSocketEvents, emitJoinRoom, emitLeaveRoom, emitMediaStateChange, emitScreenShareStart, emitScreenShareStop, emitMessage } from '@/lib/utils/socket';
import { useParams } from 'next/navigation';

export const useRoom = () => {
  const params = useParams();
  const roomId = params?.id as string;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const peers = useRef<Record<string, RTCPeerConnection>>({});

  // Setup WebRTC peer connection
  const setupPeerConnection = (userId: string) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    peerConnection.ontrack = (event) => {
      if (localStream) {
        localStream.addTrack(event.track);
      }
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit(ROOM_EVENTS.ICE_CANDIDATE, {
          room: roomId,
          targetUserId: userId,
          candidate: event.candidate
        });
      }
    };

    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState);
      if (peerConnection.connectionState === 'disconnected' || 
          peerConnection.connectionState === 'failed') {
        if (peers.current[userId]) {
          peers.current[userId].close();
          delete peers.current[userId];
        }
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', peerConnection.iceConnectionState);
    };

    return peerConnection;
  };

  useEffect(() => {
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        setLocalStream(stream);
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setError('No se pudo acceder a la cámara o micrófono');
      }
    };

    const initializeSocket = () => {
      const socketInstance = io(BACKEND_URL, {
        path: '/socket.io',
        transports: ['websocket', 'polling'],
      });

      // Connection events
      socketInstance.on('connect', () => {
        console.log('Connected to server');
        setIsConnected(true);
        setError(null);
      });

      socketInstance.on('disconnect', () => {
        console.log('Disconnected from server');
        setIsConnected(false);
      });

      socketInstance.on(ROOM_EVENTS.ERROR, (data) => {
        console.error('Socket error:', data);
        setError(data.message || 'Ocurrió un error');
      });

      // Room events
      socketInstance.on(ROOM_EVENTS.USER_JOINED, (data) => {
        console.log('User joined:', data);
        if (data.isCreator) {
          setMessages(prev => [...prev, { 
            text: `Sala creada: ${data.roomId}`, 
            from: 'system', 
            timestamp: new Date().toISOString() 
          }]);
        } else {
          setMessages(prev => [...prev, { 
            text: `${data.userId} se unió a la sala`, 
            from: 'system', 
            timestamp: new Date().toISOString() 
          }]);
        }
      });

      socketInstance.on(ROOM_EVENTS.USER_LEFT, (data) => {
        console.log('User left:', data);
        setMessages(prev => [...prev, { 
          text: `${data.userId} abandonó la sala`, 
          from: 'system', 
          timestamp: new Date().toISOString() 
        }]);
      });

      // Video events
      socketInstance.on('video-offer', async (data) => {
        console.log('Received video offer:', data);
        try {
          const { userId, sdpOffer } = data;
          const peer = setupPeerConnection(userId);
          await peer.setRemoteDescription(new RTCSessionDescription(sdpOffer));
          const answer = await peer.createAnswer();
          await peer.setLocalDescription(answer);
          
          socketInstance.emit(ROOM_EVENTS.VIDEO_ANSWER, {
            room: roomId,
            targetUserId: userId,
            sdpAnswer: answer
          });
        } catch (error) {
          console.error('Error handling video offer:', error);
          setError('Error al manejar la oferta de video');
        }
      });

      socketInstance.on('video-answer-received', async (data) => {
        console.log('Received video answer:', data);
        try {
          const { userId, sdpAnswer } = data;
          const peer = peers.current[userId];
          if (peer) {
            await peer.setRemoteDescription(new RTCSessionDescription(sdpAnswer));
          }
        } catch (error) {
          console.error('Error handling video answer:', error);
          setError('Error al manejar la respuesta de video');
        }
      });

      socketInstance.on('existing-users', (data) => {
        console.log('Existing users:', data);
        const { users } = data;
        users.forEach((userId: string) => {
          if (!peers.current[userId]) {
            const peer = setupPeerConnection(userId);
            peers.current[userId] = peer;
          }
        });
      });

      socketInstance.on(ROOM_EVENTS.VIDEO_STATE, (data) => {
        console.log('Video state changed:', data);
        if (data.userId !== socketInstance.id) {
          setIsVideoEnabled(data.videoEnabled);
        }
      });

      // Message events
      socketInstance.on(ROOM_EVENTS.MESSAGE, (data) => {
        console.log('Received message:', data);
        setMessages(prev => [...prev, { 
          text: data.message, 
          from: data.from || 'unknown',
          timestamp: new Date().toISOString()
        }]);
      });

      // Join room automatically
      socketInstance.emit(ROOM_EVENTS.JOIN, { room: roomId });
      setSocket(socketInstance);

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
            const peer = setupPeerConnection(participant.id);
            peers.current[participant.id] = peer;
          });
        }
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
      setError('Error al compartir pantalla');
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
    disconnect,
    isConnected,
    isVideoEnabled,
    error
  };
};