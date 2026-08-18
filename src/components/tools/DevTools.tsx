import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckGrid,
  CheckRow,
  Field,
  ResultBlock,
  ResultInline,
  SegmentedControl,
  SelectInput,
  StatGrid,
  StatusBanner,
  ToolActions,
  ToolPanel,
  ToolSplit,
  fieldClassName,
  textareaClassName,
  toolStackClassName,
} from "@/components/tools/shared";
import {
  countText,
  decodeJwt,
  generateUuid,
  toCamelCase,
  toConstantCase,
  toKebabCase,
  toPascalCase,
  toSlug,
  toSnakeCase,
} from "@/lib/tools/text";
import {
  clampLoremCount,
  formatLoremOutput,
  generateLorem,
  LOREM_LIMITS,
  type LoremLang,
  type LoremUnit,
} from "@/lib/tools/lorem";
import {
  formatHsl,
  formatRgb,
  hslToRgb,
  parseHex,
  rgbToHex,
  rgbToHsl,
} from "@/lib/tools/color";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

export const UuidGenerator = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [value, setValue] = useState(() => generateUuid());

  return (
    <ToolPanel>
      <form
        className={toolStackClassName}
        onSubmit={(event) => {
          event.preventDefault();
          setValue(generateUuid());
        }}
      >
        <ResultInline label={tx.tools.result} value={value} />
        <ToolActions className="justify-end">
          <Button type="submit">
            {tx.tools.generate}
          </Button>
        </ToolActions>
      </form>
    </ToolPanel>
  );
};

export const JsonFormatter = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [input, setInput] = useState("{\n  \n}");
  const [output, setOutput] = useState("");
  const [message, setMessage] = useState<"idle" | "valid" | "invalid">("idle");
  const [error, setError] = useState("");

  const run = (pretty: boolean) => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, pretty ? 2 : 0));
      setMessage("valid");
      setError("");
    } catch (err) {
      setMessage("invalid");
      setError(err instanceof Error ? err.message : tx.tools.jsonInvalid);
    }
  };

  return (
    <ToolPanel>
      <div className={toolStackClassName}>
        <ToolSplit>
          <div className="space-y-3">
            <Field id="json-input" label={tx.tools.input} error={error || undefined}>
              <textarea
                id="json-input"
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  setMessage("idle");
                  setError("");
                }}
                className={textareaClassName}
                aria-invalid={message === "invalid"}
              />
            </Field>
            <ToolActions>
              <Button type="button" onClick={() => run(true)}>
                {tx.tools.format}
              </Button>
              <Button type="button" variant="outline" onClick={() => run(false)}>
                {tx.tools.minify}
              </Button>
            </ToolActions>
          </div>
          <div className="space-y-3">
            {message === "valid" ? (
              <StatusBanner tone="success">{tx.tools.jsonValid}</StatusBanner>
            ) : null}
            <ResultBlock label={tx.tools.output} value={output} />
          </div>
        </ToolSplit>
      </div>
    </ToolPanel>
  );
};

export const CaseConverter = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [input, setInput] = useState("");
  const variants = useMemo(
    () => [
      { label: "camelCase", value: toCamelCase(input) },
      { label: "PascalCase", value: toPascalCase(input) },
      { label: "snake_case", value: toSnakeCase(input) },
      { label: "kebab-case", value: toKebabCase(input) },
      { label: "CONSTANT_CASE", value: toConstantCase(input) },
      { label: "slug", value: toSlug(input) },
    ],
    [input]
  );

  return (
    <ToolPanel>
      <div className={toolStackClassName}>
        <Field id="case-input" label={tx.tools.input}>
          <textarea
            id="case-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className={textareaClassName}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          {variants.map((variant) => (
            <ResultInline key={variant.label} label={variant.label} value={variant.value} />
          ))}
        </div>
      </div>
    </ToolPanel>
  );
};

