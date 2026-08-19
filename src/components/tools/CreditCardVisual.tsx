import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion, useSpring } from "framer-motion";
import { CopyButton } from "@/components/tools/shared";
import {
  CREDIT_CARD_BRANDS,
  CARD_NUMBER_PLACEHOLDER,
  displayCardNumberGroups,
  formatCardNumber,
  normalizeCardNumber,
  type CreditCardBrand,
} from "@/lib/tools/credit-card";
import { durations, easings, springs } from "@/lib/motion";
import { cn, focusRing } from "@/lib/utils";
import visaMark from "@/assets/card-brands/visa.svg";
import mastercardMark from "@/assets/card-brands/mastercard.svg";
import amexMark from "@/assets/card-brands/amex.svg";
import dinersMark from "@/assets/card-brands/diners.svg";
import discoverMark from "@/assets/card-brands/discover.svg";
import eloMark from "@/assets/card-brands/elo.svg";
import hipercardMark from "@/assets/card-brands/hipercard.svg";

interface CreditCardVisualProps {
  brand: CreditCardBrand | null;
  number: string;
  holder?: string;
  expiry?: string;
  cvv?: string;
  details?: "full" | "number";
  interactive?: boolean;
  revealKey?: string;
  holderLabel?: string;
  expiryLabel?: string;
  holderPlaceholder?: string;
  expiryPlaceholder?: string;
  previewLabel: string;
  flipHint?: string;
  flipToBack?: string;
  flipToFront?: string;
  copyable?: boolean;
  copyLabels?: {
    number: string;
    holder: string;
    expiry: string;
    cvv: string;
  };
  className?: string;
}

interface BrandTheme {
  from: string;
  via: string;
  to: string;
  number: string;
  muted: string;
  glow: string;
}

const THEMES: Record<CreditCardBrand | "unknown", BrandTheme> = {
  visa: {
    from: "#0b2c74",
    via: "#0e4595",
    to: "#0a2464",
    number: "#ffffff",
    muted: "rgba(255,255,255,0.5)",
    glow: "rgba(14, 69, 149, 0.42)",
  },
  mastercard: {
    from: "#141414",
    via: "#1c1c1c",
    to: "#0a0a0a",
    number: "#ffffff",
    muted: "rgba(255,255,255,0.5)",
    glow: "rgba(235, 0, 27, 0.28)",
  },
  amex: {
    from: "#0157b0",
    via: "#016fd0",
    to: "#014a96",
    number: "#ffffff",
    muted: "rgba(255,255,255,0.55)",
    glow: "rgba(1, 111, 208, 0.42)",
  },
  diners: {
    from: "#005c96",
    via: "#0079be",
    to: "#004e80",
    number: "#ffffff",
    muted: "rgba(255,255,255,0.52)",
    glow: "rgba(0, 121, 190, 0.4)",
  },
  discover: {
    from: "#3a3a3a",
    via: "#4a4a4a",
    to: "#2a2a2a",
    number: "#ffffff",
    muted: "rgba(255,255,255,0.5)",
    glow: "rgba(255, 102, 0, 0.28)",
  },
  elo: {
    from: "#101010",
    via: "#171717",
    to: "#050505",
    number: "#ffffff",
    muted: "rgba(255,255,255,0.5)",
    glow: "rgba(255, 203, 5, 0.26)",
  },
  hipercard: {
    from: "#8e0e16",
    via: "#b3131b",
    to: "#6f0b11",
    number: "#ffffff",
    muted: "rgba(255,255,255,0.55)",
    glow: "rgba(179, 19, 27, 0.4)",
  },
  unknown: {
    from: "#2a303c",
    via: "#3a4252",
    to: "#1e242e",
    number: "#ffffff",
    muted: "rgba(255,255,255,0.45)",
    glow: "rgba(58, 66, 82, 0.35)",
  },
};

const BRAND_MARKS: Record<
  CreditCardBrand,
  { src: string; className: string; onLight?: boolean }
> = {
  visa: { src: visaMark, className: "h-7" },
  mastercard: { src: mastercardMark, className: "h-9" },
  amex: { src: amexMark, className: "h-6" },
  diners: { src: dinersMark, className: "h-9" },
  discover: { src: discoverMark, className: "h-7" },
  elo: { src: eloMark, className: "h-8" },
  hipercard: { src: hipercardMark, className: "h-6", onLight: true },
};

const CARD_WIDTH = "w-full max-w-[23.5rem]";

const brandLabel = (brand: CreditCardBrand | null): string =>
  CREDIT_CARD_BRANDS.find((item) => item.id === brand)?.label ?? "";

