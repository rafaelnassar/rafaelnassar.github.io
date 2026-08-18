import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Field,
  ToolActions,
  ToolPanel,
  fieldClassName,
  textareaClassName,
  toolStackClassName,
} from "@/components/tools/shared";
import {
  drawFromList,
  drawNumbers,
  MAX_WHEEL_ITEMS,
  parseDrawList,
  pickOne,
} from "@/lib/tools/sorteador";
import { durations, easings, springs } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

const DEFAULT_LIST = "Ana, Bruno, Carla, Diego, Eva, Felipe";
const SPIN_MS = 5600;

const polar = (cx: number, cy: number, r: number, angleDeg: number) => {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const;
};

const useTimeouts = () => {
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  };
  const clear = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  useEffect(() => () => clear(), []);
  return { later, clear };
};

const WinnerCard = ({ label, value }: { label: string; value: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.92, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={springs.soft}
    className="w-full rounded-2xl border border-foreground/15 bg-background px-5 py-6 text-center shadow-sm"
  >
    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground mb-2">{label}</p>
    <p className="text-3xl sm:text-4xl font-medium tracking-tight text-balance break-words">{value}</p>
  </motion.div>
);

const Stage = ({
  busy,
  children,
  className,
}: {
  busy: boolean;
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex min-h-56 items-center justify-center rounded-2xl border border-border bg-secondary/20 px-4 py-8",
      className
    )}
    aria-busy={busy}
    aria-live="polite"
  >
    {children}
  </div>
);

const ListField = ({
  id,
  value,
  onChange,
  hint,
}: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  hint: string;
}) => {
  const { lang } = useLang();
  const tx = t(lang);
  return (
    <Field id={id} label={tx.tools.sortListLabel} hint={hint}>
      <textarea
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={cn(textareaClassName, "min-h-32")}
        rows={5}
      />
    </Field>
  );
};

