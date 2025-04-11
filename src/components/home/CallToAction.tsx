import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
export default function CallToAction() {
    return (
        <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-[#7886C7]/10 border-0">
            <CardContent className="py-16">
              <div className="max-w-2xl mx-auto text-center">
                <h2 className="text-3xl font-bold mb-4">¿Listo para transformar tus reuniones?</h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Únete a FlowlyMeet hoy y descubre una nueva forma de gestionar tus reuniones
                </p>
                <Link href="/auth/signup">
                  <Button size="lg" className="bg-[#7886C7] hover:bg-[#7886C7]/90">
                    Comenzar Gratis
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    )
}