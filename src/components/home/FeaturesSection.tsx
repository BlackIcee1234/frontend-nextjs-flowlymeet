import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Users, CheckCircle2 } from "lucide-react"

export default function FeaturesSection() {
    return (
        <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">¿Cómo funciona FlowlyMeet?</h2>
            <p className="text-xl text-muted-foreground">
              Simplifica la gestión de reuniones en tres sencillos pasos
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-2 border-[#7886C7]/20">
              <CardHeader>
                <div className="w-12 h-12 bg-[#7886C7]/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-[#7886C7]" />
                </div>
                <CardTitle>1. Crea tu reunión</CardTitle>
                <CardDescription>
                  Programa reuniones en segundos con nuestra interfaz intuitiva
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 border-[#7886C7]/20">
              <CardHeader>
                <div className="w-12 h-12 bg-[#7886C7]/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-[#7886C7]" />
                </div>
                <CardTitle>2. Invita a tu equipo</CardTitle>
                <CardDescription>
                  Comparte el enlace con los participantes y gestiona las confirmaciones
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2 border-[#7886C7]/20">
              <CardHeader>
                <div className="w-12 h-12 bg-[#7886C7]/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-[#7886C7]" />
                </div>
                <CardTitle>3. Celebra la reunión</CardTitle>
                <CardDescription>
                  Conéctate, colabora y haz seguimiento de los acuerdos
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    )
}