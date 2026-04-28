import Autoplay from 'embla-carousel-autoplay'
import useEmblaCarousel from 'embla-carousel-react'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Card } from '@/components/shared/Card'
import { TagPillList } from '@/components/shared/TagPill'
import { OutlineLink } from '@/components/shared/OutlineLink'
import { iconButtonClassName } from '@/components/shared/iconButtonStyles'
import { cn, focusRing } from '@/lib/utils'
import { clients } from '@/data/clients'

export const Clients = () => {
  const sectionRef = useRef<HTMLElement>(null)
  // Pausa autoplay quando seção sai de viewport (economia de timer + sem rebobinar enquanto fora da tela)
  const isInView = useInView(sectionRef, { margin: '-30% 0px' })

  const autoplayRef = useRef(
    Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })
  )

  const hasMultiple = clients.length > 1

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: hasMultiple,
      align: 'center',
      skipSnaps: false,
      dragFree: false,
      containScroll: false,
      active: hasMultiple,
    },
    hasMultiple ? [autoplayRef.current] : []
  )

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    const onReInit = () => {
      setScrollSnaps(emblaApi.scrollSnapList())
      onSelect()
    }

    setScrollSnaps(emblaApi.scrollSnapList())
    onSelect()

    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onReInit)

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onReInit)
    }
  }, [emblaApi])

  // Pause/resume autoplay com base no viewport
  useEffect(() => {
    if (!emblaApi || !hasMultiple) return
    const autoplay = emblaApi.plugins().autoplay
    if (!autoplay) return
    if (isInView) autoplay.play()
    else autoplay.stop()
  }, [isInView, emblaApi, hasMultiple])

  return (
    <section
      id="clientes"
      ref={sectionRef}
      aria-labelledby="clientes-title"
      className="py-20 sm:py-24 bg-secondary/30"
    >
      <div className="container mx-auto px-6">
        <SectionHeading
          id="clientes-title"
          title="Clientes"
          italic="& parceiros"
          subtitle="Empresas que confiaram seus sites institucionais a mim"
        />

        <div className="max-w-3xl mx-auto relative">
          {hasMultiple && (
            <>
              <button
                type="button"
                onClick={scrollPrev}
                className={cn(
                  iconButtonClassName('outline', 'md'),
                  'absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-6 z-10 bg-background shadow-sm'
                )}
                aria-label="Cliente anterior"
              >
                <ChevronLeft className="w-4 h-4" aria-hidden />
              </button>

              <button
                type="button"
                onClick={scrollNext}
                className={cn(
                  iconButtonClassName('outline', 'md'),
                  'absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-6 z-10 bg-background shadow-sm'
                )}
                aria-label="Próximo cliente"
              >
                <ChevronRight className="w-4 h-4" aria-hidden />
              </button>
            </>
          )}

          <div className="overflow-hidden" ref={emblaRef}>
            <div className={hasMultiple ? 'flex touch-pan-y' : 'flex justify-center touch-pan-y'}>
              {clients.map((client, index) => (
                <div
                  key={client.name}
                  // `flex` no slide ativa align-items: stretch → todos os filhos
                  // (Reveal/Card) esticam à altura do maior, igualando os cards
                  // do carrossel mesmo com descrições de tamanhos diferentes.
                  className={cn(
                    'flex',
                    hasMultiple
                      ? 'flex-[0_0_80%] sm:flex-[0_0_70%] min-w-0 px-2'
                      : 'w-full sm:max-w-xl px-2'
                  )}
                >
                  <Reveal delay={index * 0.05} className="w-full h-full">
                    <Card className="h-full flex flex-col">
                      <div className="flex flex-col gap-4 h-full">
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            {client.logo ? (
                              <img
                                src={client.logo}
                                alt={`Logo ${client.name}`}
                                loading="lazy"
                                width={56}
                                height={56}
                                className="w-14 h-14 object-contain rounded-lg"
                              />
                            ) : (
                              <span
                                aria-hidden
                                className="w-14 h-14 rounded-lg bg-secondary flex items-center justify-center text-xl font-medium"
                              >
                                {client.name.charAt(0)}
                              </span>
                            )}
                            <h3 className="font-medium text-base sm:text-lg">{client.name}</h3>
                          </div>
                          {client.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {client.description}
                            </p>
                          )}
                        </div>

                        {client.technologies && client.technologies.length > 0 && (
                          <TagPillList tags={client.technologies} />
                        )}

                        {client.url && (
                          <OutlineLink
                            href={`https://${client.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="sm"
                            // `mt-auto` empurra o CTA pro fundo do card → quando
                            // o card estica (descrição menor), o link permanece
                            // alinhado na base, mantendo grid visual uniforme.
                            className="self-start mt-auto"
                          >
                            Ver projeto
                            <ArrowUpRight className="w-3.5 h-3.5" aria-hidden />
                          </OutlineLink>
                        )}
                      </div>
                    </Card>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>

          {hasMultiple && (
            // gap-0 + p-2 nos buttons resultam em 24x24px de touch target
            // (WCAG 2.5.5) com 16px de "ar" visual entre dots — visualmente
            // similar ao gap-2 anterior, mas com área tap acessível.
            <div className="flex items-center justify-center gap-0 mt-8">
              {scrollSnaps.map((_, index) => (
                <button
                  type="button"
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={cn('p-2 group rounded-full', focusRing)}
                  aria-label={`Ir para cliente ${index + 1}`}
                  aria-current={index === selectedIndex}
                >
                  <span
                    aria-hidden
                    className={cn(
                      'block h-2 rounded-full transition-all duration-300',
                      index === selectedIndex
                        ? 'bg-foreground w-6'
                        : 'bg-border group-hover:bg-muted-foreground w-2'
                    )}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
