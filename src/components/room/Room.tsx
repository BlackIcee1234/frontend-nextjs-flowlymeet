'use client';

import { useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRoom } from '@/lib/hooks/useRoom';
import { Video, Mic, MicOff, VideoOff, Share2, MessageSquare, X } from 'lucide-react';

export const Room = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  
  const {
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
  } = useRoom();

  // Set local stream to video element when it's available
  if (localStream && videoRef.current) {
    videoRef.current.srcObject = localStream;
  }

  // Set screen share stream to video element when it's available
  if (screenStream && screenRef.current) {
    screenRef.current.srcObject = screenStream;
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sala de Videoconferencia ({participants.length} participantes)</CardTitle>
          <Button variant="destructive" onClick={disconnect}>
            <X className="mr-2 h-4 w-4" />
            Salir
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg"
                />
                <div className="absolute bottom-4 left-4 space-x-2">
                  <Button 
                    variant="secondary" 
                    size="icon"
                    onClick={() => toggleMedia('video')}
                  >
                    {localStream?.getVideoTracks()[0]?.enabled ? <Video /> : <VideoOff />}
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon"
                    onClick={() => toggleMedia('audio')}
                  >
                    {localStream?.getAudioTracks()[0]?.enabled ? <Mic /> : <MicOff />}
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="icon"
                    onClick={toggleScreenShare}
                  >
                    <Share2 />
                  </Button>
                </div>
              </div>
              {screenStream && (
                <video
                  ref={screenRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg"
                />
              )}
            </div>
            
            <div className="h-40 overflow-y-auto border rounded-lg p-2 mb-4 bg-muted">
              {messages.map((msg, index) => (
                <div key={index} className="p-2 bg-background rounded mb-2">
                  <span className="font-semibold">{msg.from}: </span>
                  <span>{msg.text}</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Escribe un mensaje..."
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button onClick={sendMessage}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Enviar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};