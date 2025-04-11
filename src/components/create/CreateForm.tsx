"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"

export function CreateForm() {
  const router = useRouter()
  const [date, setDate] = useState<Date>()
  const [emails, setEmails] = useState<string[]>([])
  const [currentEmail, setCurrentEmail] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  const handleAddEmail = () => {
    if (currentEmail && !emails.includes(currentEmail)) {
      setEmails([...emails, currentEmail])
      setCurrentEmail("")
    }
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmails(emails.filter(email => email !== emailToRemove))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          date,
          emails,
          userId: "user-id-here" // You'll need to get this from your auth system
        }),
      })

      if (response.ok) {
        router.push('/rooms')
      }
    } catch (error) {
      console.error('Error creating room:', error)
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
              Completa los detalles de tu reunión y compártela con los participantes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título de la Reunión</Label>
                <Input
                  id="title"
                  placeholder="Ej: Reunión de equipo semanal"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  placeholder="Describe el propósito de la reunión"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Fecha y Hora</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP", { locale: es }) : "Selecciona una fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Invitados</Label>
                <div className="flex gap-2">
                  <Input
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={currentEmail}
                    onChange={(e) => setCurrentEmail(e.target.value)}
                  />
                  <Button type="button" onClick={handleAddEmail}>
                    Agregar
                  </Button>
                </div>
                {emails.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {emails.map((email) => (
                      <div
                        key={email}
                        className="flex items-center justify-between p-2 bg-muted rounded-md"
                      >
                        <span className="text-sm">{email}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEmail(email)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full bg-[#7886C7] hover:bg-[#7886C7]/90">
                Crear Reunión
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 