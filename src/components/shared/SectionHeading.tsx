import { Reveal } from '@/components/shared/Reveal'
import { sectionProseClassName } from '@/components/shared/sectionStyles'
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  id: string
  title: string
  italic: string
  subtitle?: string
  italicPosition?: 'after' | 'before'
}

export const SectionHeading = ({
  id,
  title,
  italic,
  subtitle,
  italicPosition = 'after',
}: SectionHeadingProps) => {
  return (
    <Reveal className={cn(sectionProseClassName, 'text-center mb-10 sm:mb-12')}>
      <h2 id={id} className="text-3xl sm:text-4xl font-medium tracking-tight mb-4">
        {italicPosition === 'after' ? (
          <>
            {title}{' '}
            <span className="font-serif italic text-muted-foreground">{italic}</span>
          </>
        ) : (
          <>
            <span className="font-serif italic text-muted-foreground">{italic}</span>{' '}
            {title}
          </>
        )}
      </h2>
      {subtitle && <p className="text-muted-foreground text-sm sm:text-base">{subtitle}</p>}
    </Reveal>
  )
}
