import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#7886C7]">FlowlyMeet</h3>
            <p className="text-sm text-muted-foreground">
              Simplificando la gestión de reuniones para equipos más productivos.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://github.com/BlackIcee1234" target="_blank" rel="noopener noreferrer">
                  <Github className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="https://www.linkedin.com/in/axel-andree/" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="mailto:andreereyes0@gmail.com" target="_blank" rel="noopener noreferrer">
                  <Mail className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#7886C7]">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-[#7886C7] transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-[#7886C7] transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#7886C7]">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-[#7886C7] transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-[#7886C7] transition-colors">
                  Términos y Condiciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#7886C7]">Contacto</h3>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                andreereyes0@gmail.com
              </li>
              <li className="text-sm text-muted-foreground">
                luisarmandogod2001@gmail.com
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} FlowlyMeet. Todos los derechos reservados.
          </p>
          <div className="flex space-x-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-[#7886C7] transition-colors">
              Privacidad
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-[#7886C7] transition-colors">
              Términos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
} 