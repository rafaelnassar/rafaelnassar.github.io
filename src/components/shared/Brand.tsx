import { cn } from '@/lib/utils'

interface BrandProps {
  className?: string
}

export const Brand = ({ className }: BrandProps) => (
  <span className={cn('text-lg tracking-tight', className)}>
    <span className="font-serif italic">rafael</span>
    <span className="font-semibold">nassar</span>
    <span className="text-primary">.</span>
  </span>
)