export const TextCounter = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [input, setInput] = useState("");
  const stats = countText(input);

  return (
    <ToolPanel>
      <div className={toolStackClassName}>
        <Field id="count-input" label={tx.tools.input}>
          <textarea
            id="count-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className={textareaClassName}
          />
        </Field>
        <StatGrid
          items={[
            { label: tx.tools.chars, value: stats.chars },
            { label: tx.tools.words, value: stats.words },
            { label: lang === "pt" ? "linhas" : "lines", value: stats.lines },
            { label: tx.tools.bytes, value: stats.bytes },
          ]}
        />
      </div>
    </ToolPanel>
  );
};

const defaultLorem = {
  unit: "paragraphs" as LoremUnit,
  count: 3,
  textLang: "la" as LoremLang,
  startWithLorem: true,
};

export const LoremGenerator = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [unit, setUnit] = useState<LoremUnit>(defaultLorem.unit);
  const [count, setCount] = useState(defaultLorem.count);
  const [textLang, setTextLang] = useState<LoremLang>(defaultLorem.textLang);
  const [startWithLorem, setStartWithLorem] = useState(defaultLorem.startWithLorem);
  const [html, setHtml] = useState(false);
  const [plain, setPlain] = useState(() =>
    generateLorem({
      count: defaultLorem.count,
      unit: defaultLorem.unit,
      lang: defaultLorem.textLang,
      startWithLorem: defaultLorem.startWithLorem,
    })
  );

  const limits = LOREM_LIMITS[unit];
  const value = formatLoremOutput(plain, html);
  const stats = countText(plain);
  const paragraphCount = plain.split(/\n\n+/).filter(Boolean).length;

  const refresh = (next: {
    unit: LoremUnit;
    count: number;
    textLang: LoremLang;
    startWithLorem: boolean;
  }) => {
    setPlain(
      generateLorem({
        count: next.count,
        unit: next.unit,
        lang: next.textLang,
        startWithLorem: next.startWithLorem,
      })
    );
  };

  const apply = (patch: {
    unit?: LoremUnit;
    count?: number;
    textLang?: LoremLang;
    startWithLorem?: boolean;
  }) => {
    const nextUnit = patch.unit ?? unit;
    const next = {
      unit: nextUnit,
      count: clampLoremCount(
        patch.unit ? LOREM_LIMITS[patch.unit].fallback : (patch.count ?? count),
        nextUnit
      ),
      textLang: patch.textLang ?? textLang,
      startWithLorem: patch.startWithLorem ?? startWithLorem,
    };

    if (patch.unit) setUnit(patch.unit);
    if (patch.count !== undefined || patch.unit) setCount(next.count);
    if (patch.textLang) setTextLang(patch.textLang);
    if (patch.startWithLorem !== undefined) setStartWithLorem(patch.startWithLorem);

    refresh(next);
  };

  return (
    <ToolPanel>
      <form
        className={toolStackClassName}
        onSubmit={(event) => {
          event.preventDefault();
          refresh({ unit, count, textLang, startWithLorem });
        }}
      >
        <SegmentedControl
          legend={tx.tools.options}
          value={unit}
          onChange={(next) => apply({ unit: next })}
          fullWidth
          options={[
            { value: "paragraphs", label: tx.tools.paragraphs },
            { value: "sentences", label: tx.tools.sentences },
            { value: "words", label: tx.tools.wordsLabel },
          ]}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="lorem-count" label={tx.tools.quantity}>
            <input
              id="lorem-count"
              type="number"
              min={limits.min}
              max={limits.max}
              value={count}
              onChange={(event) => apply({ count: Number(event.target.value) })}
              className={fieldClassName}
            />
          </Field>
          <Field id="lorem-lang" label={tx.tools.loremLang}>
            <SelectInput
              id="lorem-lang"
              value={textLang}
              onChange={(event) => apply({ textLang: event.target.value as LoremLang })}
            >
              <option value="la">{tx.tools.loremLatin}</option>
              <option value="pt">{tx.tools.loremPortuguese}</option>
              <option value="en">{tx.tools.loremEnglish}</option>
            </SelectInput>
          </Field>
        </div>

        <CheckGrid>
          <CheckRow
            id="lorem-start"
            label={tx.tools.loremStart}
            checked={startWithLorem}
            onChange={(checked) => apply({ startWithLorem: checked })}
          />
          <CheckRow
            id="lorem-html"
            label={tx.tools.loremHtml}
            checked={html}
            onChange={setHtml}
          />
        </CheckGrid>

        <ToolActions className="justify-end">
          <Button type="submit">{tx.tools.generate}</Button>
        </ToolActions>

        <ResultBlock
          label={tx.tools.result}
          value={value}
          mono={html}
          wrap="words"
          tall
        />

        <StatGrid
          items={[
            { label: tx.tools.paragraphs, value: paragraphCount },
            { label: tx.tools.words, value: stats.words },
            { label: tx.tools.chars, value: stats.chars },
            { label: tx.tools.bytes, value: stats.bytes },
          ]}
        />
      </form>
    </ToolPanel>
  );
};

