import { cn } from '@/lib/utils'

export type SectionTone = 'plain' | 'muted'

/**
 * Ritmo vertical + faixa de fundo compartilhados por todas as seções.
 * Alternar `muted` / `plain` evita blocos consecutivos iguais.
 */
export const sectionClassName = (tone: SectionTone = 'plain') =>
  cn('py-20 sm:py-24', tone === 'muted' && 'bg-secondary/30')

/** Largura do conteúdo de listas/cards (Experience, Projects, etc.). */
export const sectionContentClassName = 'max-w-3xl mx-auto'

/** Largura do conteúdo editorial (About, Contact, Hero copy). */
export const sectionProseClassName = 'max-w-2xl mx-auto'
