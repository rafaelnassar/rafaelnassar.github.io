import { cn, focusRing } from '@/lib/utils'

export type IconButtonVariant = 'outline' | 'solid' | 'ghost'
export type IconButtonSize = 'sm' | 'md' | 'lg'

const base = `inline-flex items-center justify-center rounded-full transition-all duration-200 ${focusRing}`

const variants: Record<IconButtonVariant, string> = {
  outline: 'border border-border hover:border-foreground/30 hover:bg-secondary',
  solid: 'bg-foreground text-background hover:opacity-90',
  ghost: 'hover:bg-secondary',
}

const sizes: Record<IconButtonSize, string> = {
  sm: 'p-2',
  md: 'p-2.5',
  lg: 'p-3',
}

/**
 * ClassName unificado para botões circulares ícone-only.
 * Consumir via componente <IconButton /> ou aplicar direto em <a> via cn().
 */
export const iconButtonClassName = (
  variant: IconButtonVariant = 'outline',
  size: IconButtonSize = 'md'
) => cn(base, variants[variant], sizes[size])