const RouletteWheel = ({
  items,
  rotation,
  spinning,
  winner,
}: {
  items: string[];
  rotation: number;
  spinning: boolean;
  winner?: string;
}) => {
  const size = 360;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 148;
  const sweep = 360 / Math.max(items.length, 1);

  return (
    <div className="relative mx-auto w-full max-w-[340px]">
      <div className="absolute left-1/2 top-0 z-20 flex -translate-x-1/2 -translate-y-1 flex-col items-center">
        <span className="size-3.5 rounded-full border-2 border-background bg-primary shadow-md" />
        <span className="-mt-0.5 h-0 w-0 border-x-[9px] border-t-[20px] border-x-transparent border-t-primary drop-shadow-sm" />
      </div>

      <div className="rounded-full bg-foreground p-2 shadow-lg">
        <div className="rounded-full bg-background p-1.5">
          <motion.div
            className="aspect-square overflow-hidden rounded-full"
            animate={{ rotate: rotation }}
            transition={{
              duration: spinning ? SPIN_MS / 1000 : 0,
              ease: [0.08, 0.7, 0.12, 1],
            }}
          >
            <svg viewBox={`0 0 ${size} ${size}`} className="size-full" aria-hidden>
              {items.map((item, index) => {
                const start = index * sweep;
                const end = start + sweep;
                const [x1, y1] = polar(cx, cy, radius, start);
                const [x2, y2] = polar(cx, cy, radius, end);
                const large = sweep > 180 ? 1 : 0;
                const [lx, ly] = polar(cx, cy, radius * 0.64, start + sweep / 2);
                const primary = index % 2 === 0;
                return (
                  <g key={`${item}-${index}`}>
                    <path
                      d={`M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2} Z`}
                      fill={primary ? "hsl(var(--foreground))" : "hsl(var(--primary))"}
                      stroke="hsl(var(--background))"
                      strokeWidth="1.5"
                    />
                    <text
                      x={lx}
                      y={ly}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${start + sweep / 2} ${lx} ${ly})`}
                      fill={primary ? "hsl(var(--background))" : "hsl(var(--primary-foreground))"}
                      fontSize={items.length > 10 ? 10 : 13}
                      fontWeight={600}
                    >
                      {item.length > 10 ? `${item.slice(0, 9)}…` : item}
                    </text>
                  </g>
                );
              })}
              <circle
                cx={cx}
                cy={cy}
                r={36}
                fill="hsl(var(--background))"
                stroke="hsl(var(--border))"
                strokeWidth="3"
              />
              <circle cx={cx} cy={cy} r={10} fill="hsl(var(--primary))" />
            </svg>
          </motion.div>
        </div>
      </div>

      {winner && !spinning ? (
        <p className="mt-5 text-center text-xl font-medium tracking-tight text-balance">{winner}</p>
      ) : null}
    </div>
  );
};

export const SorteadorNumerosTool = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const reduceMotion = useReducedMotion();
  const { later, clear } = useTimeouts();
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [rolling, setRolling] = useState("");
  const [result, setResult] = useState<string[]>([]);

  const finish = (values: string[]) => {
    setBusy(false);
    setRolling("");
    setResult(values);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    clear();
    setError("");
    const drawn = drawNumbers(Number(min), Number(max), Number(count), label);
    if (!drawn) {
      setError(tx.tools.sortError);
      setResult([]);
      return;
    }
    const values = drawn.numbers.map(String);
    if (reduceMotion) {
      finish(values);
      return;
    }
    setBusy(true);
    setResult([]);
    const pool = Array.from({ length: drawn.max - drawn.min + 1 }, (_, index) =>
      String(drawn.min + index)
    );
    let tick = 0;
    const total = 28;
    const step = () => {
      tick += 1;
      setRolling(pool[Math.floor(Math.random() * pool.length)] ?? values[0]);
      if (tick >= total) {
        finish(values);
        return;
      }
      later(step, 28 + tick * 16);
    };
    step();
  };

  return (
    <ToolPanel>
      <form className={toolStackClassName} onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field id="sort-min" label={tx.tools.sortMin}>
            <input id="sort-min" type="number" value={min} onChange={(e) => setMin(e.target.value)} className={fieldClassName} />
          </Field>
          <Field id="sort-max" label={tx.tools.sortMax}>
            <input id="sort-max" type="number" value={max} onChange={(e) => setMax(e.target.value)} className={fieldClassName} />
          </Field>
          <Field id="sort-count" label={tx.tools.quantity}>
            <input id="sort-count" type="number" min={1} value={count} onChange={(e) => setCount(e.target.value)} className={fieldClassName} />
          </Field>
        </div>
        <Field id="sort-label" label={tx.tools.sortLabel} hint={tx.tools.sortLabelHint}>
          <input id="sort-label" value={label} onChange={(e) => setLabel(e.target.value)} className={fieldClassName} />
        </Field>
        {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
        <Stage busy={busy}>
          <AnimatePresence mode="wait">
            {rolling ? (
              <motion.p
                key={rolling}
                initial={{ opacity: 0.35, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-6xl font-medium tabular-nums tracking-tight"
              >
                {rolling}
              </motion.p>
            ) : result.length > 0 ? (
              <WinnerCard label={tx.tools.sortWinner} value={result.join(" · ")} />
            ) : (
              <p className="text-sm text-muted-foreground">{tx.tools.sortIdle}</p>
            )}
          </AnimatePresence>
        </Stage>
        <ToolActions className="justify-end">
          <Button type="submit" disabled={busy}>{busy ? tx.tools.sortSpinning : tx.tools.draw}</Button>
        </ToolActions>
      </form>
    </ToolPanel>
  );
};

export const SorteadorListaTool = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const reduceMotion = useReducedMotion();
  const { later, clear } = useTimeouts();
  const [listInput, setListInput] = useState(DEFAULT_LIST);
  const [count, setCount] = useState("1");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState<string>("");
  const [result, setResult] = useState<string[]>([]);
  const items = useMemo(() => parseDrawList(listInput), [listInput]);

  const finish = (values: string[]) => {
    setBusy(false);
    setActive("");
    setResult(values);
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    clear();
    setError("");
    const picked = drawFromList(items, Number(count) || 1);
    if (!picked) {
      setError(items.length < 2 ? tx.tools.sortListError : tx.tools.sortError);
      setResult([]);
      return;
    }
    if (reduceMotion) {
      finish(picked);
      return;
    }
    setBusy(true);
    setResult([]);
    let tick = 0;
    const total = 24;
    const step = () => {
      tick += 1;
      setActive(items[Math.floor(Math.random() * items.length)] ?? picked[0]);
      if (tick >= total) {
        finish(picked);
        return;
      }
      later(step, 40 + tick * 14);
    };
    step();
  };

  return (
    <ToolPanel>
      <form className={toolStackClassName} onSubmit={handleSubmit}>
        <ListField id="sort-list" value={listInput} onChange={setListInput} hint={tx.tools.sortListHint} />
        <Field id="sort-list-count" label={tx.tools.quantity}>
          <input
            id="sort-list-count"
            type="number"
            min={1}
            max={items.length || 1}
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className={fieldClassName}
          />
        </Field>
        {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
        {items.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
            {items.map((item) => (
              <li
                key={item}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors duration-150",
                  active === item
                    ? "border-foreground bg-foreground text-background"
                    : result.includes(item)
                      ? "border-foreground bg-secondary text-foreground"
                      : "border-border text-muted-foreground"
                )}
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}
        <Stage busy={busy}>
          {result.length > 0 && !busy ? (
            <WinnerCard label={tx.tools.sortWinner} value={result.join(" · ")} />
          ) : (
            <p className="text-sm text-muted-foreground">{busy ? active : tx.tools.sortIdle}</p>
          )}
        </Stage>
        <ToolActions className="justify-end">
          <Button type="submit" disabled={busy}>{busy ? tx.tools.sortSpinning : tx.tools.draw}</Button>
        </ToolActions>
      </form>
    </ToolPanel>
  );
};

export const SorteadorRoletaTool = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const reduceMotion = useReducedMotion();
  const { later, clear } = useTimeouts();
  const [listInput, setListInput] = useState(DEFAULT_LIST);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState("");
  const items = useMemo(
    () => parseDrawList(listInput).slice(0, MAX_WHEEL_ITEMS),
    [listInput]
  );

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    clear();
    setError("");
    if (items.length < 2) {
      setError(tx.tools.sortWheelError);
      setWinner("");
      return;
    }
    const picked = pickOne(items);
    if (!picked) return;
    const index = items.indexOf(picked);
    const sweep = 360 / items.length;
    const landing = (-(index * sweep + sweep / 2) + 360) % 360;
    if (reduceMotion) {
      setRotation(landing);
      setWinner(picked);
      return;
    }
    setBusy(true);
    setWinner("");
    setSpinning(true);
    setRotation((prev) => {
      const current = ((prev % 360) + 360) % 360;
      const delta = (landing - current + 360) % 360;
      return prev + 360 * 7 + delta;
    });
    later(() => {
      setSpinning(false);
      setBusy(false);
      setWinner(picked);
    }, SPIN_MS);
  };

  return (
    <ToolPanel>
      <form className={toolStackClassName} onSubmit={handleSubmit}>
        <ListField id="wheel-list" value={listInput} onChange={setListInput} hint={tx.tools.sortWheelHint} />
        {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
        <Stage busy={busy} className="py-10">
          <RouletteWheel
            items={items.length >= 2 ? items : ["A", "B", "C", "D"]}
            rotation={rotation}
            spinning={spinning}
            winner={winner}
          />
        </Stage>
        <ToolActions className="justify-end">
          <Button type="submit" disabled={busy}>{busy ? tx.tools.sortSpinning : tx.tools.draw}</Button>
        </ToolActions>
      </form>
    </ToolPanel>
  );
};

export const SorteadorContagemTool = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const reduceMotion = useReducedMotion();
  const { later, clear } = useTimeouts();
  const [listInput, setListInput] = useState(DEFAULT_LIST);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [beat, setBeat] = useState<string | null>(null);
  const [winner, setWinner] = useState("");
  const items = useMemo(() => parseDrawList(listInput), [listInput]);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (busy) return;
    clear();
    setError("");
    const picked = pickOne(items);
    if (!picked) {
      setError(tx.tools.sortListError);
      setWinner("");
      return;
    }
    if (reduceMotion) {
      setWinner(picked);
      return;
    }
    setBusy(true);
    setWinner("");
    setBeat("3");
    later(() => setBeat("2"), 900);
    later(() => setBeat("1"), 1800);
    later(() => setBeat(tx.tools.sortGo), 2700);
    later(() => {
      setBeat(null);
      setBusy(false);
      setWinner(picked);
    }, 3600);
  };

  return (
    <ToolPanel>
      <form className={toolStackClassName} onSubmit={handleSubmit}>
        <ListField id="count-list" value={listInput} onChange={setListInput} hint={tx.tools.sortListHint} />
        {error ? <p className="text-sm text-destructive" role="alert">{error}</p> : null}
        <Stage busy={busy} className="min-h-64">
          <AnimatePresence mode="wait">
            {beat ? (
              <motion.p
                key={beat}
                initial={{ opacity: 0, scale: 0.55 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.2 }}
                transition={{ duration: durations.short, ease: easings.premium }}
                className="text-7xl sm:text-8xl font-medium tabular-nums tracking-tight"
              >
                {beat}
              </motion.p>
            ) : winner ? (
              <WinnerCard label={tx.tools.sortWinner} value={winner} />
            ) : (
              <p className="text-sm text-muted-foreground">{tx.tools.sortIdle}</p>
            )}
          </AnimatePresence>
        </Stage>
        <ToolActions className="justify-end">
          <Button type="submit" disabled={busy}>{busy ? tx.tools.sortSpinning : tx.tools.draw}</Button>
        </ToolActions>
      </form>
    </ToolPanel>
  );
};

/** Compat: slug antigo aponta para o sorteio de números. */
export const SorteadorTool = SorteadorNumerosTool;
