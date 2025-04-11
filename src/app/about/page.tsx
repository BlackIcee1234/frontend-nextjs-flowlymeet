import { TeamGrid } from "@/components/about/TeamGrid"
import { OurStory } from "@/components/about/OurStory"

const teamMembers = [
  {
    name: "Axel Andree Pérez Reyes",
    role: "Software Engineer",
    description: "Full Stack Developer",
    imageSrc: "/images/axel.jpeg",
    socialLinks: {
      github: "https://github.com/BlackIcee1234",
      linkedin: "https://www.linkedin.com/in/axel-andree/",
    }
  },
  {
    name: "Luis Armando Godinez Contreras",
    role: "Software Engineer",
    description: "Full Stack Developer",
    imageSrc: "/images/luis.jpeg",
    socialLinks: {
      github: "https://github.com/imluisdev",
      linkedin: "https://www.linkedin.com/in/luis-god%C3%ADnez/",
    }
  }
]

const ourStory = {
  title: "Nuestro equipo",
  description: "Somos un equipo de dos ingenieros que aman la tecnologia y la innovacion. Nuestro objetivo es crear soluciones tecnologicas que ayuden a las personas."
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-12 text-[#7886C7]">Nuestro equipo</h1>
        <TeamGrid teamMembers={teamMembers} />
        <OurStory {...ourStory} />
      </div>
    </div>
  )
}
