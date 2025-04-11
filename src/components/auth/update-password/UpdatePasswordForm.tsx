'use client';
import { cn } from "@/lib/utils"
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"

export function UpdatePasswordForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setError('Ha ocurrido un error. Por favor, intenta de nuevo.');
        } else {
            setMessage('Tu contraseña ha sido actualizada correctamente.');
            setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
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
                                    Actualizar contraseña
                                </h1>
                                <p className="text-balance text-muted-foreground">
                                    Ingresa tu nueva contraseña
                                </p>
                            </div>
                            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="password">Nueva contraseña</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="********"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={cn(error && "border-red-500")}
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        placeholder="********"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={cn(error && "border-red-500")}
                                    />
                                </div>
                                {error && (
                                    <p className="text-sm text-red-500">{error}</p>
                                )}
                                {message && (
                                    <p className="text-sm text-green-500">{message}</p>
                                )}
                                <Button type="submit" className="bg-[#7886C7] hover:bg-[#A9B5DF]">
                                    Actualizar contraseña
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