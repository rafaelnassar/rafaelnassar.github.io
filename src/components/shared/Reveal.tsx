import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion'
import { type ReactNode } from 'react'
import { durations, easings, revealOffsetY, standardViewport } from '@/lib/motion'

type RevealTag = 'div' | 'article' | 'section' | 'header' | 'span' | 'li' | 'ul' | 'p'

type RevealProps<T extends RevealTag = 'div'> = {
  children?: ReactNode
  delay?: number
  as?: T
  className?: string
} & Omit<HTMLMotionProps<T>, 'initial' | 'whileInView' | 'viewport' | 'variants'>

export const Reveal = ({
  children,
  delay = 0,
  as = 'div',
  className,
  transition,
  ...rest
}: RevealProps) => {
  const reduceMotion = useReducedMotion()
  const Tag = motion[as] as typeof motion.div
  return (
    <Tag
      initial={reduceMotion ? false : { opacity: 0, y: revealOffsetY }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={standardViewport}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { duration: durations.medium, ease: easings.smooth, delay, ...transition }
      }
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  )
}
