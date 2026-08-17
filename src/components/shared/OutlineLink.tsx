import { forwardRef, type AnchorHTMLAttributes } from 'react'
import { cn, focusRing } from '@/lib/utils'

export type OutlineLinkSize = 'sm' | 'md'
export type OutlineLinkTone = 'default' | 'onDark'

interface OutlineLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: OutlineLinkSize
  tone?: OutlineLinkTone
}

const sizeClasses: Record<OutlineLinkSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
}

const toneClasses: Record<OutlineLinkTone, string> = {
  default: 'border border-border hover:border-foreground/30 hover:bg-secondary',
  onDark: 'bg-background/20 hover:bg-background/30 border border-background/30',
}

export const OutlineLink = forwardRef<HTMLAnchorElement, OutlineLinkProps>(
  ({ className, size = 'md', tone = 'default', ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        'inline-flex items-center gap-2 rounded-full font-medium transition-all duration-200',
        focusRing,
        sizeClasses[size],
        toneClasses[tone],
        className
      )}
      {...props}
    />
  )
)
OutlineLink.displayName = 'OutlineLink'
