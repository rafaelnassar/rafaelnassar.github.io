import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckRow,
  Field,
  ResultInline,
  SelectInput,
  ToolActions,
  ToolPanel,
  fieldClassName,
  toolStackClassName,
} from "@/components/tools/shared";
import {
  CREDIT_CARD_BRANDS,
  generateCreditCard,
  type CreditCardBrand,
} from "@/lib/tools/credit-card";
import { generateCep, BRAZILIAN_STATES as CEP_STATES } from "@/lib/tools/cep";
import { generatePhone } from "@/lib/tools/phone";
import {
  generateVehicle,
  VEHICLE_BRANDS,
  BRAZILIAN_STATES as VEHICLE_STATES,
} from "@/lib/tools/vehicle";
import type { BrazilianState } from "@/lib/tools/person";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

const QaDisclaimer = ({ text }: { text: string }) => (
  <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
);

export const CreditCardGenerator = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [brand, setBrand] = useState<CreditCardBrand>("visa");
  const [formatted, setFormatted] = useState(true);
  const [card, setCard] = useState(() => generateCreditCard("visa", true));

  const handleGenerate = (event?: FormEvent) => {
    event?.preventDefault();
    setCard(generateCreditCard(brand, formatted));
  };

  return (
    <ToolPanel>
      <form className={toolStackClassName} onSubmit={handleGenerate}>
        <Field id="card-brand" label={tx.tools.cardBrand}>
          <SelectInput
            id="card-brand"
            value={brand}
            onChange={(event) => setBrand(event.target.value as CreditCardBrand)}
          >
            {CREDIT_CARD_BRANDS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </SelectInput>
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <ResultInline label={tx.tools.cardNumber} value={card.formatted} />
          <ResultInline label={tx.tools.cardExpiry} value={card.expiry} />
          <ResultInline label={tx.tools.cardCvv} value={card.cvv} />
        </div>

        <QaDisclaimer text={tx.tools.cardDisclaimer} />

        <ToolActions className="justify-between">
          <CheckRow
            id="card-format"
            label={tx.tools.formatted}
            checked={formatted}
            onChange={(checked) => {
              setFormatted(checked);
              setCard(generateCreditCard(brand, checked));
            }}
          />
          <Button type="submit">{tx.tools.generate}</Button>
        </ToolActions>
      </form>
    </ToolPanel>
  );
};

