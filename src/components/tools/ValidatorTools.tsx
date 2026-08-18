import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  ResultInline,
  SegmentedControl,
  SelectInput,
  StatusBanner,
  ToolActions,
  ToolPanel,
  fieldClassName,
  toolStackClassName,
} from "@/components/tools/shared";
import {
  CREDIT_CARD_BRANDS,
  validateCreditCard,
  type CreditCardBrand,
} from "@/lib/tools/credit-card";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

export const CreditCardValidator = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [brand, setBrand] = useState<CreditCardBrand>("visa");
  const [value, setValue] = useState("");
  const [message, setMessage] = useState<"idle" | "empty" | "valid" | "invalid">("idle");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!value.trim()) {
      setMessage("empty");
      return;
    }
    const result = validateCreditCard(value, brand);
    setMessage(result.valid ? "valid" : "invalid");
  };

  return (
    <ToolPanel>
      <form className={toolStackClassName} onSubmit={handleSubmit}>
        <Field id="validate-brand" label={tx.tools.cardBrand}>
          <SelectInput
            id="validate-brand"
            value={brand}
            onChange={(event) => {
              setBrand(event.target.value as CreditCardBrand);
              setMessage("idle");
            }}
          >
            {CREDIT_CARD_BRANDS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </SelectInput>
        </Field>

        <Field id="validate-number" label={tx.tools.cardNumber}>
          <input
            id="validate-number"
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setMessage("idle");
            }}
            inputMode="numeric"
            autoComplete="off"
            className={fieldClassName}
            aria-invalid={message === "invalid" || message === "empty"}
          />
        </Field>

        <ToolActions>
          <Button type="submit">{tx.tools.validate}</Button>
        </ToolActions>

        {message === "empty" ? (
          <StatusBanner tone="error">{tx.tools.cardEmpty}</StatusBanner>
        ) : null}
        {message === "valid" ? (
          <StatusBanner tone="success">{tx.tools.cardValid}</StatusBanner>
        ) : null}
        {message === "invalid" ? (
          <StatusBanner tone="error">{tx.tools.cardInvalid}</StatusBanner>
        ) : null}
      </form>
    </ToolPanel>
  );
};
