import { useMemo, useState } from "react";
import {
  CopyButton,
  Field,
  ResultInline,
  SegmentedControl,
  ToolPanel,
  fieldClassName,
  toolStackClassName,
} from "@/components/tools/shared";
import { FANCY_TEXT_STYLES, transformFancyText } from "@/lib/tools/fancy-text";
import { numberToWords, type NumberWordsMode } from "@/lib/tools/number-words";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

export const FancyTextTool = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [input, setInput] = useState("");

  const variants = useMemo(
    () =>
      FANCY_TEXT_STYLES.map((style) => ({
        id: style.id,
        label: style.label[lang],
        value: input ? transformFancyText(input, style.id) : "",
      })),
    [input, lang]
  );

  return (
    <ToolPanel>
      <div className={toolStackClassName}>
        <Field id="fancy-input" label={tx.tools.input}>
          <input
            id="fancy-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className={fieldClassName}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          {variants.map((variant) => (
            <div key={variant.id} className="space-y-1.5">
              <p className="text-sm font-medium tracking-tight">{variant.label}</p>
              <div className="relative flex min-h-10 items-center rounded-xl border border-input bg-background">
                <p className="flex-1 min-w-0 px-3 py-2 pr-10 text-sm break-all leading-normal">
                  {variant.value || "—"}
                </p>
                <CopyButton value={variant.value} className="absolute right-1 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ToolPanel>
  );
};

export const NumberWordsTool = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<NumberWordsMode>("currency");
  const [letterCase, setLetterCase] = useState<"lower" | "upper" | "title">("lower");

  const output = useMemo(
    () => (value.trim() ? numberToWords(value, mode, letterCase, lang) : ""),
    [value, mode, letterCase, lang]
  );

  return (
    <ToolPanel>
      <div className={toolStackClassName}>
        <SegmentedControl
          legend={tx.tools.options}
          value={mode}
          onChange={setMode}
          options={[
            { value: "currency", label: tx.tools.numberCurrency },
            { value: "number", label: tx.tools.numberSimple },
          ]}
        />

        <SegmentedControl
          legend={tx.tools.numberCase}
          value={letterCase}
          onChange={setLetterCase}
          options={[
            { value: "lower", label: tx.tools.numberLower },
            { value: "upper", label: tx.tools.numberUpper },
            { value: "title", label: tx.tools.numberTitle },
          ]}
        />

        <Field id="number-input" label={tx.tools.input}>
          <input
            id="number-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            inputMode="decimal"
            placeholder={lang === "pt" ? "1234,56" : "1234.56"}
            className={fieldClassName}
          />
        </Field>

        <ResultInline label={tx.tools.result} value={output} mono={false} />
      </div>
    </ToolPanel>
  );
};
