"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Loader2, Mail, Calendar, Shield, LogOut } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  email: string
//   full_name: string
//   avatar_url: string
  created_at: string
  last_sign_in: string
  provider: string
}

export function AccountProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        if (sessionError) throw sessionError
        if (!session?.user) return

        // const { data: profileData, error: profileError } = await supabase
        //   .from('profiles')
        //   .select('*')
        //   .eq('id', session.user.id)
        //   .single()

        // if (profileError) throw profileError

        setProfile({
          id: session.user.id,
          email: session.user.email!,
        //   full_name: profileData?.full_name || session.user.user_metadata.full_name || 'Usuario',
        //   avatar_url: profileData?.avatar_url || session.user.user_metadata.avatar_url || '',
          created_at: session.user.created_at,
          last_sign_in: session.user.last_sign_in_at || '',
          provider: session.user.app_metadata.provider || 'email'
        })
      } catch (error) {
        console.error('Error fetching profile:', error)
        setError('Error al cargar el perfil')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      router.push('/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-[#7886C7]" />
            <p className="mt-2 text-muted-foreground">Cargando perfil...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center text-red-500">
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <p className="text-muted-foreground">No se encontró el perfil del usuario</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-[#7886C7]">Mi Cuenta</h1>
          <Button 
            variant="outline" 
            onClick={handleSignOut}
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>

        <div className="grid gap-6">
          <Card className="border-0 shadow-none">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  {/* <AvatarImage src={profile.avatar_url} />
                  <AvatarFallback>{profile.full_name.charAt(0)}</AvatarFallback> */}
                </Avatar>
                <div>
                  {/* <CardTitle className="text-2xl">{profile.full_name}</CardTitle> */}
                  <CardDescription>Miembro desde {format(new Date(profile.created_at), "MMMM yyyy", { locale: es })}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Correo electrónico:</span>
                  <span className="ml-2">{profile.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Shield className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Proveedor de autenticación:</span>
                  <span className="ml-2 capitalize">{profile.provider}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Último inicio de sesión:</span>
                  <span className="ml-2">
                    {profile.last_sign_in 
                      ? format(new Date(profile.last_sign_in), "PPP p", { locale: es })
                      : 'Nunca'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 