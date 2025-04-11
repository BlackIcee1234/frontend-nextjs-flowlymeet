"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

export function CreateForm() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [maxParticipants, setMaxParticipants] = useState<number | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()


  const createRoom = async (name: string, maxParticipants?: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    
    const response = await fetch('http://localhost:2000/rooms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token}`
      },
      body: JSON.stringify({
        name,
        maxParticipants
      })
    });

    return response.json();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const result = await createRoom(name, maxParticipants)
      console.log(result, "result")
      if (result.success) {
        router.push('/rooms')
      }
    } catch (error) {
      console.error('Error creating room:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <Card className="border-0 shadow-none">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-[#7886C7]">
              Crear Nueva Reunión
            </CardTitle>
            <CardDescription>
              Completa los detalles de tu reunión
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Reunión</Label>
                <Input
                  id="name"
                  placeholder="Ej: Reunión de equipo semanal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxParticipants">Máximo de Participantes (opcional)</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  min="1"
                  placeholder="Ej: 10"
                  value={maxParticipants || ''}
                  onChange={(e) => setMaxParticipants(e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-[#7886C7] hover:bg-[#7886C7]/90"
                disabled={isLoading}
              >
                {isLoading ? 'Creando...' : 'Crear Reunión'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 