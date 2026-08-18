export type RescisaoMotivo =
  | "pedido_demissao"
  | "dispensa_justa_causa"
  | "dispensa_sem_justa_causa"
  | "fim_experiencia";

export interface RescisaoInput {
  salario: number;
  dependentes: number;
  inicio: Date;
  fim: Date;
  motivo: RescisaoMotivo;
  feriasVencidas: boolean;
  avisoCumprido: boolean;
}

export interface RescisaoBreakdown {
  saldoSalario: number;
  decimoTerceiro: number;
  feriasVencidas: number;
  feriasProporcionais: number;
  tercoConstitucional: number;
  avisoPrevio: number;
  multaFgts: number;
  total: number;
  mesesTrabalhados: number;
  avisoDias: number;
}

const diffMonths = (start: Date, end: Date): number => {
  let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
  if (end.getDate() < start.getDate()) months -= 1;
  return Math.max(0, months);
};

const diffDaysInMonth = (date: Date): number => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return date.getDate() / daysInMonth;
};

const yearsWorked = (start: Date, end: Date): number =>
  Math.max(0, end.getFullYear() - start.getFullYear());

export const calcularRescisao = (input: RescisaoInput): RescisaoBreakdown | null => {
  const { salario, inicio, fim, motivo, feriasVencidas, avisoCumprido } = input;
  if (salario <= 0 || Number.isNaN(inicio.getTime()) || Number.isNaN(fim.getTime()) || fim < inicio) {
    return null;
  }

  const mesesTrabalhados = diffMonths(inicio, fim);
  const anos = yearsWorked(inicio, fim);
  const avisoDias = Math.min(30 + anos * 3, 90);

  const saldoSalario = salario * diffDaysInMonth(fim);
  const decimoTerceiro = (salario / 12) * ((fim.getMonth() + 1) / 12);

  const mesesFerias = mesesTrabalhados % 12;
  const feriasProporcionais = (salario / 12) * mesesFerias;
  const feriasVencidasValor = feriasVencidas ? salario : 0;
  const baseTerco = feriasProporcionais + feriasVencidasValor;
  const tercoConstitucional = baseTerco / 3;

  let avisoPrevio = 0;
  if (!avisoCumprido) {
    if (motivo === "dispensa_sem_justa_causa" || motivo === "fim_experiencia") {
      avisoPrevio = (salario / 30) * avisoDias;
    } else if (motivo === "pedido_demissao") {
      avisoPrevio = salario;
    }
  }

  let multaFgts = 0;
  if (motivo === "dispensa_sem_justa_causa") {
    const fgtsEstimado = salario * 0.08 * Math.max(mesesTrabalhados, 1);
    multaFgts = fgtsEstimado * 0.4;
  }

  const total =
    saldoSalario +
    decimoTerceiro +
    feriasVencidasValor +
    feriasProporcionais +
    tercoConstitucional +
    avisoPrevio +
    multaFgts;

  return {
    saldoSalario,
    decimoTerceiro,
    feriasVencidas: feriasVencidasValor,
    feriasProporcionais,
    tercoConstitucional,
    avisoPrevio,
    multaFgts,
    total,
    mesesTrabalhados,
    avisoDias,
  };
};

export const formatCurrency = (value: number, lang: "pt" | "en"): string =>
  new Intl.NumberFormat(lang === "pt" ? "pt-BR" : "en-US", {
    style: "currency",
    currency: lang === "pt" ? "BRL" : "USD",
  }).format(value);
