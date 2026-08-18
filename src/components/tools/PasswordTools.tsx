import { useMemo, useState, type FormEvent } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CheckRow,
  Field,
  ResultInline,
  StrengthMeter,
  StatusBanner,
  ToolPanel,
  fieldClassName,
  toolStackClassName,
} from "@/components/tools/shared";
import { iconButtonClassName } from "@/components/shared/iconButtonStyles";
import { generatePassword, passwordStrength } from "@/lib/tools/password";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";
import { cn } from "@/lib/utils";

const initial = generatePassword({
  length: 20,
  lowercase: true,
  uppercase: true,
  numbers: true,
  symbols: true,
  avoidSimilar: true,
});

const PasswordCheckResult = ({
  status,
  count,
  lang,
}: {
  status: "safe" | "pwned";
  count: number;
  lang: "pt" | "en";
}) => {
  const tx = t(lang);

  if (status === "safe") {
    return <StatusBanner tone="success">{tx.tools.passwordSafe}</StatusBanner>;
  }

  const formatted = count.toLocaleString(lang === "pt" ? "pt-BR" : "en-US");

  return (
    <div
      role="alert"
      aria-live="polite"
      className="rounded-xl border border-border bg-secondary/50 px-3 py-2.5 space-y-1.5"
    >
      <p className="text-sm leading-relaxed text-foreground">
        {tx.tools.passwordPwned}{" "}
        <span className="font-medium tabular-nums">{formatted}</span>{" "}
        {tx.tools.passwordTimes}.
      </p>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {tx.tools.passwordPwnedHint}
      </p>
    </div>
  );
};

export const PasswordGenerator = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [length, setLength] = useState(20);
  const [lowercase, setLowercase] = useState(true);
  const [uppercase, setUppercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [avoidSimilar, setAvoidSimilar] = useState(true);
  const [password, setPassword] = useState(initial);
  const [error, setError] = useState("");

  const strength = useMemo(() => passwordStrength(password), [password]);

  const handleGenerate = () => {
    if (!lowercase && !uppercase && !numbers && !symbols) {
      setError(tx.tools.charsetError);
      return;
    }
    setError("");
    setPassword(
      generatePassword({
        length,
        lowercase,
        uppercase,
        numbers,
        symbols,
        avoidSimilar,
      })
    );
  };

  return (
    <ToolPanel>
      <form
        className={toolStackClassName}
        onSubmit={(event) => {
          event.preventDefault();
          handleGenerate();
        }}
      >
        <div className="space-y-1.5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1 space-y-1.5">
              <p className="text-sm font-medium tracking-tight">{tx.tools.result}</p>
              <ResultInline value={password} />
            </div>
            <Button type="submit" className="shrink-0 w-full sm:w-auto">
              {tx.tools.generate}
            </Button>
          </div>
          <StrengthMeter label={strength.label[lang]} score={strength.score} />
        </div>

        <Field id="password-length" label={`${tx.tools.length}: ${length}`}>
          <input
            id="password-length"
            type="range"
            min={8}
            max={64}
            value={length}
            onChange={(event) => setLength(Number(event.target.value))}
            className="w-full accent-foreground cursor-pointer"
          />
        </Field>

        <fieldset>
          <legend className="text-sm font-medium tracking-tight mb-2">
            {tx.tools.options}
          </legend>
          <div className="space-y-0">
            <CheckRow id="pw-lower" label={tx.tools.lowercase} checked={lowercase} onChange={setLowercase} />
            <CheckRow id="pw-upper" label={tx.tools.uppercase} checked={uppercase} onChange={setUppercase} />
            <CheckRow id="pw-num" label={tx.tools.numbers} checked={numbers} onChange={setNumbers} />
            <CheckRow id="pw-sym" label={tx.tools.symbols} checked={symbols} onChange={setSymbols} />
            <CheckRow id="pw-similar" label={tx.tools.similar} checked={avoidSimilar} onChange={setAvoidSimilar} />
          </div>
        </fieldset>

        {error ? (
          <StatusBanner tone="error">{error}</StatusBanner>
        ) : null}
      </form>
    </ToolPanel>
  );
};

export const PasswordChecker = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "safe" | "pwned" | "fail">("idle");
  const [count, setCount] = useState(0);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!password.trim()) {
      setError(tx.tools.passwordEmpty);
      setStatus("idle");
      return;
    }
    setError("");
    setStatus("loading");
    const { checkPwnedPassword } = await import("@/lib/tools/hibp");
    const result = await checkPwnedPassword(password);
    if (!result.ok) {
      setStatus("fail");
      return;
    }
    setCount(result.count);
    setStatus(result.count > 0 ? "pwned" : "safe");
  };

  return (
    <ToolPanel>
      <form className={toolStackClassName} onSubmit={handleSubmit}>
        <Field
          id="pwned-password"
          label={tx.tools.password}
          error={error}
        >
          <div className="flex gap-2">
            <div className="relative flex-1 min-w-0">
              <input
                id="pwned-password"
                type={visible ? "text" : "password"}
                autoComplete="off"
                spellCheck={false}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  setStatus("idle");
                  setError("");
                }}
                className={cn(fieldClassName, "pr-10")}
                aria-invalid={Boolean(error)}
              />
              <button
                type="button"
                onClick={() => setVisible((value) => !value)}
                className={cn(
                  iconButtonClassName("ghost", "sm"),
                  "absolute right-0.5 top-1/2 -translate-y-1/2 cursor-pointer"
                )}
                aria-pressed={visible}
                aria-label={visible ? tx.tools.hidePassword : tx.tools.showPassword}
              >
                {visible ? (
                  <EyeOff className="size-4" aria-hidden />
                ) : (
                  <Eye className="size-4" aria-hidden />
                )}
              </button>
            </div>
            <Button type="submit" disabled={status === "loading"} className="shrink-0">
              {status === "loading" ? tx.tools.passwordChecking : tx.tools.check}
            </Button>
          </div>
        </Field>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {tx.tools.passwordPrivacy}
        </p>

        {status === "safe" ? (
          <PasswordCheckResult status="safe" count={0} lang={lang} />
        ) : null}
        {status === "pwned" ? (
          <PasswordCheckResult status="pwned" count={count} lang={lang} />
        ) : null}
        {status === "fail" ? (
          <StatusBanner tone="error">{tx.tools.passwordError}</StatusBanner>
        ) : null}
      </form>
    </ToolPanel>
  );
};
