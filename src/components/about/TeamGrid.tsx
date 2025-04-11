import { TeamMemberCard } from "./TeamMemberCard"

interface TeamMember {
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

interface TeamGridProps {
  teamMembers: TeamMember[]
}

export function TeamGrid({ teamMembers }: TeamGridProps) {
  return (
    <div className="grid md:grid-cols-2 gap-12">
      {teamMembers.map((member, index) => (
        <TeamMemberCard
          key={index}
          name={member.name}
          role={member.role}
          description={member.description}
          imageSrc={member.imageSrc}
          socialLinks={member.socialLinks}
        />
      ))}
    </div>
  )
} 