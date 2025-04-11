'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import Image from "next/image"

export function ConfirmAccountForm() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-token'>('loading');
    const searchParams = useSearchParams();
    const supabase = createClient();

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const token_hash = searchParams.get('token_hash');
                console.log(token_hash);
                if (!token_hash) {
                    setStatus('no-token');
                    return;
                }
                const { data }= await supabase.auth.verifyOtp({
                    token_hash: token_hash,
                    type: 'signup',
                });
                console.log(data);
            } catch (error) {
                console.log(error);
                setStatus('error');
            }
        };

        confirmEmail();
    }, [searchParams, supabase]);

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                    {status === 'loading' && (
                        <>
                            <div className="w-16 h-16 relative">
                                <Image 
                                    src="/images/loading.gif" 
                                    alt="Loading" 
                                    width={64} 
                                    height={64}
                                    className="rounded-full"
                                />
                            </div>
                            <h2 className="text-xl font-semibold">Verificando tu cuenta...</h2>
                            <p className="text-sm text-muted-foreground text-center">
                                Por favor, espera mientras verificamos tu cuenta.
                            </p>
                        </>
                    )}
                    
                    {status === 'success' && (
                        <>
                            <div className="w-16 h-16 relative">
                                <Image 
                                    src="/images/success.png" 
                                    alt="Success" 
                                    width={64} 
                                    height={64}
                                    className="rounded-full"
                                />
                            </div>
                            <h2 className="text-xl font-semibold">¡Cuenta verificada!</h2>
                            <p className="text-sm text-muted-foreground text-center">
                                Tu cuenta ha sido verificada correctamente. Ahora puedes iniciar sesión.
                            </p>
                            <Button asChild className="w-full">
                                <Link href="/auth/login">Iniciar sesión</Link>
                            </Button>
                        </>
                    )}
                    
                    {status === 'error' && (
                        <>
                            <div className="w-16 h-16 relative">
                                <Image 
                                    src="/images/error.png" 
                                    alt="Error" 
                                    width={64} 
                                    height={64}
                                    className="rounded-full"
                                />
                            </div>
                            <h2 className="text-xl font-semibold">Error al verificar</h2>
                            <p className="text-sm text-muted-foreground text-center">
                                Ha ocurrido un error al verificar tu cuenta. Por favor, intenta de nuevo.
                            </p>
                            <Button asChild className="w-full">
                                <Link href="/auth/login">Volver al inicio de sesión</Link>
                            </Button>
                        </>
                    )}
                    
                    {status === 'no-token' && (
                        <>
                            <div className="w-16 h-16 relative">
                                <Image 
                                    src="/images/warning.png" 
                                    alt="Warning" 
                                    width={64} 
                                    height={64}
                                    className="rounded-full"
                                />
                            </div>
                            <h2 className="text-xl font-semibold">Token no encontrado</h2>
                            <p className="text-sm text-muted-foreground text-center">
                                No se encontró el token de verificación. Por favor, verifica el enlace o solicita uno nuevo.
                            </p>
                            <Button asChild className="w-full">
                                <Link href="/auth/login">Volver al inicio de sesión</Link>
                            </Button>
                        </>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}