import { ExternalLink, Github, ArrowUpRight, Lock } from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Card } from '@/components/shared/Card'
import { TagPill, TagPillList } from '@/components/shared/TagPill'
import { OutlineLink } from '@/components/shared/OutlineLink'
import { Button } from '@/components/ui/button'
import { sectionClassName, sectionContentClassName } from '@/components/shared/sectionStyles'
import { cn } from '@/lib/utils'
import { projects } from '@/data/projects'
import { useLang } from '@/lib/i18n'
import { t } from '@/data/translations'

export const Projects = () => {
  const { lang } = useLang()
  const tx = t(lang)

  return (
    <section id="projetos" aria-labelledby="projetos-title" className={sectionClassName('muted')}>
      <div className="container mx-auto px-6">
        <SectionHeading
          id="projetos-title"
          title={tx.projects.title}
          italic={tx.projects.italic}
          subtitle={tx.projects.subtitle}
        />

        <div className={cn(sectionContentClassName, 'space-y-4')}>
          {projects.map((project, index) => (
            <Reveal as="article" key={project.title} delay={index * 0.05}>
              <Card variant={project.featured ? 'featured' : 'default'} className="group">
                <div className="flex flex-col gap-4">
                  {/*
                    Preview opcional (especialmente útil pros NDA — uma imagem
                    censurada já vira evidência visível pro recrutador). Aspect
                    ratio fixo 16:9 evita layout shift enquanto a imagem carrega.
                    Lazy loading + dimensões explícitas no schema preservam CWV.
                  */}
                  {project.image && (
                    <div
                      className={cn(
                        'aspect-video w-full overflow-hidden rounded-lg bg-secondary/40',
                        project.featured ? 'border border-background/20' : 'border border-border/60'
                      )}
                    >
                      <img
                        src={project.image.src}
                        alt={project.image.alt[lang]}
                        loading="lazy"
                        width={1280}
                        height={720}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-medium text-base sm:text-lg">{project.title}</h3>
                      {project.status && (
                        <TagPill variant={project.featured ? 'onDark' : 'default'}>
                          {project.status[lang]}
                        </TagPill>
                      )}
                    </div>
                    <p
                      className={cn(
                        'text-sm sm:text-base leading-relaxed',
                        project.featured ? 'opacity-80' : 'text-muted-foreground'
                      )}
                    >
                      {project.description[lang]}
                    </p>
                  </div>

                  <TagPillList
                    tags={project.technologies}
                    variant={project.featured ? 'onDark' : 'default'}
                  />

                  {project.internal ? (
                    <div
                      className={cn(
                        'flex items-center gap-2 pt-2 text-xs',
                        project.featured ? 'opacity-70' : 'text-muted-foreground'
                      )}
                    >
                      <Lock aria-hidden className="w-3.5 h-3.5" />
                      {tx.projects.internal}
                    </div>
                  ) : project.githubUrl || project.liveUrl ? (
                    <div className="flex flex-wrap items-center gap-2 pt-2">
                      {project.githubUrl && (
                        <Button
                          size="sm"
                          asChild
                          variant={project.featured ? 'default' : 'secondary'}
                          className={
                            project.featured
                              ? 'bg-background text-foreground hover:bg-background/90'
                              : 'hover:bg-foreground hover:text-background'
                          }
                        >
                          <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${tx.projects.codeAria} ${project.title} ${tx.projects.codeAriaSuffix}`}
                          >
                            <Github aria-hidden />
                            {tx.projects.code}
                          </a>
                        </Button>
                      )}
                      {project.liveUrl && (
                        <OutlineLink
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          size="sm"
                          tone={project.featured ? 'onDark' : 'default'}
                          className="text-sm"
                          aria-label={`${tx.projects.liveAria} ${project.title} ${tx.projects.liveAriaSuffix}`}
                        >
                          <ExternalLink className="w-4 h-4" aria-hidden />
                          {tx.projects.seeLive}
                        </OutlineLink>
                      )}
                    </div>
                  ) : null}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15} className="text-center mt-10">
          <OutlineLink
            href="https://github.com/rafaelnassar"
            target="_blank"
            rel="noopener noreferrer"
          >
            {tx.projects.seeAll}
            <ArrowUpRight className="w-4 h-4" aria-hidden />
          </OutlineLink>
        </Reveal>
      </div>
    </section>
  )
}
