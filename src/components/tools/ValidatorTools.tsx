import { useMemo, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  StatusBanner,
  ToolActions,
  ToolPanel,
  fieldClassName,
  toolStackClassName,
} from "@/components/tools/shared";
import { CreditCardSplit, CreditCardVisual } from "@/components/tools/CreditCardVisual";
import {
  CREDIT_CARD_BRANDS,
  detectCardBrand,
  formatCardNumberInput,
  getBrandInfo,
  normalizeCardNumber,
  validateCreditCard,
} from "@/lib/tools/credit-card";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

export const CreditCardValidator = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [number, setNumber] = useState("");
  const [submittedEmpty, setSubmittedEmpty] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const digits = normalizeCardNumber(number);
  const detected = detectCardBrand(digits);
  const expectedLength = getBrandInfo(detected)?.length;

  const result = useMemo(
    () => (digits ? validateCreditCard(number) : null),
    [digits, number]
  );

  const isComplete = expectedLength
    ? digits.length >= expectedLength
    : digits.length >= 13;

  const message = submittedEmpty
    ? "empty"
    : !digits
      ? "idle"
      : !isComplete && !submitted
        ? "idle"
        : result?.valid
          ? "valid"
          : "invalid";

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!digits) {
      setSubmittedEmpty(true);
      setSubmitted(false);
      return;
    }
    setSubmittedEmpty(false);
    setSubmitted(true);
  };

  const validLabel = tx.tools.cardValid.replace(
    "{brand}",
    CREDIT_CARD_BRANDS.find((item) => item.id === result?.brand)?.label ??
      tx.tools.cardBrand
  );

  return (
    <ToolPanel>
      <form className={toolStackClassName} onSubmit={handleSubmit}>
        <CreditCardSplit
          form={
            <div className={toolStackClassName}>
              <Field id="validate-number" label={tx.tools.cardNumber}>
                <input
                  id="validate-number"
                  value={number}
                  onChange={(event) => {
                    setNumber(
                      formatCardNumberInput(
                        event.target.value,
                        detectCardBrand(event.target.value)
                      )
                    );
                    setSubmittedEmpty(false);
                    setSubmitted(false);
                  }}
                  inputMode="numeric"
                  autoComplete="off"
                  spellCheck={false}
                  className={fieldClassName}
                  aria-invalid={message === "invalid" || message === "empty"}
                  aria-describedby={
                    message === "idle" ? undefined : "validate-card-status"
                  }
                />
              </Field>

              <ToolActions>
                <Button type="submit" className="w-full sm:w-auto">
                  {tx.tools.validate}
                </Button>
              </ToolActions>

              {message === "empty" ? (
                <div id="validate-card-status">
                  <StatusBanner tone="error">{tx.tools.cardEmpty}</StatusBanner>
                </div>
              ) : null}
              {message === "valid" ? (
                <div id="validate-card-status">
                  <StatusBanner tone="success">{validLabel}</StatusBanner>
                </div>
              ) : null}
              {message === "invalid" ? (
                <div id="validate-card-status">
                  <StatusBanner tone="error">{tx.tools.cardInvalid}</StatusBanner>
                </div>
              ) : null}
            </div>
          }
          preview={
            <CreditCardVisual
              brand={detected}
              number={digits}
              details="number"
              previewLabel={tx.tools.cardPreview}
            />
          }
        />
      </form>
    </ToolPanel>
  );
};
