import { useEffect } from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { LabsShell } from "@/components/labs/LabsShell";
import { LabsPage } from "@/components/labs/LabsPage";
import { LabCard } from "@/components/labs/LabCard";
import { ToolCard } from "@/components/labs/ToolCard";
import { LabsSectionHeading } from "@/components/labs/LabsSectionHeading";
import { ToolsPagination } from "@/components/labs/ToolsPagination";
import { SegmentedControl } from "@/components/tools/shared";
import { Reveal } from "@/components/shared/Reveal";
import { getLabsBySection, type LabSection } from "@/data/labs";
import {
  DEFAULT_TOOL_CATEGORY,
  getToolsForPage,
  getToolsPageCount,
  resolveToolCategory,
  TOOL_CATEGORIES,
  type ToolCategory,
} from "@/data/tools";
import { buildToolsListHref, saveToolsListHref } from "@/lib/labs-catalog";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

type CatalogKind = "ferramentas" | LabSection;

interface LabsCatalogProps {
  kind: CatalogKind;
}

const buildToolsHref = (nextCategory: ToolCategory, page = 1): string => {
  const params = new URLSearchParams();
  if (nextCategory !== DEFAULT_TOOL_CATEGORY) params.set("aba", nextCategory);
  if (page > 1) params.set("pagina", String(page));
  return buildToolsListHref(params);
};

const LabsCatalog = ({ kind }: LabsCatalogProps) => {
  const { lang } = useLang();
  const tx = t(lang);
  const [searchParams, setSearchParams] = useSearchParams();

  const copy = {
    ferramentas: {
      title: tx.labs.toolsTitle,
      italic: tx.labs.toolsItalic,
      subtitle: tx.labs.toolsSubtitle,
    },
    scripts: {
      title: tx.labs.scriptsTitle,
      italic: tx.labs.scriptsItalic,
      subtitle: tx.labs.scriptsSubtitle,
    },
    docs: {
      title: tx.labs.docsTitle,
      italic: tx.labs.docsItalic,
      subtitle: tx.labs.docsSubtitle,
    },
  }[kind];

  const categoryParam = searchParams.get("aba");
  const category = resolveToolCategory(categoryParam);
  const expectedAba = category === DEFAULT_TOOL_CATEGORY ? null : category;

  const rawPage = Number.parseInt(searchParams.get("pagina") ?? "1", 10);
  const requestedPage = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const totalPages = kind === "ferramentas" ? getToolsPageCount(category) : 1;
  const currentPage = Math.min(requestedPage, totalPages);

  useEffect(() => {
    if (kind !== "ferramentas") return;
    saveToolsListHref(buildToolsHref(category, currentPage));
  }, [kind, category, currentPage]);

  if (kind === "ferramentas") {
    const needsCategoryFix = categoryParam !== expectedAba;
    const needsPageFix = requestedPage !== currentPage;

    if (needsCategoryFix || needsPageFix) {
      return <Navigate to={buildToolsHref(category, currentPage)} replace />;
    }
  }

  const pageTools = kind === "ferramentas" ? getToolsForPage(currentPage, category) : [];
  const sectionLabs = kind !== "ferramentas" ? getLabsBySection(kind) : [];

  const categoryLabels: Record<ToolCategory, string> = {
    geradores: tx.labs.toolsTabGenerators,
    validadores: tx.labs.toolsTabValidators,
    texto: tx.labs.toolsTabText,
    sorteios: tx.labs.toolsTabDraws,
    codigo: tx.labs.toolsTabCode,
    sistema: tx.labs.toolsTabSystem,
  };

  const handleCategoryChange = (next: ToolCategory) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (next === DEFAULT_TOOL_CATEGORY) params.delete("aba");
      else params.set("aba", next);
      params.delete("pagina");
      return params;
    });
  };

  return (
    <LabsShell>
      <LabsPage labelledBy="labs-title">
        <LabsSectionHeading
          id="labs-title"
          title={copy.title}
          italic={copy.italic}
          subtitle={copy.subtitle}
        />

        {kind === "ferramentas" ? (
          <div className="space-y-6">
            <div className="flex justify-center">
              <SegmentedControl
                legend={tx.labs.toolsCategoryLegend}
                value={category}
                onChange={handleCategoryChange}
                options={TOOL_CATEGORIES.map((item) => ({
                  value: item,
                  label: categoryLabels[item],
                }))}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {pageTools.map((tool, index) => (
                <Reveal key={tool.slug} delay={index * 0.04}>
                  <ToolCard tool={tool} />
                </Reveal>
              ))}
            </div>

            {pageTools.length === 0 ? (
              <p className="text-sm text-muted-foreground">{tx.labs.emptySection}</p>
            ) : null}

            <ToolsPagination currentPage={currentPage} category={category} />
          </div>
        ) : sectionLabs.length === 0 ? (
          <p className="text-sm text-muted-foreground">{tx.labs.emptySection}</p>
        ) : (
          <div className="grid gap-4">
            {sectionLabs.map((lab, index) => (
              <Reveal key={lab.slug} delay={index * 0.05}>
                <LabCard lab={lab} />
              </Reveal>
            ))}
          </div>
        )}
      </LabsPage>
    </LabsShell>
  );
};

export const LabsFerramentas = () => <LabsCatalog kind="ferramentas" />;
export const LabsScripts = () => <LabsCatalog kind="scripts" />;
export const LabsDocs = () => <LabsCatalog kind="docs" />;

const Labs = LabsFerramentas;

export default Labs;
