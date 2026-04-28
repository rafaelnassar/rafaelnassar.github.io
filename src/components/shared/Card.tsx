import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { cardClassName, type CardVariant } from './cardStyles'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardClassName(variant), className)} {...props} />
  )
)
Card.displayName = 'Card'
