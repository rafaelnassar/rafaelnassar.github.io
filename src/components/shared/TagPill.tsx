import { type HTMLAttributes } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { standardViewport, tagItem, tagsCascade } from '@/lib/motion'

export type TagPillVariant = 'default' | 'onDark'

interface TagPillProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: TagPillVariant
}

const tagPillClasses = (variant: TagPillVariant = 'default') =>
  cn(
    'px-2.5 py-1 rounded-full text-xs',
    variant === 'onDark' ? 'bg-background/15' : 'bg-secondary'
  )

export const TagPill = ({ className, variant = 'default', ...props }: TagPillProps) => (
  <span className={cn(tagPillClasses(variant), className)} {...props} />
)

interface TagPillListProps {
  tags: string[]
  variant?: TagPillVariant
  className?: string
}

/**
 * Lista de tags com cascade animation. Cada pill entra com 30ms de delay sobre a anterior
 * (subtleza editorial — não chamativo). Animação dispara quando o container entra em viewport.
 */
export const TagPillList = ({ tags, variant = 'default', className }: TagPillListProps) => (
  <motion.div
    initial="hidden"
    whileInView="visible"
    viewport={standardViewport}
    variants={tagsCascade}
    className={cn('flex flex-wrap gap-1.5', className)}
  >
    {tags.map((tag) => (
      <motion.span key={tag} variants={tagItem} className={tagPillClasses(variant)}>
        {tag}
      </motion.span>
    ))}
  </motion.div>
)
