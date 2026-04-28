import { cn } from '@/lib/utils'

export type CardVariant = 'default' | 'featured'

const cardBase = 'p-5 sm:p-6 rounded-2xl border transition-all duration-300'
const cardVariants: Record<CardVariant, string> = {
  default: 'bg-card border-border hover:border-foreground/20 hover:shadow-md',
  featured: 'bg-foreground text-background border-foreground hover:shadow-lg',
}

export const cardClassName = (variant: CardVariant = 'default') =>
  cn(cardBase, cardVariants[variant])
