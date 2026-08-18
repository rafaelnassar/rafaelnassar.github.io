import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  CheckRow,
  Field,
  ResultInline,
  SegmentedControl,
  SelectInput,
  StatusBanner,
  StatGrid,
  ToolActions,
  ToolPanel,
  fieldClassName,
  toolStackClassName,
} from "@/components/tools/shared";
import {
  calcularRescisao,
  formatCurrency,
  type RescisaoMotivo,
} from "@/lib/tools/rescisao";
import { useLang } from "@/lib/i18n";
import { t } from "@/data/translations";

export const RescisaoCalculator = () => {
  const { lang } = useLang();
  const tx = t(lang);
  const [salario, setSalario] = useState("");
  const [dependentes, setDependentes] = useState("0");
  const [inicio, setInicio] = useState("");
  const [fim, setFim] = useState("");
  const [motivo, setMotivo] = useState<RescisaoMotivo>("dispensa_sem_justa_causa");
  const [feriasVencidas, setFeriasVencidas] = useState(false);
  const [avisoCumprido, setAvisoCumprido] = useState(true);
  const [result, setResult] = useState<ReturnType<typeof calcularRescisao>>(null);
  const [error, setError] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const parsed = calcularRescisao({
      salario: Number(salario.replace(",", ".")),
      dependentes: Number(dependentes) || 0,
      inicio: new Date(inicio),
      fim: new Date(fim),
      motivo,
      feriasVencidas,
      avisoCumprido,
    });
    setResult(parsed);
    setError(!parsed);
  };

  return (
    <ToolPanel>
      <form className={toolStackClassName} onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="rescisao-salario" label={tx.tools.rescisaoSalario}>
            <input
              id="rescisao-salario"
              value={salario}
              onChange={(e) => setSalario(e.target.value)}
              inputMode="decimal"
              className={fieldClassName}
            />
          </Field>
          <Field id="rescisao-dependentes" label={tx.tools.rescisaoDependentes}>
            <input
              id="rescisao-dependentes"
              type="number"
              min={0}
              value={dependentes}
              onChange={(e) => setDependentes(e.target.value)}
              className={fieldClassName}
            />
          </Field>
          <Field id="rescisao-inicio" label={tx.tools.rescisaoInicio}>
            <input
              id="rescisao-inicio"
              type="date"
              value={inicio}
              onChange={(e) => setInicio(e.target.value)}
              className={fieldClassName}
            />
          </Field>
          <Field id="rescisao-fim" label={tx.tools.rescisaoFim}>
            <input
              id="rescisao-fim"
              type="date"
              value={fim}
              onChange={(e) => setFim(e.target.value)}
              className={fieldClassName}
            />
          </Field>
        </div>

        <Field id="rescisao-motivo" label={tx.tools.rescisaoMotivo}>
          <SelectInput
            id="rescisao-motivo"
            value={motivo}
            onChange={(e) => setMotivo(e.target.value as RescisaoMotivo)}
          >
            <option value="pedido_demissao">{tx.tools.rescisaoPedido}</option>
            <option value="dispensa_justa_causa">{tx.tools.rescisaoJustaCausa}</option>
            <option value="dispensa_sem_justa_causa">{tx.tools.rescisaoSemJusta}</option>
            <option value="fim_experiencia">{tx.tools.rescisaoExperiencia}</option>
          </SelectInput>
        </Field>

        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <CheckRow
            id="rescisao-ferias"
            label={tx.tools.rescisaoFeriasVencidas}
            checked={feriasVencidas}
            onChange={setFeriasVencidas}
          />
          <CheckRow
            id="rescisao-aviso"
            label={tx.tools.rescisaoAvisoCumprido}
            checked={avisoCumprido}
            onChange={setAvisoCumprido}
          />
        </div>

        <StatusBanner tone="neutral">{tx.tools.rescisaoDisclaimer}</StatusBanner>

        <ToolActions>
          <Button type="submit">{tx.tools.calculate}</Button>
        </ToolActions>

        {error ? <StatusBanner tone="error">{tx.tools.rescisaoError}</StatusBanner> : null}

        {result ? (
          <div className="space-y-4">
            <StatGrid
              items={[
                { label: tx.tools.rescisaoSaldo, value: formatCurrency(result.saldoSalario, lang) },
                { label: tx.tools.rescisaoDecimo, value: formatCurrency(result.decimoTerceiro, lang) },
                { label: tx.tools.rescisaoFeriasProp, value: formatCurrency(result.feriasProporcionais, lang) },
                { label: tx.tools.rescisaoTerco, value: formatCurrency(result.tercoConstitucional, lang) },
                { label: tx.tools.rescisaoAviso, value: formatCurrency(result.avisoPrevio, lang) },
                { label: tx.tools.rescisaoFgts, value: formatCurrency(result.multaFgts, lang) },
              ]}
            />
            <ResultInline
              label={tx.tools.rescisaoTotal}
              value={formatCurrency(result.total, lang)}
            />
          </div>
        ) : null}
      </form>
    </ToolPanel>
  );
};
