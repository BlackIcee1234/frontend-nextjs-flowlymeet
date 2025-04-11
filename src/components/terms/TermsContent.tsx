"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function TermsContent() {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="border-0 shadow-none">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-[#7886C7] text-center">
              Términos y Condiciones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold mb-4">1. Aceptación de los Términos</h2>
              <p className="text-muted-foreground">
                Al acceder y utilizar FlowlyMeet, aceptas cumplir y estar sujeto a estos términos y condiciones. Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar nuestro servicio.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">2. Uso del Servicio</h2>
              <p className="text-muted-foreground">
                FlowlyMeet es una plataforma diseñada para facilitar reuniones virtuales. Los usuarios son responsables de:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-2">
                <li>Proporcionar información precisa y actualizada</li>
                <li>Mantener la confidencialidad de sus credenciales</li>
                <li>Respetar los derechos de otros usuarios</li>
                <li>No utilizar el servicio para actividades ilegales o no autorizadas</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">3. Privacidad y Datos</h2>
              <p className="text-muted-foreground">
                Nos comprometemos a proteger tu privacidad. Los datos personales que recopilamos se utilizan únicamente para proporcionar y mejorar nuestros servicios. Consulta nuestra Política de Privacidad para más detalles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">4. Responsabilidades del Usuario</h2>
              <p className="text-muted-foreground">
                Como usuario de FlowlyMeet, te comprometes a:
              </p>
              <ul className="list-disc pl-6 mt-2 text-muted-foreground space-y-2">
                <li>No compartir contenido inapropiado o ilegal</li>
                <li>No interrumpir el funcionamiento normal del servicio</li>
                <li>No intentar acceder a cuentas o datos de otros usuarios</li>
                <li>Reportar cualquier actividad sospechosa o violación de estos términos</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">5. Modificaciones</h2>
              <p className="text-muted-foreground">
                Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entrarán en vigor inmediatamente después de su publicación en la plataforma. El uso continuado del servicio después de dichos cambios constituye tu aceptación de los nuevos términos.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">6. Limitación de Responsabilidad</h2>
              <p className="text-muted-foreground">
                FlowlyMeet no será responsable por daños indirectos, incidentales, especiales, consecuentes o punitivos, o cualquier pérdida de beneficios o ingresos, ya sea incurrida directamente o indirectamente, o cualquier pérdida de datos, uso, buena voluntad u otras pérdidas intangibles.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold mb-4">7. Contacto</h2>
              <p className="text-muted-foreground">
                Si tienes alguna pregunta sobre estos términos y condiciones, por favor contáctanos a través de nuestro formulario de contacto o envíanos un correo electrónico a support@flowlymeet.com
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 