export const ColorConverter = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [hex, setHex] = useState("#2C4A6E");
  const rgb = parseHex(hex) ?? { r: 44, g: 74, b: 110 };
  const hsl = rgbToHsl(rgb);
  const pickerValue = rgbToHex(rgb).toLowerCase();

  return (
    <ToolPanel>
      <div className={toolStackClassName}>
        <div className="flex gap-4 items-start">
          <div className="relative shrink-0">
            <div
              className="size-16 sm:size-20 rounded-xl border border-border"
              style={{ backgroundColor: rgbToHex(rgb) }}
              role="img"
              aria-label={`${tx.tools.preview}: ${rgbToHex(rgb)}`}
            />
            <input
              type="color"
              value={pickerValue}
              onChange={(event) => setHex(event.target.value.toUpperCase())}
              className="absolute inset-0 size-full cursor-pointer opacity-0"
              aria-label={tx.tools.colorPicker}
            />
          </div>
          <div className="grid flex-1 gap-2 sm:grid-cols-3">
            <Field id="hex" label={tx.tools.hexLabel}>
              <input
                id="hex"
                value={hex}
                onChange={(event) => setHex(event.target.value)}
                className={fieldClassName}
              />
            </Field>
            <Field id="rgb" label={tx.tools.rgbLabel}>
              <input
                id="rgb"
                className={fieldClassName}
                value={formatRgb(rgb)}
                onChange={(event) => {
                  const match = event.target.value.match(/(\d+)\D+(\d+)\D+(\d+)/);
                  if (!match) return;
                  setHex(
                    rgbToHex({
                      r: Number(match[1]),
                      g: Number(match[2]),
                      b: Number(match[3]),
                    })
                  );
                }}
              />
            </Field>
            <Field id="hsl" label={tx.tools.hslLabel}>
              <input
                id="hsl"
                className={fieldClassName}
                value={formatHsl(hsl)}
                onChange={(event) => {
                  const match = event.target.value.match(/(\d+)\D+(\d+)\D+(\d+)/);
                  if (!match) return;
                  setHex(
                    rgbToHex(
                      hslToRgb({
                        h: Number(match[1]),
                        s: Number(match[2]),
                        l: Number(match[3]),
                      })
                    )
                  );
                }}
              />
            </Field>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{tx.tools.colorPickerHint}</p>
      </div>
    </ToolPanel>
  );
};

export const JwtDecoder = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [input, setInput] = useState("");
  const decoded = input.trim() ? decodeJwt(input) : null;
  const showError = Boolean(input.trim()) && !decoded;

  return (
    <ToolPanel>
      <div className={toolStackClassName}>
        <Field
          id="jwt-input"
          label={tx.tools.input}
          hint={tx.tools.jwtHint}
          error={showError ? tx.tools.jwtInvalid : undefined}
        >
          <textarea
            id="jwt-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            className={textareaClassName}
            aria-invalid={showError}
          />
        </Field>
        {decoded ? (
          <div className="space-y-4">
            <ResultBlock
              label={tx.tools.jwtHeader}
              value={JSON.stringify(decoded.header, null, 2)}
            />
            <ResultBlock
              label={tx.tools.jwtPayload}
              value={JSON.stringify(decoded.payload, null, 2)}
            />
          </div>
        ) : null}
      </div>
    </ToolPanel>
  );
};
