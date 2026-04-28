import type { Variants } from 'framer-motion'

export const easings = {
  smooth: [0.16, 1, 0.3, 1] as const,
  swift: [0.4, 0, 0.2, 1] as const,
  premium: [0.22, 1, 0.36, 1] as const,
} as const

export const springs = {
  gentle: { type: 'spring', stiffness: 220, damping: 28 } as const,
  snappy: { type: 'spring', stiffness: 300, damping: 30 } as const,
  soft: { type: 'spring', stiffness: 180, damping: 22, mass: 0.8 } as const,
} as const

export const durations = {
  micro: 0.2,
  short: 0.3,
  medium: 0.4,
  long: 0.5,
  xlong: 0.7,
} as const

export const standardViewport = { once: true, margin: '-50px' } as const

/**
 * Single source of truth para o offset Y das entradas Reveal.
 * Reveal.tsx e fadeUp/fadeUpSmall consomem daqui, evitando drift.
 */
export const revealOffsetY = 20
export const revealOffsetYSmall = 12

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: revealOffsetY },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.medium, ease: easings.smooth },
  },
}

export const fadeUpSmall: Variants = {
  hidden: { opacity: 0, y: revealOffsetYSmall },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.long, ease: easings.smooth },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: durations.long, ease: easings.smooth },
  },
}

export const stagger = (delayChildren = 0.05, staggerChildren = 0.05): Variants => ({
  hidden: {},
  visible: {
    transition: { delayChildren, staggerChildren },
  },
})

/**
 * Stagger pré-pronto para cascatas de tags (ex: TagPill em Projects/Experience).
 * Mais ágil que o stagger padrão de seção: começa rápido (40ms) e cascateia em 30ms.
 */
export const tagsCascade: Variants = stagger(0.04, 0.03)

export const tagItem: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durations.short, ease: easings.smooth },
  },
}
