import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { LabsShell } from "@/components/labs/LabsShell";
import { LabsPage } from "@/components/labs/LabsPage";
import { CodeBlock } from "@/components/labs/CodeBlock";
import { Reveal } from "@/components/shared/Reveal";
import { TagPill } from "@/components/shared/TagPill";
import { Card } from "@/components/shared/Card";
import { Button } from "@/components/ui/button";
import { cn, focusRing } from "@/lib/utils";
import { categoryLabel, getLabBySlug } from "@/data/labs";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

const LabDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { lang } = useLang();
  const tx = t(lang);
  const lab = slug ? getLabBySlug(slug) : undefined;

  if (!lab) {
    return <Navigate to="/labs/scripts" replace />;
  }

  const backHref = lab.section === "docs" ? "/labs/docs" : "/labs/scripts";
  const backLabel = lab.section === "docs" ? tx.labs.backToDocs : tx.labs.backToScripts;

  return (
    <LabsShell>
      <LabsPage labelledBy="lab-detail-title" as="article">
        <div className="space-y-8 sm:space-y-10">
            <Reveal>
              <Link
                to={backHref}
                className={cn(
                  "inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer rounded-md mb-4",
                  focusRing
                )}
              >
                <ArrowLeft className="size-4" aria-hidden />
                {backLabel}
              </Link>

              <div className="flex flex-wrap items-center gap-2 mb-4">
                <TagPill>{categoryLabel[lab.category][lang]}</TagPill>
                <span className="text-xs text-muted-foreground">
                  {tx.labs.updated} {lab.updatedAt}
                </span>
              </div>

              <h1
                id="lab-detail-title"
                className="text-3xl font-medium tracking-tight mb-3 text-balance"
              >
                {lab.title[lang]}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-prose text-pretty">
                {lab.summary[lang]}
              </p>
            </Reveal>

            {lab.installCommand && (
              <Reveal delay={0.05}>
                <section aria-labelledby="lab-quickstart">
                  <h2
                    id="lab-quickstart"
                    className="text-lg font-medium tracking-tight mb-3"
                  >
                    {tx.labs.quickStart}
                  </h2>
                  <CodeBlock code={lab.installCommand} language="powershell" />
                </section>
              </Reveal>
            )}

            <Reveal delay={0.08}>
              <section aria-labelledby="lab-prereqs">
                <h2
                  id="lab-prereqs"
                  className="text-lg font-medium tracking-tight mb-3"
                >
                  {tx.labs.prerequisites}
                </h2>
                <ul className="space-y-2 text-sm sm:text-base text-muted-foreground">
                  {lab.prerequisites.map((item) => (
                    <li key={item[lang]} className="flex gap-2">
                      <span
                        aria-hidden
                        className="mt-2 size-1.5 rounded-full bg-foreground/40 shrink-0"
                      />
                      <span className="leading-relaxed">{item[lang]}</span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>

            {lab.tools && lab.tools.length > 0 && (
              <Reveal delay={0.1}>
                <section aria-labelledby="lab-tools">
                  <h2
                    id="lab-tools"
                    className="text-lg font-medium tracking-tight mb-4"
                  >
                    {tx.labs.includedTools}
                  </h2>
                  <div className="grid gap-3 sm:grid-cols-1">
                    {lab.tools.map((tool) => (
                      <Card key={tool.id} className="!p-4">
                        <h3 className="font-medium text-sm sm:text-base mb-1">
                          {tool.name}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {tool.description[lang]}
                        </p>
                      </Card>
                    ))}
                  </div>
                </section>
              </Reveal>
            )}

            <Reveal delay={0.12}>
              <section aria-labelledby="lab-steps">
                <h2
                  id="lab-steps"
                  className="text-lg font-medium tracking-tight mb-6"
                >
                  {tx.labs.howToUse}
                </h2>
                <ol className="space-y-8">
                  {lab.steps.map((step, index) => (
                    <li key={step.title[lang]} className="relative pl-10">
                      <span
                        aria-hidden
                        className="absolute left-0 top-0 flex size-7 items-center justify-center rounded-full bg-secondary text-xs font-medium"
                      >
                        {index + 1}
                      </span>
                      <h3 className="font-medium text-base mb-2">
                        {step.title[lang]}
                      </h3>
                      {step.body && (
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-3">
                          {step.body[lang]}
                        </p>
                      )}
                      {step.code && (
                        <CodeBlock
                          code={step.code}
                          language={step.codeLang ?? "shell"}
                        />
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            </Reveal>

            {lab.notes && lab.notes.length > 0 && (
              <Reveal delay={0.14}>
                <section aria-labelledby="lab-notes">
                  <h2
                    id="lab-notes"
                    className="text-lg font-medium tracking-tight mb-3"
                  >
                    {tx.labs.notes}
                  </h2>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {lab.notes.map((note) => (
                      <li key={note[lang]} className="leading-relaxed">
                        {note[lang]}
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            )}

            {lab.sourcePaths && lab.sourcePaths.length > 0 && (
              <Reveal delay={0.16}>
                <section aria-labelledby="lab-sources">
                  <h2
                    id="lab-sources"
                    className="text-lg font-medium tracking-tight mb-3"
                  >
                    {tx.labs.sources}
                  </h2>
                  <ul className="space-y-2">
                    {lab.sourcePaths.map((path) => (
                      <li key={path}>
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="cursor-pointer"
                          >
                            <ExternalLink aria-hidden className="size-3.5" />
                            <span className="font-mono text-xs">{path}</span>
                          </a>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
            )}
        </div>
      </LabsPage>
    </LabsShell>
  );
};

export default LabDetail;
