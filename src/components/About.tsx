import { motion } from 'framer-motion'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { durations, easings, stagger, standardViewport } from '@/lib/motion'
import { useLang } from '@/lib/i18n'
import { t } from '@/data/translations'

const statsParent = stagger(0.1, 0.06)

export const About = () => {
  const { lang } = useLang()
  const tx = t(lang)

  // Stats: o terceiro slot foi reposicionado de "23+ tecnologias" (vaidade,
  // contagem de stack pouco verificável) para "5+ anos com emissão fiscal" —
  // métrica concreta que sustenta o pitch de especialização do Hero.
  const stats = [
    { value: '7+', label: tx.about.statYears },
    { value: '20+', label: tx.about.statProjects },
    { value: '5+', label: tx.about.statTechs },
  ]

  return (
    <section id="sobre" aria-labelledby="sobre-title" className="py-20 sm:py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <SectionHeading
            id="sobre-title"
            title={tx.about.title}
            italic={tx.about.italic}
            subtitle={tx.about.subtitle}
          />

          <Reveal
            delay={0.05}
            className="space-y-5 text-muted-foreground text-sm sm:text-base leading-relaxed text-center"
          >
            <p>{tx.about.p1}</p>
            <p>{tx.about.p2}</p>
          </Reveal>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={standardViewport}
            variants={statsParent}
            className="flex flex-wrap justify-center gap-x-8 gap-y-6 sm:gap-x-12 md:gap-x-16 mt-12 sm:mt-16"
          >
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, scale: 0.92 },
                  visible: { opacity: 1, scale: 1 },
                }}
                transition={{ duration: durations.medium, ease: easings.smooth }}
                className="text-center"
              >
                <div className="text-2xl sm:text-3xl font-medium mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
