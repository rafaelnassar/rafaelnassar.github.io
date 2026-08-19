import { Reveal } from "@/components/shared/Reveal";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

interface LabsSectionHeadingProps {
  id: string;
  title: string;
  italic: string;
  subtitle: string;
  className?: string;
}

/** Cabeçalho do Labs — centralizado como as seções do portfolio. */
export const LabsSectionHeading = ({
  id,
  title,
  italic,
  subtitle,
  className,
}: LabsSectionHeadingProps) => {
  const { lang } = useLang();
  const tx = t(lang);

  return (
    <Reveal className={cn("mb-6 sm:mb-8 text-center", className)}>
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
        {tx.labs.eyebrow}
      </p>
      <h1
        id={id}
        className="text-3xl sm:text-4xl font-medium tracking-tight mb-3 text-balance"
      >
        {title}{" "}
        <span className="font-serif italic text-muted-foreground">
          {italic}
        </span>
      </h1>
      <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-prose mx-auto text-pretty">
        {subtitle}
      </p>
    </Reveal>
  );
};
