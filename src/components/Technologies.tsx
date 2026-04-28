import { Cloud, Database, Layout, Server, Smartphone, type LucideIcon } from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Card } from '@/components/shared/Card'
import { TagPillList } from '@/components/shared/TagPill'
import { IconBadge } from '@/components/shared/IconBadge'
import { stack, type TechCategory } from '@/data/technologies'

/*
 * Mapa nome-da-categoria → ícone Lucide. Mantido aqui (no componente) porque
 * funções não serializam bem em "data files" puros. A data em src/data/
 * exporta o `iconName` como string e este mapa resolve para o componente.
 */
const iconMap: Record<TechCategory['iconName'], LucideIcon> = {
  Server,
  Layout,
  Smartphone,
  Database,
  Cloud,
}

export const Technologies = () => {
  return (
    <section id="tecnologias" aria-labelledby="tecnologias-title" className="py-20 sm:py-24">
      <div className="container mx-auto px-6">
        <SectionHeading
          id="tecnologias-title"
          title="Stack"
          italic="técnica"
          subtitle="Ferramentas que uso no dia a dia para entregar do legado ao moderno"
        />

        <div className="max-w-3xl mx-auto grid gap-4">
          {stack.map((category, index) => (
            <Reveal key={category.category} delay={index * 0.05}>
              <Card>
                <div className="flex items-start gap-4">
                  <IconBadge icon={iconMap[category.iconName]} />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-base sm:text-lg">{category.category}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
                      {category.description}
                    </p>

                    <TagPillList tags={category.items} className="mt-3" />
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
