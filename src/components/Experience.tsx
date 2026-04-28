import { Reveal } from '@/components/shared/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Card } from '@/components/shared/Card'
import { TagPillList } from '@/components/shared/TagPill'
import { experiences } from '@/data/experience'

export const Experience = () => {
  return (
    <section
      id="experiencia"
      aria-labelledby="experiencia-title"
      className="py-20 sm:py-24 bg-secondary/30"
    >
      <div className="container mx-auto px-6">
        <SectionHeading
          id="experiencia-title"
          title="Experiência"
          italic="profissional"
          subtitle="Minha trajetória e áreas de atuação"
        />

        <div className="max-w-3xl mx-auto space-y-4">
          {experiences.map((item, index) => (
            <Reveal key={`${item.title}-${item.period}`} delay={index * 0.05}>
              <Card>
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                  <h3 className="font-medium text-base sm:text-lg">{item.title}</h3>
                  <span aria-hidden className="hidden sm:block text-muted-foreground/40">·</span>
                  <span className="text-sm text-muted-foreground">{item.company}</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs text-muted-foreground">{item.period}</span>
                  <span aria-hidden className="text-muted-foreground/40">·</span>
                  <span className="text-xs text-muted-foreground">{item.location}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                <TagPillList tags={item.tags} />
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
