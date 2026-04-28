import { forwardRef, type AnchorHTMLAttributes } from 'react'
import { cn, focusRing } from '@/lib/utils'

export type OutlineLinkSize = 'sm' | 'md'

interface OutlineLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  size?: OutlineLinkSize
}

const sizeClasses: Record<OutlineLinkSize, string> = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-5 py-2.5 text-sm',
}

export const OutlineLink = forwardRef<HTMLAnchorElement, OutlineLinkProps>(
  ({ className, size = 'md', ...props }, ref) => (
    <a
      ref={ref}
      className={cn(
        'inline-flex items-center gap-2 rounded-full font-medium border border-border hover:border-foreground/30 hover:bg-secondary transition-all duration-200',
        focusRing,
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
)
OutlineLink.displayName = 'OutlineLink'
