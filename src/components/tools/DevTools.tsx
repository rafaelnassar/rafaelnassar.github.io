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
  ToolActions,
  ToolPanel,
  ToolSplit,
  fieldClassName,
  textareaClassName,
  toolStackClassName,
} from "@/components/tools/shared";
import { formatSql } from "@/lib/tools/sql";
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
import { cn } from "@/lib/utils";

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

const JSON_SAMPLE = `{
  "name": "Rafael",
  "active": true,
  "tags": ["labs", "json"]
}`;

const SQL_SAMPLE = `SELECT u.name, u.email, COUNT(o.id) AS orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.id
WHERE u.active = true
GROUP BY u.name, u.email
ORDER BY orders DESC;`;

type FormatMode = "pretty" | "minify";

type FormatResult =
  | { status: "idle" }
  | { status: "valid"; output: string }
  | { status: "invalid"; error: string };

const readJson = (input: string, pretty: boolean): FormatResult => {
  const trimmed = input.trim();
  if (!trimmed) return { status: "idle" };

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    const output = JSON.stringify(parsed, null, pretty ? 2 : 0);
    return { status: "valid", output };
  } catch (err) {
    return {
      status: "invalid",
      error: err instanceof Error ? err.message : "",
    };
  }
};

const FormatterTool = ({
  id,
  sample,
  format,
  hint,
  invalidLabel,
}: {
  id: string;
  sample: string;
  format: (input: string, pretty: boolean) => FormatResult;
  hint: string;
  invalidLabel: string;
}) => {
  const { lang } = useLang();
  const tx = t(lang);
  const [input, setInput] = useState(sample);
  const [mode, setMode] = useState<FormatMode>("pretty");
  const [touched, setTouched] = useState(false);

  const pretty = mode === "pretty";
  const parsed = useMemo(() => format(input, pretty), [format, input, pretty]);
  const output = parsed.status === "valid" ? parsed.output : "";
  const showError = touched && parsed.status === "invalid";
  const errorMessage = showError
    ? [invalidLabel, parsed.error].filter(Boolean).join(" ")
    : undefined;
  const inputId = `${id}-input`;

  return (
    <ToolPanel>
      <div className={toolStackClassName}>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SegmentedControl
            legend={tx.tools.options}
            value={mode}
            onChange={setMode}
            options={[
              { value: "pretty", label: tx.tools.format },
              { value: "minify", label: tx.tools.minify },
            ]}
          />
          <ToolActions>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setInput(sample);
                setTouched(false);
              }}
            >
              {tx.tools.example}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setInput("");
                setTouched(false);
              }}
            >
              {tx.tools.clear}
            </Button>
          </ToolActions>
        </div>

        <ToolSplit>
          <Field
            id={inputId}
            label={tx.tools.input}
            hint={showError ? undefined : hint}
            error={errorMessage}
          >
            <textarea
              id={inputId}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onBlur={() => {
                if (input.trim()) setTouched(true);
              }}
              className={cn(textareaClassName, "h-72 min-h-72 resize-none")}
              spellCheck={false}
              aria-invalid={showError}
              aria-describedby={
                showError ? `${inputId}-error` : `${inputId}-hint`
              }
            />
          </Field>

          <ResultBlock label={tx.tools.output} value={output} tall />
        </ToolSplit>
      </div>
    </ToolPanel>
  );
};

export const JsonFormatter = () => {
  const { lang } = useLang();
  const tx = t(lang);

  return (
    <FormatterTool
      id="json"
      sample={JSON_SAMPLE}
      format={readJson}
      hint={tx.tools.jsonHint}
      invalidLabel={tx.tools.jsonInvalid}
    />
  );
};

export const SqlFormatter = () => {
  const { lang } = useLang();
  const tx = t(lang);

  return (
    <FormatterTool
      id="sql"
      sample={SQL_SAMPLE}
      format={formatSql}
      hint={tx.tools.sqlHint}
      invalidLabel={tx.tools.sqlInvalid}
    />
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
