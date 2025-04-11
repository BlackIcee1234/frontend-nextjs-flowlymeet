import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Twitter, Instagram } from "lucide-react"

interface TeamMemberCardProps {
  name: string
  role: string
  description: string
  imageSrc: string
  socialLinks?: {
    github?: string
    linkedin?: string
    twitter?: string
    instagram?: string
  }
}

export function TeamMemberCard({
  name,
  role,
  description,
  imageSrc,
  socialLinks = {}
}: TeamMemberCardProps) {
  return (
    <Card className="p-6">
      <CardContent className="flex flex-col items-center text-center">
        <Avatar className="w-32 h-32 mb-6">
          <AvatarImage src={imageSrc} alt={name} />
          <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <h2 className="text-2xl font-semibold mb-2">{name}</h2>
        <p className="text-muted-foreground mb-4">{role}</p>
        <p className="text-sm text-muted-foreground mb-6">{description}</p>
        <div className="flex gap-4">
          {socialLinks.github && (
            <Button variant="ghost" size="icon" asChild>
              <a href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
              </a>
            </Button>
          )}
          {socialLinks.linkedin && (
            <Button variant="ghost" size="icon" asChild>
              <a href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-5 w-5" />
              </a>
            </Button>
          )}
          {socialLinks.twitter && (
            <Button variant="ghost" size="icon" asChild>
              <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                <Twitter className="h-5 w-5" />
              </a>
            </Button>
          )}
          {socialLinks.instagram && (
            <Button variant="ghost" size="icon" asChild>
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 