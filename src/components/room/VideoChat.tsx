'use client';

import { useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { ROOM_EVENTS } from '@/lib/constants/room.constants';

interface VideoChatProps {
  serverUrl?: string;
  defaultRoomId?: string;
}

export default function VideoChat({ 
  serverUrl = 'http://localhost:2000', 
  defaultRoomId = '' 
}: VideoChatProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomId, setRoomId] = useState(defaultRoomId);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<{text: string, sender: string}[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isInRoom, setIsInRoom] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);

  // Initialize socket connection
  useEffect(() => {
    // Setup WebRTC peer connection
    const setupPeerConnection = () => {
      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      peerConnection.current.ontrack = (event) => {
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate && socket) {
          socket.emit('signal', {
            room: roomId,
            to: null, // Will be set by the server
            signal: event.candidate,
            type: 'video'
          });
        }
      };

      peerConnection.current.onconnectionstatechange = () => {
        console.log('Connection state:', peerConnection.current?.connectionState);
      };

      peerConnection.current.oniceconnectionstatechange = () => {
        console.log('ICE connection state:', peerConnection.current?.iceConnectionState);
      };
    };

    const newSocket = io(serverUrl, {
      path: '/socket.io',
      transports: ['websocket', 'polling'],
    });

    // Connection events
    newSocket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      setError(null);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    newSocket.on('error', (data) => {
      console.error('Socket error:', data);
      setError(data.message || 'An error occurred');
    });

    // Room events
    newSocket.on(ROOM_EVENTS.USER_JOINED, (data) => {
      console.log('User joined:', data);
      
      // If this is the first user in the room (the creator), update the room state
      if (data.isCreator) {
        console.log('Room created by user:', data.userId);
        setRoomId(data.roomId);
        setIsInRoom(true);
        setMessages(prev => [...prev, { text: `Created room: ${data.roomId}`, sender: 'system' }]);
        
        // If we have a peer connection, update it with the new room ID
        if (peerConnection.current) {
          peerConnection.current.onicecandidate = (event) => {
            if (event.candidate && socket) {
              socket.emit('signal', {
                room: data.roomId,
                to: null, // Will be set by the server
                signal: event.candidate,
                type: 'video'
              });
            }
          };
        }
      } else {
        // Regular user joined event
        setMessages(prev => [...prev, { text: `${data.userId} joined the room`, sender: 'system' }]);
      }
    });

    newSocket.on(ROOM_EVENTS.USER_LEFT, (data) => {
      console.log('User left:', data);
      setMessages(prev => [...prev, { text: `${data.userId} left the room`, sender: 'system' }]);
    });

    // Video events
    newSocket.on('video-offer', async (data) => {
      console.log('Received video offer:', data);
      try {
        if (!peerConnection.current) {
          setupPeerConnection();
        }
        await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(data.sdpOffer));
        const answer = await peerConnection.current?.createAnswer();
        await peerConnection.current?.setLocalDescription(answer);
        
        newSocket.emit(ROOM_EVENTS.VIDEO_ANSWER, {
          room: roomId,
          targetUserId: data.userId,
          sdpAnswer: answer
        });
      } catch (error) {
        console.error('Error handling video offer:', error);
        setError('Failed to handle video offer');
      }
    });

    newSocket.on('video-answer-received', async (data) => {
      console.log('Received video answer:', data);
      try {
        await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(data.sdpAnswer));
      } catch (error) {
        console.error('Error handling video answer:', error);
        setError('Failed to handle video answer');
      }
    });

    newSocket.on('signal', async (data) => {
      console.log('Received signal:', data);
      try {
        if (data.signal && data.signal.candidate) {
          await peerConnection.current?.addIceCandidate(new RTCIceCandidate(data.signal.candidate));
        }
      } catch (error) {
        console.error('Error handling signal:', error);
        setError('Failed to handle signal');
      }
    });

    newSocket.on(ROOM_EVENTS.VIDEO_STATE, (data) => {
      console.log('Video state changed:', data);
      if (data.userId !== newSocket.id) {
        setIsVideoEnabled(data.videoEnabled);
      }
    });

    // Message events
    newSocket.on(ROOM_EVENTS.MESSAGE, (data) => {
      console.log('Received message:', data);
      setMessages(prev => [...prev, { text: data.message, sender: data.from || 'unknown' }]);
    });

    // Room joined event
    newSocket.on('room-joined', (data) => {
      console.log('Room joined:', data);
      setRoomId(data.roomId);
      setIsInRoom(true);
      setMessages(prev => [...prev, { text: `Joined room: ${data.roomId}`, sender: 'system' }]);
    });

    // Ping-pong for connection testing
    newSocket.on('pong', () => {
      console.log('Received pong from server');
      setMessages(prev => [...prev, { text: 'Server is responsive', sender: 'system' }]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, [serverUrl, roomId, socket]);

  // Setup WebRTC peer connection
  const setupPeerConnection = () => {
    peerConnection.current = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });

    peerConnection.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('signal', {
          room: roomId,
          to: null, // Will be set by the server
          signal: event.candidate,
          type: 'video'
        });
      }
    };

    peerConnection.current.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.current?.connectionState);
    };

    peerConnection.current.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', peerConnection.current?.iceConnectionState);
    };
  };

  // Create a new room
  const createRoom = () => {
    if (socket) {
      // Generate a random user ID if needed
      const userId = 'fd66b542-967e-47b9-95dc-fead58209cfb';
      
      socket.emit(ROOM_EVENTS.CREATE, { 
        name: 'test', 
        maxParticipants: 2, 
        userId: userId 
      });
      
      console.log('Creating a new room...');
      console.log('Socket ID:', socket.id);
      console.log('Event:', ROOM_EVENTS.CREATE);
      
      setMessages(prev => [...prev, { text: 'Creating a new room...', sender: 'system' }]);
      
      // Set a timeout to check if we received a response
      setTimeout(() => {
        if (!isInRoom) {
          console.log('No response from server after room creation, checking connection...');
          if (socket.connected) {
            console.log('Socket is connected, but no user-joined event with isCreator flag received');
            setError('Failed to create room. Please try again.');
          } else {
            console.log('Socket is not connected');
            setError('Connection lost. Please refresh the page.');
          }
        }
      }, 5000);
    }
  };

  // Join a room
  const joinRoom = () => {
    if (socket && roomId) {
      socket.emit(ROOM_EVENTS.JOIN, { room: roomId });
      setIsInRoom(true);
      setMessages(prev => [...prev, { text: `Joined room: ${roomId}`, sender: 'system' }]);
    }
  };

  // Leave the current room
  const leaveRoom = () => {
    if (socket && roomId) {
      socket.emit(ROOM_EVENTS.LEAVE, { room: roomId });
      setIsInRoom(false);
      setMessages(prev => [...prev, { text: `Left room: ${roomId}`, sender: 'system' }]);
      
      // Stop video if enabled
      if (isVideoEnabled) {
        stopVideo();
      }
    }
  };

  // Start video sharing
  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStream.current = stream;
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      if (!peerConnection.current) {
        setupPeerConnection();
      }

      stream.getTracks().forEach(track => {
        peerConnection.current?.addTrack(track, stream);
      });

      const offer = await peerConnection.current?.createOffer();
      await peerConnection.current?.setLocalDescription(offer);

      socket?.emit(ROOM_EVENTS.VIDEO_SHARE, {
        room: roomId,
        videoEnabled: true,
        sdpOffer: offer
      });

      setIsVideoEnabled(true);
      setError(null);
    } catch (error) {
      console.error('Error starting video:', error);
      setError('Failed to start video. Please check your camera permissions.');
    }
  };

  // Stop video sharing
  const stopVideo = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach(track => track.stop());
      localStream.current = null;
    }

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    socket?.emit(ROOM_EVENTS.VIDEO_SHARE, {
      room: roomId,
      videoEnabled: false
    });

    setIsVideoEnabled(false);
  };

  // Send a message to the room
  const sendMessage = () => {
    if (socket && message && roomId) {
      console.log('Sending message:', message);
      socket.emit(ROOM_EVENTS.BROADCAST, { room: roomId, message });
      setMessages(prev => [...prev, { text: message, sender: 'me' }]);
      setMessage('');
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage();
    }
  };

  // Debug function to check socket connection and room state
  const debugConnection = () => {
    if (socket) {
      console.log('Socket connection status:', socket.connected);
      console.log('Socket ID:', socket.id);
      console.log('Current room ID:', roomId);
      console.log('Is in room:', isInRoom);
      console.log('Is connected:', isConnected);
      
      // Emit a ping to check if the server is responsive
      socket.emit('ping');
      
      setMessages(prev => [...prev, { text: 'Debug info logged to console', sender: 'system' }]);
    } else {
      console.log('Socket is not initialized');
      setError('Socket is not initialized. Please refresh the page.');
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Video Chat</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter Room ID (e.g., abc-def)"
          className="border p-2 rounded flex-grow"
          disabled={isInRoom}
        />
        
        {!isInRoom ? (
          <div className="flex gap-2">
            <button 
              onClick={createRoom} 
              className="bg-green-500 text-white p-2 rounded hover:bg-green-600 disabled:bg-gray-400"
              disabled={!isConnected}
            >
              Create Room
            </button>
            <button 
              onClick={joinRoom} 
              className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              disabled={!isConnected || !roomId}
            >
              Join Room
            </button>
            <button 
              onClick={debugConnection} 
              className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
            >
              Debug
            </button>
          </div>
        ) : (
          <button 
            onClick={leaveRoom} 
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Leave Room
          </button>
        )}
      </div>

      {isInRoom && (
        <>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Local Video</h3>
              <video 
                ref={localVideoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full border rounded bg-gray-100"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-2">Remote Video</h3>
              <video 
                ref={remoteVideoRef} 
                autoPlay 
                playsInline 
                className="w-full border rounded bg-gray-100"
              />
            </div>
          </div>

          <div className="mb-4 flex gap-2">
            {!isVideoEnabled ? (
              <button 
                onClick={startVideo} 
                className="bg-green-500 text-white p-2 rounded hover:bg-green-600"
              >
                Start Video
              </button>
            ) : (
              <button 
                onClick={stopVideo} 
                className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600"
              >
                Stop Video
              </button>
            )}
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Messages</h3>
            <div className="border rounded p-4 h-64 overflow-y-auto mb-2 bg-gray-50">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-2 p-2 rounded ${
                    msg.sender === 'me' 
                      ? 'bg-blue-100 ml-auto' 
                      : msg.sender === 'system' 
                        ? 'bg-gray-200 text-center text-sm' 
                        : 'bg-gray-100'
                  }`}
                >
                  {msg.sender === 'me' ? 'You' : msg.sender === 'system' ? '' : `User ${msg.sender}:`} {msg.text}
                </div>
              ))}
            </div>
            
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message"
                className="border p-2 rounded flex-grow"
              />
              <button 
                type="submit" 
                className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                disabled={!message.trim()}
              >
                Send
              </button>
            </form>
          </div>
        </>
      )}
      
      <div className="text-sm text-gray-500">
        Connection status: {isConnected ? 'Connected' : 'Disconnected'}
      </div>
    </div>
  );
}