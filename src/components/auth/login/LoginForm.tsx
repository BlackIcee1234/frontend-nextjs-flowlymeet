'use client';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { singInWithEmailAndPassword } from '@/app/auth/actions';
import { isValidEmail, isValidPassword } from "@/lib/utils/user.validation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const router = useRouter();
    const supabase = createClient();

    const handleGoogleLogin = async () => {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          }
        })
        if (error) throw error
      } catch (error) {
        console.error('Error logging in with Google:', error)
      }
    }
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setEmailError('');
      setPasswordError('');

      if (!isValidEmail(email)) {
        setEmailError('Por favor, ingresa un correo electrónico válido');
        return;
      }
      if (!isValidPassword(password)) {
        setPasswordError('La contraseña debe tener al menos 8 caracteres');
        return;
      }

      const { data, error } = await singInWithEmailAndPassword({ email, password });

      if (error) {
        setPasswordError('Credenciales incorrectas. Por favor, verifica tus datos.');
      } else {
        console.log('Logged in successfully:', data);
        router.push('/dashboard');
      }
    };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-[#7886C7]">¡Bienvenido de nuevo!</h1>
                <p className="text-balance text-muted-foreground">
                    Inicia sesión en tu cuenta de FlowlyMeet
                </p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Correo</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={emailError ? "border-red-500" : ""}
                />
                {emailError && <p className="text-sm text-red-500">{emailError}</p>}
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Contraseña</Label>
                  <a
                    href="/auth/reset-password"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  required  
                  onChange={(e) => setPassword(e.target.value)}
                  className={passwordError ? "border-red-500" : ""}
                />
                {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
              </div>
              <Button type="submit" className="w-full bg-[#7886C7] hover:bg-[#A9B5DF]">
                Iniciar sesión
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                    O continúa con
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4">
                <p
                  className="cursor-pointer flex items-center justify-center w-full h-12 bg-[#fff] hover:bg-[#D1E1FF] rounded-md transition duration-200 ease-in-out shadow-md"
                  onClick={handleGoogleLogin}
                  aria-label="Login with Google"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6">
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="#7886C7"
                    />
                  </svg>
                  <span className="ml-2 text-sm font-medium text-[#7886C7]">Iniciar sesión con Google</span>
                </p>
              </div>
              <div className="text-center text-sm text-[#7886C7]">
                ¿No tienes una cuenta?{" "}
                <Link href="/auth/signup" className="underline underline-offset-4">
                    Regístrate
                </Link>
            </div>
            </div>
          </form>
          <div className="relative hidden bg-muted md:block">
            <Image
              src="https://cdn.sanity.io/images/t64y86n0/production/d47fc36ca05580f9998c039ac6ed7e1aeacb8d3b-1018x1080.png"
              alt="Image"
              width={100}
              height={100}
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              unoptimized={true}
              priority={true}
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Al iniciar sesión, aceptas nuestros <a href="/terms">Términos de Servicio</a>{" "}
        y nuestra <a href="/privacy">Política de Privacidad</a>.
      </div>
    </div>
  )
}
