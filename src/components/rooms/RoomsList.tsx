"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface Room {
  id: string;
  code: string;
  name: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  max_participants: number;
  participants?: string[];
}

export function RoomsList() {
  const router = useRouter()
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          const { data, error } = await supabase
            .from('rooms')
            .select('*');

          if (error) {
            console.error('Error fetching rooms:', error.message);
            return;
          }
          console.log(data, "data")
          setRooms(data);
        }
      } catch (error) {
        console.error('Error fetching rooms:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRooms()
  }, [supabase])

  const handleJoinRoom = (roomCode: string) => {
    router.push(`/room/${roomCode}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">Cargando reuniones...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#7886C7]">Mis Reuniones</h1>
          <Button 
            onClick={() => router.push('/create')}
            className="bg-[#7886C7] hover:bg-[#7886C7]/90"
          >
            Crear Nueva Reunión
          </Button>
        </div>

        {rooms.length === 0 ? (
          <Card className="border-0 shadow-none">
            <CardContent className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No tienes reuniones programadas. Crea una nueva reunión para comenzar.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {rooms.map((room) => (
              <Card key={room.id} className="border-0 shadow-none hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-xl">{room.name}</CardTitle>
                  <CardDescription>
                    {room.created_at ? format(new Date(room.created_at), "PPP", { locale: es }) : 'Fecha no disponible'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <div className="text-sm text-muted-foreground">
                      Máximo {room.max_participants} {room.max_participants === 1 ? 'participante' : 'participantes'}
                    </div>
                    <Button 
                      onClick={() => handleJoinRoom(room.code)}
                      className="bg-[#7886C7] hover:bg-[#7886C7]/90"
                    >
                      Unirse a la Reunión
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
} 