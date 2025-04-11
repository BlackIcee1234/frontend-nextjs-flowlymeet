'use client';
import { cn } from "@/lib/utils"
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { isValidEmail } from "@/lib/utils/user.validation";
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"

export function ResetPasswordForm() {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [message, setMessage] = useState('');
    const supabase = createClient();
  
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError('');
        setMessage('');

        if (!isValidEmail(email)) {
            setEmailError('Por favor, ingresa un correo electrónico válido');
            return;
        }

        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/auth/update-password`,
        });

        if (error) {
            setEmailError('Ha ocurrido un error. Por favor, intenta de nuevo.');
        } else {
            setMessage('Se ha enviado un enlace a tu correo para restablecer tu contraseña.');
        }
    };

    return (
        <div className={cn("flex flex-col gap-6")}>
            <Card className="overflow-hidden">
                <CardContent className="grid p-0 md:grid-cols-2">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center text-center">
                                <h1 className="text-2xl font-bold text-[#7886C7]">
                                    Restablecer contraseña
                                </h1>
                                <p className="text-balance text-muted-foreground">
                                    Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                                </p>
                            </div>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="email">Correo electrónico</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="tu@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={cn(emailError && "border-red-500")}
                                    />
                                    {emailError && (
                                        <p className="text-sm text-red-500">{emailError}</p>
                                    )}
                                </div>
                                {message && (
                                    <p className="text-sm text-green-500">{message}</p>
                                )}
                                <Button type="submit" className="bg-[#7886C7] hover:bg-[#A9B5DF]">
                                    Enviar enlace
                                </Button>
                            </form>
                            <div className="text-center">
                                <Link href="/auth/login" className="text-sm text-[#7886C7] hover:underline">
                                    Volver al inicio de sesión
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="relative hidden bg-muted md:block">
                        <Image
                            src="https://cdn.sanity.io/images/t64y86n0/production/d47fc36ca05580f9998c039ac6ed7e1aeacb8d3b-1018x1080.png"
                            alt="Image"
                            width={509}
                            height={540}
                            className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}