import { Card, CardContent } from "@/components/ui/card"
import { Clock, Zap } from "lucide-react"

export default function BenefitsSection() {
    return (
        <section className="py-20 bg-[#7886C7]/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Beneficios de FlowlyMeet</h2>
            <p className="text-xl text-muted-foreground">
              Descubre cómo podemos mejorar la productividad de tu equipo
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#7886C7]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-[#7886C7]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Ahorra tiempo</h3>
                    <p className="text-muted-foreground">
                      Reduce el tiempo dedicado a la organización de reuniones y enfócate en lo importante
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#7886C7]/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Zap className="h-6 w-6 text-[#7886C7]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Mayor productividad</h3>
                    <p className="text-muted-foreground">
                      Optimiza el tiempo de tu equipo con reuniones más efectivas y organizadas
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
}