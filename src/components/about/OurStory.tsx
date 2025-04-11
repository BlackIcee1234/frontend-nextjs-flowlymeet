import { Separator } from "@/components/ui/separator"

interface OurStoryProps {
  title?: string
  description: string
}

export function OurStory({ 
  title = "Our Story", 
  description 
}: OurStoryProps) {
  return (
    <>
      <Separator className="my-12" />
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4 text-[#7886C7]">{title}</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          {description}
        </p>
      </div>
    </>
  )
} 