export const VehicleGenerator = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [state, setState] = useState("");
  const [brandId, setBrandId] = useState("");
  const [mercosul, setMercosul] = useState(true);
  const [vehicle, setVehicle] = useState(() => generateVehicle());

  const handleGenerate = (event?: FormEvent) => {
    event?.preventDefault();
    setVehicle(
      generateVehicle({
        state: state ? (state as BrazilianState) : undefined,
        brandId: brandId || undefined,
        mercosul,
      })
    );
  };

  return (
    <ToolPanel>
      <form className={toolStackClassName} onSubmit={handleGenerate}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="vehicle-state" label={tx.tools.personState}>
            <SelectInput
              id="vehicle-state"
              value={state}
              onChange={(event) => setState(event.target.value)}
            >
              <option value="">{tx.tools.personAny}</option>
              {VEHICLE_STATES.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field id="vehicle-brand" label={tx.tools.vehicleBrand}>
            <SelectInput
              id="vehicle-brand"
              value={brandId}
              onChange={(event) => setBrandId(event.target.value)}
            >
              <option value="">{tx.tools.personAny}</option>
              {VEHICLE_BRANDS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </SelectInput>
          </Field>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ResultInline label={tx.tools.vehicleBrand} value={vehicle.brand} mono={false} />
          <ResultInline label={tx.tools.vehicleModel} value={vehicle.model} mono={false} />
          <ResultInline label={tx.tools.vehicleYear} value={String(vehicle.year)} />
          <ResultInline label={tx.tools.vehiclePlate} value={vehicle.plate} />
          <ResultInline label={tx.tools.vehicleRenavam} value={vehicle.renavam} />
          <ResultInline label={tx.tools.vehicleColor} value={vehicle.color} mono={false} />
          <ResultInline label={tx.tools.personState} value={vehicle.state} />
        </div>

        <QaDisclaimer text={tx.tools.vehicleDisclaimer} />

        <ToolActions className="justify-between">
          <CheckRow
            id="vehicle-mercosul"
            label={tx.tools.vehicleMercosul}
            checked={mercosul}
            onChange={setMercosul}
          />
          <Button type="submit">{tx.tools.generate}</Button>
        </ToolActions>
      </form>
    </ToolPanel>
  );
};

export const PhoneGenerator = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [state, setState] = useState("");
  const [mobile, setMobile] = useState<"any" | "mobile" | "landline">("any");
  const [formatted, setFormatted] = useState(true);
  const [phone, setPhone] = useState(() => generatePhone({ formatted: true }));

  const handleGenerate = (event?: FormEvent) => {
    event?.preventDefault();
    setPhone(
      generatePhone({
        state: state ? (state as BrazilianState) : undefined,
        mobile: mobile === "any" ? undefined : mobile === "mobile",
        formatted,
      })
    );
  };

  return (
    <ToolPanel>
      <form className={toolStackClassName} onSubmit={handleGenerate}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="phone-state" label={tx.tools.personState}>
            <SelectInput
              id="phone-state"
              value={state}
              onChange={(event) => setState(event.target.value)}
            >
              <option value="">{tx.tools.personAny}</option>
              {CEP_STATES.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </SelectInput>
          </Field>

          <Field id="phone-type" label={tx.tools.phoneType}>
            <SelectInput
              id="phone-type"
              value={mobile}
              onChange={(event) => setMobile(event.target.value as typeof mobile)}
            >
              <option value="any">{tx.tools.personAny}</option>
              <option value="mobile">{tx.tools.phoneMobile}</option>
              <option value="landline">{tx.tools.phoneLandline}</option>
            </SelectInput>
          </Field>
        </div>

        <ResultInline
          label={tx.tools.result}
          value={formatted ? phone.formatted : phone.number}
        />

        <ToolActions className="justify-between">
          <CheckRow
            id="phone-format"
            label={tx.tools.formatted}
            checked={formatted}
            onChange={setFormatted}
          />
          <Button type="submit">{tx.tools.generate}</Button>
        </ToolActions>
      </form>
    </ToolPanel>
  );
};

export const CepGenerator = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [state, setState] = useState("");
  const [formatted, setFormatted] = useState(true);
  const [cep, setCep] = useState(() => generateCep({ formatted: true }));

  const handleGenerate = (event?: FormEvent) => {
    event?.preventDefault();
    setCep(
      generateCep({
        state: state ? (state as BrazilianState) : undefined,
        formatted,
      })
    );
  };

  return (
    <ToolPanel>
      <form className={toolStackClassName} onSubmit={handleGenerate}>
        <Field id="cep-state" label={tx.tools.personState}>
          <SelectInput
            id="cep-state"
            value={state}
            onChange={(event) => setState(event.target.value)}
          >
            <option value="">{tx.tools.personAny}</option>
            {CEP_STATES.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </SelectInput>
        </Field>

        <div className="grid gap-3 sm:grid-cols-2">
          <ResultInline label={tx.tools.personZip} value={formatted ? cep.formatted : cep.cep} />
          <ResultInline label={tx.tools.personStreet} value={cep.street} mono={false} />
          <ResultInline label={tx.tools.personNeighborhood} value={cep.neighborhood} mono={false} />
          <ResultInline label={tx.tools.personCity} value={cep.city} mono={false} />
          <ResultInline label={tx.tools.personState} value={cep.state} />
        </div>

        <ToolActions className="justify-between">
          <CheckRow
            id="cep-format"
            label={tx.tools.formatted}
            checked={formatted}
            onChange={setFormatted}
          />
          <Button type="submit">{tx.tools.generate}</Button>
        </ToolActions>
      </form>
    </ToolPanel>
  );
};

