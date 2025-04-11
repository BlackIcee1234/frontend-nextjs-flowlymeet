import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

export default function HeroSection() {
    return (
      <section className="relative py-20 bg-gradient-to-b from-[#7886C7]/10 to-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[#7886C7]">
              Simplifica tus reuniones con FlowlyMeet
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              La plataforma que transforma la forma en que tu equipo se reúne y colabora
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/signup">
                <Button size="lg" className="bg-[#7886C7] hover:bg-[#7886C7]/90">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    )
}