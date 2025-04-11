"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PrivacyContent() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-[#7886C7] text-center">
              Política de Privacidad
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Introducción</h2>
              <p className="text-muted-foreground">
                En FlowlyMeet, nos tomamos muy en serio tu privacidad. Esta política describe cómo recopilamos, usamos y protegemos tu información personal cuando utilizas nuestra plataforma de reuniones virtuales.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Información que Recopilamos</h2>
              <p className="text-muted-foreground">
                Recopilamos la siguiente información:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-2">
                <li>Información de registro (nombre, correo electrónico)</li>
                <li>Datos de uso de la plataforma</li>
                <li>Información de las reuniones (título, descripción, participantes)</li>
                <li>Datos técnicos (dirección IP, tipo de navegador, dispositivo)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. Uso de la Información</h2>
              <p className="text-muted-foreground">
                Utilizamos tu información para:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-2">
                <li>Proporcionar y mejorar nuestros servicios</li>
                <li>Personalizar tu experiencia</li>
                <li>Comunicarnos contigo sobre actualizaciones y cambios</li>
                <li>Garantizar la seguridad de la plataforma</li>
                <li>Cumplir con obligaciones legales</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Compartir Información</h2>
              <p className="text-muted-foreground">
                No vendemos ni alquilamos tu información personal. Podemos compartir tu información con:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-2">
                <li>Proveedores de servicios que nos ayudan a operar la plataforma</li>
                <li>Otros participantes en las reuniones que organizas o a las que te unes</li>
                <li>Autoridades cuando sea requerido por ley</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Seguridad de los Datos</h2>
              <p className="text-muted-foreground">
                Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra accesos no autorizados, alteración, divulgación o destrucción.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Tus Derechos</h2>
              <p className="text-muted-foreground">
                Tienes derecho a:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-2">
                <li>Acceder a tus datos personales</li>
                <li>Corregir información inexacta</li>
                <li>Solicitar la eliminación de tus datos</li>
                <li>Retirar tu consentimiento</li>
                <li>Presentar una queja ante la autoridad de protección de datos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Cookies y Tecnologías Similares</h2>
              <p className="text-muted-foreground">
                Utilizamos cookies y tecnologías similares para mejorar tu experiencia, analizar el uso de la plataforma y personalizar el contenido. Puedes controlar el uso de cookies a través de la configuración de tu navegador.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">8. Cambios en la Política</h2>
              <p className="text-muted-foreground">
                Podemos actualizar esta política ocasionalmente. Te notificaremos sobre cambios significativos a través de la plataforma o por correo electrónico.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">9. Contacto</h2>
              <p className="text-muted-foreground">
                Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos tus datos, contáctanos en:
                <br />
                <a href="mailto:privacy@flowlymeet.com" className="text-[#7886C7] hover:underline">
                  privacy@flowlymeet.com
                </a>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 