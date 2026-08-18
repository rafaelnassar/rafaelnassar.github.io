import { useMemo, useState, type FormEvent, type ReactNode } from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

import {

  CheckRow,

  Field,

  ResultBlock,

  ResultInline,

  SegmentedControl,

  SelectInput,

  StatusBanner,

  ToolActions,

  ToolPanel,

  fieldClassName,

  toolStackClassName,

} from "@/components/tools/shared";

import { formatCpf, generateCpf, isValidCpf } from "@/lib/tools/cpf";

import { formatCnpj, generateCnpj, isValidCnpj } from "@/lib/tools/cnpj";

import {

  BRAZILIAN_STATES,

  generatePeople,

  getCitiesForState,

  type BrazilianState,

  type GenderOption,

  type GeneratedPerson,

} from "@/lib/tools/person";

import { useLang } from "@/lib/i18n";

import { t } from "@/data/translations";

import { cn } from "@/lib/utils";



const DocDisclaimer = () => {

  const { lang } = useLang();

  const tx = t(lang);

  return (

    <p className="text-xs text-muted-foreground leading-relaxed">

      {tx.tools.docDisclaimer}

    </p>

  );

};



export const DocumentGenerator = () => {

  const { lang } = useLang();

  const tx = t(lang);

  const [kind, setKind] = useState<"cpf" | "cnpj">("cpf");

  const [formatted, setFormatted] = useState(true);

  const [value, setValue] = useState(() => formatCpf(generateCpf()));



  const handleGenerate = (nextKind: "cpf" | "cnpj" = kind) => {

    const next = nextKind === "cpf" ? generateCpf() : generateCnpj();

    setValue(

      formatted

        ? nextKind === "cpf"

          ? formatCpf(next)

          : formatCnpj(next)

        : next

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

        <SegmentedControl

          legend={tx.tools.options}

          value={kind}

          onChange={(next) => {

            setKind(next);

            handleGenerate(next);

          }}

          options={[

            { value: "cpf", label: tx.tools.cpfLabel },

            { value: "cnpj", label: tx.tools.cnpjLabel },

          ]}

        />



        <ResultInline

          label={kind === "cpf" ? tx.tools.cpfLabel : tx.tools.cnpjLabel}

          value={value}

        />

        <DocDisclaimer />

        <ToolActions className="justify-between">

          <CheckRow

            id="doc-format"

            label={tx.tools.formatted}

            checked={formatted}

            onChange={(checked) => {

              setFormatted(checked);

              const digits = value.replace(/\D/g, "");

              setValue(

                checked

                  ? kind === "cpf"

                    ? formatCpf(digits)

                    : formatCnpj(digits)

                  : digits

              );

            }}

          />

          <Button type="submit">{tx.tools.generate}</Button>

        </ToolActions>

      </form>

    </ToolPanel>

  );

};



export const DocumentValidator = () => {

  const { lang } = useLang();

  const tx = t(lang);

  const [kind, setKind] = useState<"cpf" | "cnpj">("cpf");

  const [value, setValue] = useState("");

  const [message, setMessage] = useState<"idle" | "empty" | "valid" | "invalid">("idle");



  const handleSubmit = (event: FormEvent) => {

    event.preventDefault();

    if (!value.trim()) {

      setMessage("empty");

      return;

    }

    const ok = kind === "cpf" ? isValidCpf(value) : isValidCnpj(value);

    setMessage(ok ? "valid" : "invalid");

  };



  return (

    <ToolPanel>

      <form className={toolStackClassName} onSubmit={handleSubmit}>

        <SegmentedControl

          legend={tx.tools.options}

          value={kind}

          onChange={(next) => {

            setKind(next);

            setMessage("idle");

          }}

          options={[

            { value: "cpf", label: tx.tools.cpfLabel },

            { value: "cnpj", label: tx.tools.cnpjLabel },

          ]}

        />



        <div className="flex gap-2">

          <input

            id="doc-number"

            aria-label={kind === "cpf" ? tx.tools.cpfLabel : tx.tools.cnpjLabel}

            value={value}

            onChange={(event) => {

              setValue(event.target.value);

              setMessage("idle");

            }}

            inputMode="numeric"

            autoComplete="off"

            className={cn(fieldClassName, "flex-1 min-w-0")}

            aria-invalid={message === "empty" || message === "invalid"}

          />

          <Button type="submit">{tx.tools.validate}</Button>

        </div>



        <DocDisclaimer />



        {message === "empty" ? (

          <StatusBanner tone="error">{tx.tools.docEmpty}</StatusBanner>

        ) : null}

        {message === "valid" ? (

          <StatusBanner tone="success">{tx.tools.docValid}</StatusBanner>

        ) : null}

        {message === "invalid" ? (

          <StatusBanner tone="error">{tx.tools.docInvalid}</StatusBanner>

        ) : null}

      </form>

    </ToolPanel>

  );

};



const PersonSection = ({

  title,

  children,

}: {

  title: string;

  children: ReactNode;

}) => (

  <section className="space-y-3">

    <h3 className="text-sm font-semibold tracking-tight">{title}</h3>

    <div className="grid gap-3 sm:grid-cols-2">{children}</div>

  </section>

);



const PersonFields = ({ person, tx }: { person: GeneratedPerson; tx: ReturnType<typeof t> }) => (

  <div className="space-y-6">

    <PersonSection title={tx.tools.personSectionPersonal}>

      <ResultInline label={tx.tools.personName} value={person.name} mono={false} />

      <ResultInline label={tx.tools.cpfLabel} value={person.cpf} />

      <ResultInline label={tx.tools.personRg} value={person.rg} />

      <ResultInline label={tx.tools.personBirthDate} value={person.birthDate} />

      <ResultInline

        label={tx.tools.personGender}

        value={person.gender === "male" ? tx.tools.personMale : tx.tools.personFemale}

        mono={false}

      />

      <ResultInline label={tx.tools.personZodiac} value={person.zodiacSign} mono={false} />

    </PersonSection>



    <PersonSection title={tx.tools.personSectionParents}>

      <ResultInline label={tx.tools.personMother} value={person.mother} mono={false} />

      <ResultInline label={tx.tools.personFather} value={person.father} mono={false} />

    </PersonSection>



    <PersonSection title={tx.tools.personSectionOnline}>

      <ResultInline label={tx.tools.personEmail} value={person.email} />

      <ResultInline label={tx.tools.password} value={person.password} />

    </PersonSection>



    <PersonSection title={tx.tools.personSectionAddress}>

      <ResultInline label={tx.tools.personZip} value={person.zipCode} />

      <ResultInline label={tx.tools.personStreet} value={person.street} mono={false} />

      <ResultInline label={tx.tools.personNumber} value={person.number} />

      <ResultInline label={tx.tools.personNeighborhood} value={person.neighborhood} mono={false} />

      <ResultInline label={tx.tools.personCity} value={person.city} mono={false} />

      <ResultInline label={tx.tools.personState} value={person.state} />

    </PersonSection>



    <PersonSection title={tx.tools.personSectionPhones}>

      <ResultInline label={tx.tools.personPhone} value={person.phone} />

      <ResultInline label={tx.tools.personMobile} value={person.mobile} />

    </PersonSection>



    <PersonSection title={tx.tools.personSectionPhysical}>

      <ResultInline label={tx.tools.personHeight} value={person.height} />

      <ResultInline label={tx.tools.personWeight} value={person.weight} />

      <ResultInline label={tx.tools.personBloodType} value={person.bloodType} />

    </PersonSection>



    <PersonSection title={tx.tools.personSectionOther}>

      <ResultInline label={tx.tools.personFavoriteColor} value={person.favoriteColor} mono={false} />

    </PersonSection>

  </div>

);



export const PersonGenerator = () => {

  const { lang } = useLang();

  const tx = t(lang);

  const [gender, setGender] = useState<GenderOption>("random");

  const [age, setAge] = useState("");

  const [state, setState] = useState("");

  const [city, setCity] = useState("");

  const [formatted, setFormatted] = useState(true);

  const [count, setCount] = useState("1");
  const [people, setPeople] = useState<GeneratedPerson[]>([]);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [index, setIndex] = useState(0);



  const cities = useMemo(

    () => (state ? getCitiesForState(state as BrazilianState) : []),

    [state]

  );



  const jsonOutput = useMemo(() => JSON.stringify(people, null, 2), [people]);



  const handleGenerate = () => {

    const parsedCount = Math.min(Math.max(Number(count) || 1, 1), 30);

    const next = generatePeople({

      gender,

      age: age ? Number(age) : undefined,

      state: state ? (state as BrazilianState) : undefined,

      city: city || undefined,

      formatted,

      count: parsedCount,

      lang,

    });

    setPeople(next);
    setHasGenerated(true);
    setIndex(0);
  };



  return (
    <div className={toolStackClassName}>
      <ToolPanel>
        <form
          className={toolStackClassName}
          onSubmit={(event) => {
            event.preventDefault();
            handleGenerate();
          }}
        >
          <h2 className="text-base font-semibold tracking-tight">{tx.tools.options}</h2>

          <SegmentedControl
            legend={tx.tools.personGenderPrompt}
            value={gender}
            onChange={setGender}
            options={[
              { value: "male", label: tx.tools.personMale },
              { value: "female", label: tx.tools.personFemale },
              { value: "random", label: tx.tools.personRandom },
            ]}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="person-age" label={tx.tools.personAge} hint={tx.tools.personAgeHint}>
              <SelectInput
                id="person-age"
                value={age}
                onChange={(event) => setAge(event.target.value)}
              >
                <option value="">{tx.tools.personAny}</option>
                {Array.from({ length: 63 }, (_, i) => i + 18).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </SelectInput>
            </Field>

            <Field id="person-count" label={tx.tools.personCount} hint={tx.tools.personCountHint}>
              <input
                id="person-count"
                type="number"
                min={1}
                max={30}
                value={count}
                onChange={(event) => setCount(event.target.value)}
                className={fieldClassName}
              />
            </Field>

            <Field id="person-state" label={tx.tools.personState}>
              <SelectInput
                id="person-state"
                value={state}
                onChange={(event) => {
                  setState(event.target.value);
                  setCity("");
                }}
              >
                <option value="">{tx.tools.personAny}</option>
                {BRAZILIAN_STATES.map((uf) => (
                  <option key={uf} value={uf}>
                    {uf}
                  </option>
                ))}
              </SelectInput>
            </Field>

            <Field id="person-city" label={tx.tools.personCity}>
              <SelectInput
                id="person-city"
                value={city}
                disabled={!state}
                onChange={(event) => setCity(event.target.value)}
              >
                <option value="">{tx.tools.personAny}</option>
                {cities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </SelectInput>
            </Field>
          </div>

          <CheckRow
            id="person-format"
            label={tx.tools.formatted}
            checked={formatted}
            onChange={setFormatted}
          />

          <DocDisclaimer />

          <ToolActions>
            <Button type="submit">{tx.tools.personGenerate}</Button>
          </ToolActions>
        </form>
      </ToolPanel>

      {hasGenerated && people.length > 0 ? (
        <ToolPanel>
          <div className={toolStackClassName} aria-live="polite">
            <h2 className="text-base font-semibold tracking-tight">{tx.tools.result}</h2>

            {people.length > 1 ? (
              <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-secondary/30 px-3 py-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={index === 0}
                  onClick={() => setIndex((current) => Math.max(0, current - 1))}
                  aria-label={tx.tools.personPrevious}
                >
                  <ChevronLeft className="size-4" aria-hidden />
                </Button>
                <p className="text-sm text-muted-foreground tabular-nums">
                  {index + 1} / {people.length}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  disabled={index >= people.length - 1}
                  onClick={() => setIndex((current) => Math.min(people.length - 1, current + 1))}
                  aria-label={tx.tools.personNext}
                >
                  <ChevronRight className="size-4" aria-hidden />
                </Button>
              </div>
            ) : null}

            {people[index] ? <PersonFields person={people[index]} tx={tx} /> : null}
          </div>
        </ToolPanel>
      ) : null}

      {hasGenerated && people.length > 0 ? (
        <ToolPanel>
          <ResultBlock label={tx.tools.personJson} value={jsonOutput} />
        </ToolPanel>
      ) : null}
    </div>
  );

};


