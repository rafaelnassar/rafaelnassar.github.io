import { useSearchParams } from "react-router-dom";
import { LabsShell } from "@/components/labs/LabsShell";
import { LabsPage } from "@/components/labs/LabsPage";
import { ApiEndpointCard } from "@/components/labs/ApiEndpointCard";
import { LabsSectionHeading } from "@/components/labs/LabsSectionHeading";
import { SegmentedControl } from "@/components/tools/shared";
import { Reveal } from "@/components/shared/Reveal";
import {
  categoryApiLabel,
  getGroupedMockApisByCategory,
  MOCK_API_CATEGORIES,
  type MockApiCategory,
} from "@/data/mock-apis";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

const DEFAULT_CATEGORY: MockApiCategory = "people";

const isApiCategory = (value: string | null): value is MockApiCategory =>
  MOCK_API_CATEGORIES.includes(value as MockApiCategory);

export const LabsApi = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("aba");
  const category = isApiCategory(categoryParam) ? categoryParam : DEFAULT_CATEGORY;

  const categoryLabels = Object.fromEntries(
    MOCK_API_CATEGORIES.map((item) => [item, categoryApiLabel[item][lang]])
  ) as Record<MockApiCategory, string>;

  const groups = getGroupedMockApisByCategory(category);
  let cardIndex = 0;

  const handleCategoryChange = (next: MockApiCategory) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (next === DEFAULT_CATEGORY) params.delete("aba");
      else params.set("aba", next);
      return params;
    });
  };

  return (
    <LabsShell>
      <LabsPage labelledBy="labs-api-title">
        <LabsSectionHeading
          id="labs-api-title"
          title={tx.labs.apiTitle}
          italic={tx.labs.apiItalic}
          subtitle={tx.labs.apiSubtitle}
        />

        <div className="space-y-6">
          <SegmentedControl
            legend={tx.labs.apiCategoryLegend}
            value={category}
            onChange={handleCategoryChange}
            fullWidth
            options={MOCK_API_CATEGORIES.map((item) => ({
              value: item,
              label: categoryLabels[item],
            }))}
          />

          <div className="space-y-8">
            {groups.map((group) => (
              <section
                key={group.id ?? group.endpoints[0].id}
                className="space-y-4"
                aria-label={group.label?.[lang]}
              >
                {group.label ? (
                  <h2 className="text-sm font-medium text-muted-foreground tracking-wide">
                    {group.label[lang]}
                  </h2>
                ) : null}

                <div className="grid gap-4">
                  {group.endpoints.map((endpoint) => {
                    const index = cardIndex++;
                    return (
                      <Reveal key={endpoint.id} delay={index * 0.04}>
                        <ApiEndpointCard endpoint={endpoint} />
                      </Reveal>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {groups.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {tx.labs.emptySection}
            </p>
          ) : null}
        </div>
      </LabsPage>
    </LabsShell>
  );
};
