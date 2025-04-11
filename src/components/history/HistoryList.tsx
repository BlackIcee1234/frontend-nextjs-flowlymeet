"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Calendar, Clock, Users, Video } from "lucide-react"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

interface Meeting {
  id: string
  title: string
  description: string
  date: string
  duration: number
  participants: number
  status: "completed" | "cancelled"
}

export function HistoryList() {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return

        // Aquí deberías reemplazar esto con tu llamada real a la API
        // Por ahora usaremos datos de ejemplo
        const mockMeetings: Meeting[] = [
          {
            id: "1",
            title: "Reunión de Equipo Semanal",
            description: "Revisión de objetivos y planificación de la semana",
            date: "2024-04-15T10:00:00",
            duration: 60,
            participants: 5,
            status: "completed"
          },
          {
            id: "2",
            title: "Presentación de Proyecto",
            description: "Demo del nuevo feature para el cliente",
            date: "2024-04-16T15:30:00",
            duration: 45,
            participants: 3,
            status: "cancelled"
          }
        ]

        setMeetings(mockMeetings)
      } catch (error) {
        console.error('Error fetching meetings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMeetings()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">Cargando historial...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#7886C7]">Historial de Reuniones</h1>
        </div>

        {meetings.length === 0 ? (
          <Card className="border-0 shadow-none">
            <CardContent className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No hay reuniones en el historial.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {meetings.map((meeting) => (
              <Card key={meeting.id} className="border-0 shadow-none hover:bg-muted/50 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{meeting.title}</CardTitle>
                      <CardDescription className="mt-2">{meeting.description}</CardDescription>
                    </div>
                    <Badge variant={meeting.status === "completed" ? "default" : "destructive"}>
                      {meeting.status === "completed" ? "Completada" : "Cancelada"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {format(new Date(meeting.date), "PPP", { locale: es })}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      {format(new Date(meeting.date), "p", { locale: es })} - {meeting.duration} minutos
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      {meeting.participants} participantes
                    </div>
                    {meeting.status === "completed" && (
                      <Button variant="outline" className="w-full">
                        <Video className="mr-2 h-4 w-4" />
                        Ver Grabación
                      </Button>
                    )}
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