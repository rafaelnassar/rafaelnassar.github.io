import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import {
  iconButtonClassName,
  type IconButtonVariant,
  type IconButtonSize,
} from './iconButtonStyles'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant
  size?: IconButtonSize
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(iconButtonClassName(variant, size), className)}
      {...props}
    />
  )
)
IconButton.displayName = 'IconButton'
