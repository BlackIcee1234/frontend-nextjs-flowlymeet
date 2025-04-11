'use client';
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isValidEmail, isValidPassword } from "@/lib/utils/user.validation";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image";

export function SignUpForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const router = useRouter();
    const supabase = createClient();
  
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
        const { data: response, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
            emailRedirectTo: `${window.location.origin}/auth/confirm`,
            },
        });
        console.log(response);
        console.log(error);
        if (error) {
            setPasswordError('Credenciales incorrectas. Por favor, verifica tus datos.');
        } else if (response) {
          console.log(response);
          router.push('/auth/confirm-account');
        }
    };

  return (
    <div className={cn("flex flex-col gap-6")}>
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold text-[#7886C7]">¡Bienvenido!</h1>
                <p className="text-balance text-muted-foreground">
                    Crea tu cuenta en FlowlyMeet
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
                Crear cuenta
              </Button>
              <div className="text-center text-sm text-[#7886C7]">
                ¿Ya tienes una cuenta?{" "}
                <Link href="/auth/login" className="underline underline-offset-4">
                    Inicia sesión
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
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
        Al crear una cuenta, aceptas nuestros <a href="/terms">Términos de Servicio</a>{" "}
        y nuestra <a href="/privacy">Política de Privacidad</a>.
      </div>
    </div>
  );
}
