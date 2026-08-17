import { LabsShell } from "@/components/labs/LabsShell";
import { LabCard } from "@/components/labs/LabCard";
import { Reveal } from "@/components/shared/Reveal";
import {
  sectionClassName,
  sectionContentClassName,
  sectionProseClassName,
} from "@/components/shared/sectionStyles";
import { cn } from "@/lib/utils";
import { labs } from "@/data/labs";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

const Labs = () => {
  const { lang } = useLang();
  const tx = t(lang);

  return (
    <LabsShell>
      <section className={sectionClassName("plain")} aria-labelledby="labs-title">
        <div className="container mx-auto px-6">
          <Reveal className={cn(sectionProseClassName, "text-center mb-10 sm:mb-12")}>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
              {tx.labs.eyebrow}
            </p>
            <h1
              id="labs-title"
              className="text-3xl sm:text-4xl font-medium tracking-tight mb-4"
            >
              {tx.labs.title}{" "}
              <span className="font-serif italic text-muted-foreground">
                {tx.labs.italic}
              </span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {tx.labs.subtitle}
            </p>
          </Reveal>

          <div
            className={cn(
              sectionContentClassName,
              "grid gap-4 sm:grid-cols-1"
            )}
          >
            {labs.map((lab, index) => (
              <Reveal key={lab.slug} delay={index * 0.05}>
                <LabCard lab={lab} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </LabsShell>
  );
};

export default Labs;
