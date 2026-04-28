import { type LucideIcon } from 'lucide-react'

interface IconBadgeProps {
  icon: LucideIcon
}

export const IconBadge = ({ icon: Icon }: IconBadgeProps) => (
  <div
    aria-hidden
    className="flex-shrink-0 w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"
  >
    <Icon className="w-5 h-5 text-muted-foreground" />
  </div>
)
