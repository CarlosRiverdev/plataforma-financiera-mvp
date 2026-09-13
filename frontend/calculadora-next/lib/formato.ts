/** Formato de números y validación de campos, en un solo lugar. */

const moneda = new Intl.NumberFormat("es-BO", {
  style: "currency",
  currency: "BOB",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const numero = new Intl.NumberFormat("es-BO", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const compacto = new Intl.NumberFormat("es-BO", {
  notation: "compact",
  maximumFractionDigits: 1,
});

/** "Bs 18.500,00" */
export const bs = (n: number): string => moneda.format(n);

/** "8,50 %" */
export const pct = (n: number): string => numero.format(n) + " %";

/** "Bs 18,5 mil" — para las etiquetas del eje de las gráficas. */
export const bsCompacto = (n: number): string => "Bs " + compacto.format(n);

export interface ReglaCampo {
  min?: number;
  max?: number;
  entero?: boolean;
  mensajeMin?: string;
  mensajeMax?: string;
}

/**
 * Valida el texto de un campo numérico.
 * Devuelve el número si es válido, o un mensaje de error si no lo es.
 */
export function validarNumero(
  bruto: string,
  reglas: ReglaCampo,
): { valor: number; error: null } | { valor: null; error: string } {
  const texto = bruto.trim();
  if (texto === "") return { valor: null, error: "Escribe un valor." };

  const valor = Number(texto);
  if (Number.isNaN(valor)) return { valor: null, error: "Solo se aceptan números." };
  if (reglas.min !== undefined && valor < reglas.min)
    return { valor: null, error: reglas.mensajeMin ?? `El mínimo es ${reglas.min}.` };
  if (reglas.max !== undefined && valor > reglas.max)
    return { valor: null, error: reglas.mensajeMax ?? `El máximo es ${reglas.max}.` };
  if (reglas.entero && !Number.isInteger(valor))
    return { valor: null, error: "Usa un número entero." };

  return { valor, error: null };
}

export const REGLA_CAPITAL: ReglaCampo = {
  min: 0.01,
  mensajeMin: "El capital tiene que ser mayor a 0.",
};
export const REGLA_TASA: ReglaCampo = {
  min: 0,
  max: 100,
  mensajeMax: "Usa una tasa de 0 a 100 %.",
};
export const REGLA_TIEMPO: ReglaCampo = {
  min: 1,
  max: 60,
  entero: true,
  mensajeMax: "El máximo son 60 años.",
};