const ContactlessMark = () => (
  <svg viewBox="0 0 24 24" className="size-6 text-white/80" aria-hidden>
    <path
      d="M9 7.2c3.2-2.4 7.6-2.4 10.8 0M10.6 10.2c2.2-1.6 5.2-1.6 7.4 0M12.2 13.2c1.2-.9 2.8-.9 4 0"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.7"
    />
  </svg>
);

const Chip = () => (
  <div
    className="relative h-9 w-12 overflow-hidden rounded-[0.4rem] shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(0,0,0,0.25)]"
    aria-hidden
  >
    <div className="absolute inset-0 bg-gradient-to-br from-amber-100 via-yellow-400 to-amber-700" />
    <div className="absolute inset-0 bg-gradient-to-t from-amber-900/30 to-transparent" />
    <div className="absolute inset-[3px] grid grid-cols-3 overflow-hidden rounded-[0.22rem] border border-amber-900/30">
      <span className="border-r border-amber-900/25" />
      <span className="border-r border-amber-900/25" />
      <span />
      <span className="col-span-3 border-t border-amber-900/25" />
    </div>
    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-amber-900/30" />
  </div>
);

const BrandMark = ({ brand }: { brand: CreditCardBrand }) => {
  const mark = BRAND_MARKS[brand];
  const image = (
    <img
      src={mark.src}
      alt=""
      className={cn("block w-auto max-w-[6.75rem] object-contain object-right", mark.className)}
      aria-hidden
    />
  );

  if (!mark.onLight) return image;

  return (
    <span className="inline-flex items-center rounded-sm bg-white px-1.5 py-0.5">
      {image}
    </span>
  );
};

const CardSheen = ({ shineKey, reduceMotion }: { shineKey?: string; reduceMotion: boolean }) => (
  <>
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit]"
      aria-hidden
      style={{
        background:
          "linear-gradient(115deg, rgba(255,255,255,0.24) 0%, rgba(255,255,255,0.05) 26%, transparent 48%, rgba(255,255,255,0.08) 100%)",
      }}
    />
    <div
      className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.07] mix-blend-overlay"
      aria-hidden
      style={{
        backgroundImage:
          "repeating-conic-gradient(from 20deg, rgba(255,255,255,0.35) 0deg, transparent 12deg, rgba(0,0,0,0.2) 20deg, transparent 32deg)",
      }}
    />
    {!reduceMotion && shineKey ? (
      <motion.div
        key={shineKey}
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent"
          initial={{ x: "-90%", skewX: -18 }}
          animate={{ x: "320%" }}
          transition={{ duration: durations.xlong, ease: easings.smooth, delay: durations.medium }}
        />
      </motion.div>
    ) : null}
  </>
);

