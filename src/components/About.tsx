import { motion } from 'framer-motion'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { durations, easings, stagger, standardViewport } from '@/lib/motion'

const stats = [
  { value: '7+', label: 'Anos de experiência' },
  { value: '20+', label: 'Projetos entregues' },
  { value: '23+', label: 'Tecnologias' },
]

const statsParent = stagger(0.1, 0.06)

export const About = () => {
  return (
    <section id="sobre" aria-labelledby="sobre-title" className="py-20 sm:py-24 bg-secondary/30">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <SectionHeading
            id="sobre-title"
            title="Sobre"
            italic="mim"
            subtitle="Um pouco da minha história e jornada"
          />

          <Reveal
            delay={0.05}
            className="space-y-5 text-muted-foreground text-sm sm:text-base leading-relaxed text-center"
          >
            <p>
              Desde 2019 construo apps que resolvem problemas reais — força de
              venda, controle financeiro, emissão fiscal, dashboards internos,
              SaaS, automações e integrações com sistemas corporativos.
            </p>
            <p>
              Trabalho do zero ao legado: do Delphi aos stacks modernos em React,
              Next.js e React Native. APIs em Node.js, AdonisJS e PHP/Laravel, com
              infraestrutura Linux e Windows Server — do básico ao avançado.
            </p>
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
