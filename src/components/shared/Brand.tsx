import { FlaskConical } from 'lucide-react'
import { cn } from '@/lib/utils'

interface BrandProps {
  className?: string
  /** Wordmark | ícone + “labs” no mesmo itálico da marca. */
  variant?: 'default' | 'labs'
}

const Wordmark = () => (
  <span className="text-lg tracking-tight leading-none">
    <span className="font-serif italic">rafael</span>
    <span className="font-semibold">nassar</span>
    <span className="text-primary">.</span>
  </span>
)

export const Brand = ({ className, variant = 'default' }: BrandProps) => {
  if (variant !== 'labs') {
    return (
      <span className={className}>
        <Wordmark />
      </span>
    )
  }

  return (
    <span
      className={cn('inline-flex items-center gap-2.5 min-w-0', className)}
      aria-label="rafaelnassar. labs"
    >
      <Wordmark />
      <span aria-hidden className="h-4 w-px shrink-0 bg-border" />
      <span className="inline-flex items-center gap-1.5 text-lg tracking-tight leading-none whitespace-nowrap">
        <FlaskConical className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
        <span className="font-serif italic">labs</span>
      </span>
    </span>
  )
}