const NumberGroups = ({
  number,
  brand,
  color,
  muted,
}: {
  number: string;
  brand: CreditCardBrand | null;
  color: string;
  muted: string;
}) => {
  const groups = displayCardNumberGroups(number, brand);

  return (
    <p
      className="flex w-full min-w-0 items-baseline justify-between gap-2 font-mono font-medium tabular-nums whitespace-nowrap text-[1.05rem] tracking-[0.14em] sm:text-[1.18rem] sm:tracking-[0.16em]"
      style={{ textShadow: "0 1px 0 rgba(0,0,0,0.22)" }}
    >
      {groups.map((group, groupIndex) => (
        <span key={groupIndex} className="shrink-0">
          {group.split("").map((char, charIndex) => (
            <span
              key={`${groupIndex}-${charIndex}`}
              style={{ color: char === CARD_NUMBER_PLACEHOLDER ? muted : color }}
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </p>
  );
};

const stopCardGesture = (event: { stopPropagation: () => void }) => {
  event.stopPropagation();
};

const CardCopy = ({ value, label }: { value: string; label: string }) => (
  <span onClick={stopCardGesture} onKeyDown={stopCardGesture} className="shrink-0">
    <CopyButton value={value} label={label} tone="onDark" className="!p-1.5" />
  </span>
);

const CardFaceShell = ({
  theme,
  children,
  className,
}: {
  theme: BrandTheme;
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "absolute inset-0 overflow-hidden rounded-[1.15rem] p-5 text-white shadow-lg shadow-black/25 ring-1 ring-white/15",
      className
    )}
    style={{
      background: `linear-gradient(148deg, ${theme.from} 0%, ${theme.via} 46%, ${theme.to} 100%)`,
    }}
  >
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-t-[inherit] opacity-40"
      aria-hidden
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.16), transparent)",
      }}
    />
    {children}
  </div>
);

export const CreditCardVisual = ({
  brand,
  number,
  holder = "",
  expiry = "",
  cvv = "",
  details = "full",
  interactive = false,
  revealKey,
  holderLabel = "",
  expiryLabel = "",
  holderPlaceholder = "",
  expiryPlaceholder = "",
  previewLabel,
  flipHint,
  flipToBack,
  flipToFront,
  copyable = false,
  copyLabels,
  className,
}: CreditCardVisualProps) => {
  const reduceMotion = Boolean(useReducedMotion());
  const [angle, setAngle] = useState(0);
  const [spinDuration, setSpinDuration] = useState(durations.long);
  const [shineKey, setShineKey] = useState<string>();
  const skipReveal = useRef(true);
  const tiltX = useSpring(0, { stiffness: springs.gentle.stiffness, damping: springs.gentle.damping });
  const tiltY = useSpring(0, { stiffness: springs.gentle.stiffness, damping: springs.gentle.damping });
  const theme = THEMES[brand ?? "unknown"];
  const detectedLabel = brandLabel(brand);
  const digits = normalizeCardNumber(number);
  const lastFour = digits.length >= 4 ? digits.slice(-4) : "";
  const label = detectedLabel
    ? lastFour
      ? `${previewLabel} ${detectedLabel}, ${lastFour}`
      : `${previewLabel} ${detectedLabel}`
    : previewLabel;
  const showBack = details === "full" && Math.round(angle / 180) % 2 === 1;
  const holderText = holder.trim().toUpperCase();
  const showFooter = details === "full";
  const formattedNumber = formatCardNumber(digits, brand);
  const copies =
    copyable && copyLabels
      ? {
          number: <CardCopy value={formattedNumber || digits} label={copyLabels.number} />,
          holder: <CardCopy value={holderText} label={copyLabels.holder} />,
          expiry: <CardCopy value={expiry} label={copyLabels.expiry} />,
        }
      : null;

  useEffect(() => {
    if (!interactive || details !== "full" || revealKey == null) return;
    if (skipReveal.current) {
      skipReveal.current = false;
      return;
    }
    setShineKey(revealKey);
    setSpinDuration(reduceMotion ? 0 : durations.xlong);
    setAngle((current) =>
      reduceMotion ? Math.round(current / 360) * 360 : (Math.floor(current / 360) + 1) * 360
    );
  }, [details, interactive, reduceMotion, revealKey]);

  const flip = () => {
    if (!interactive || details !== "full") return;
    setSpinDuration(reduceMotion ? 0 : 0.64);
    setAngle((current) => current + 180);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(py * -6);
    tiltY.set(px * 8);
  };

  const resetTilt = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const front = (
    <CardFaceShell theme={theme}>
      <CardSheen shineKey={showFooter ? shineKey : undefined} reduceMotion={reduceMotion} />
      <div className="relative z-10 flex h-full min-w-0 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Chip />
            <ContactlessMark />
          </div>
          <div className="flex min-h-10 min-w-[5.5rem] max-w-[7.25rem] shrink-0 items-center justify-end overflow-visible">
            <AnimatePresence mode="wait">
              {brand ? (
                <motion.div
                  key={brand}
                  initial={reduceMotion ? false : { opacity: 0, y: 4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: 4, scale: 0.96 }}
                  transition={{ duration: durations.short, ease: easings.smooth }}
                >
                  <BrandMark brand={brand} />
                </motion.div>
              ) : (
                <motion.span
                  key="empty-brand"
                  initial={reduceMotion ? false : { opacity: 0 }}
                  animate={{ opacity: 0.28 }}
                  className="text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-white"
                >
                  {detectedLabel}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div
          className={cn(
            "relative min-w-0",
            showFooter ? "mt-auto" : "my-auto",
            copies && "pr-8"
          )}
        >
          <div className="min-w-0 overflow-hidden">
            <NumberGroups number={number} brand={brand} color={theme.number} muted={theme.muted} />
          </div>
          {copies ? (
            <span className="absolute -right-1 top-1/2 z-10 -translate-y-1/2 rounded-md bg-black/20 backdrop-blur-[2px]">
              {copies.number}
            </span>
          ) : null}
        </div>

        {showFooter ? (
          <div className="mt-auto flex items-end justify-between gap-5 pt-4">
            <div className="min-w-0 flex-1">
              <p className="mb-1 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-white/55">
                {holderLabel}
              </p>
              <div className={cn("relative min-w-0", copies && "pr-7")}>
                <p
                  className={cn(
                    "truncate text-[0.92rem] font-medium uppercase tracking-wide",
                    holderText ? "text-white" : "text-white/35"
                  )}
                  title={holderText || undefined}
                >
                  {holderText || holderPlaceholder}
                </p>
                {copies ? (
                  <span className="absolute -right-1 top-1/2 -translate-y-1/2">{copies.holder}</span>
                ) : null}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <p className="mb-1 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-white/55">
                {expiryLabel}
              </p>
              <div className={cn("relative whitespace-nowrap", copies && "pr-7")}>
                <p
                  className={cn(
                    "font-mono text-[0.92rem] tabular-nums tracking-wider",
                    expiry ? "text-white" : "text-white/35"
                  )}
                >
                  {expiry || expiryPlaceholder}
                </p>
                {copies ? (
                  <span className="absolute -right-1 top-1/2 -translate-y-1/2">{copies.expiry}</span>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </CardFaceShell>
  );

  const back = (
    <CardFaceShell theme={theme}>
      <CardSheen reduceMotion={reduceMotion} />
      <div className="relative z-10 flex h-full flex-col">
        <div className="-mx-5 mt-1 h-11 bg-black/85 shadow-inner" aria-hidden />
        <div className="mt-6 flex items-stretch gap-3">
          <div
            className="h-12 flex-1 rounded-sm bg-gradient-to-r from-white/92 via-white/78 to-white/88"
            aria-hidden
          />
          <div className="flex min-w-[6rem] items-center justify-between gap-2 rounded-md bg-white px-2.5 py-1.5">
            <div className="text-left">
              <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-neutral-500">
                CVV
              </p>
              <p className="font-mono text-base font-semibold tabular-nums tracking-[0.18em] text-neutral-900">
                {cvv || "•••"}
              </p>
            </div>
            {copyable && copyLabels ? (
              <span onClick={stopCardGesture} onKeyDown={stopCardGesture}>
                <CopyButton
                  value={cvv}
                  label={copyLabels.cvv}
                  className="text-neutral-700 hover:bg-neutral-200 hover:text-neutral-900"
                />
              </span>
            ) : null}
          </div>
        </div>
        <p className="mt-auto text-[0.65rem] uppercase tracking-[0.18em] text-white/40">
          {detectedLabel}
        </p>
      </div>
    </CardFaceShell>
  );

  const cardBody = (
    <div className="relative">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-8 -bottom-1 top-10 -z-10 rounded-full blur-2xl transition-[background] duration-500"
        style={{ background: theme.glow }}
      />
      <div
        className="[perspective:1800px]"
        onPointerMove={handlePointerMove}
        onPointerLeave={resetTilt}
      >
        <motion.div
          className="origin-center will-change-transform [transform-style:preserve-3d]"
          style={{ rotateX: tiltX, rotateY: tiltY }}
        >
          <motion.div
            className="relative aspect-[1.586] w-full select-none will-change-transform [transform-style:preserve-3d] [-webkit-transform-style:preserve-3d]"
            animate={{ rotateY: angle }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: spinDuration, ease: easings.premium }
            }
          >
            {reduceMotion ? (
              showBack ? back : front
            ) : (
              <>
                <div
                  aria-hidden={showBack}
                  inert={showBack ? true : undefined}
                  className="absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]"
                >
                  {front}
                </div>
                {details === "full" ? (
                  <div
                    aria-hidden={!showBack}
                    inert={!showBack ? true : undefined}
                    className="absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]"
                  >
                    {back}
                  </div>
                ) : null}
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );

  if (interactive && details === "full") {
    const actionLabel = showBack ? flipToFront : flipToBack;

    return (
      <figure aria-label={label} className={cn(CARD_WIDTH, "space-y-3", className)}>
        <div className="cursor-pointer rounded-[1.15rem]" onClick={flip}>
          {cardBody}
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <button
            type="button"
            onClick={flip}
            aria-pressed={showBack}
            className={cn(
              "rounded-md px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer",
              focusRing
            )}
          >
            {actionLabel}
          </button>
          {flipHint ? (
            <p className="text-center text-xs text-muted-foreground leading-relaxed">
              {flipHint}
            </p>
          ) : null}
        </div>
      </figure>
    );
  }

  return (
    <figure className={cn(CARD_WIDTH, className)} aria-label={label}>
      {cardBody}
    </figure>
  );
};

export const CreditCardSplit = ({
  form,
  preview,
}: {
  form: ReactNode;
  preview: ReactNode;
}) => (
  <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20.5rem,23.5rem)] lg:gap-8">
    <div className="order-2 lg:order-1">{form}</div>
    <div className="order-1 flex justify-center lg:sticky lg:top-24 lg:order-2 lg:justify-end">
      {preview}
    </div>
  </div>
);
