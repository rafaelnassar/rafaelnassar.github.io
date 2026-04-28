import { Award, ExternalLink } from 'lucide-react'
import { Reveal } from '@/components/shared/Reveal'
import { SectionHeading } from '@/components/shared/SectionHeading'
import { Card } from '@/components/shared/Card'
import { TagPillList } from '@/components/shared/TagPill'
import { IconBadge } from '@/components/shared/IconBadge'
import { OutlineLink } from '@/components/shared/OutlineLink'
import { certifications } from '@/data/certifications'
import { useLang } from '@/lib/i18n'
import { t } from '@/data/translations'

export const Certifications = () => {
  const { lang } = useLang()
  const tx = t(lang)

  return (
    <section id="certificacoes" aria-labelledby="certificacoes-title" className="py-20 sm:py-24">
      <div className="container mx-auto px-6">
        <SectionHeading
          id="certificacoes-title"
          title={tx.certifications.title}
          italic={tx.certifications.italic}
          subtitle={tx.certifications.subtitle}
        />

        <div className="max-w-3xl mx-auto grid gap-4">
          {certifications.map((cert, index) => (
            <Reveal key={cert.credentialId} delay={index * 0.05}>
              <Card>
                <div className="flex items-start gap-4">
                  <IconBadge icon={Award} />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-base sm:text-lg">{cert.name}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm mt-0.5">
                      {cert.issuer} · {cert.date}
                    </p>

                    <TagPillList tags={cert.skills[lang]} className="mt-3" />

                    <OutlineLink
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${tx.certifications.credentialAria} ${cert.name} ${tx.certifications.credentialAriaSuffix}`}
                      size="sm"
                      className="mt-4"
                    >
                      {tx.certifications.seeCredential}
                      <ExternalLink className="w-3.5 h-3.5" aria-hidden />
                    </OutlineLink>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
