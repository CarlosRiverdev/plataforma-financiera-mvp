/**
 * Fórmulas de interés simple y compuesto.
 * Todo el cálculo vive acá, separado de la interfaz, para poder probarlo aparte.
 */

/** A = P (1 + r·t) — el interés se calcula siempre sobre el capital inicial. */
export function interesSimple(capital: number, tasaAnual: number, años: number): number {
  return capital * (1 + (tasaAnual / 100) * años);
}

/** A = P (1 + r/n)^(n·t) — el interés se suma al capital cada periodo. */
export function interesCompuesto(
  capital: number,
  tasaAnual: number,
  años: number,
  frecuencia: number,
): number {
  const r = tasaAnual / 100;
  return capital * Math.pow(1 + r / frecuencia, frecuencia * años);
}

/** Tasa efectiva anual a partir de la nominal y la frecuencia de capitalización. */
export function tasaEfectivaAnual(tasaAnual: number, frecuencia: number): number {
  return (Math.pow(1 + tasaAnual / 100 / frecuencia, frecuencia) - 1) * 100;
}

/** Un valor por año, del año 0 al año t, para dibujar la curva. */
export function serieSimple(capital: number, tasa: number, años: number): number[] {
  return Array.from({ length: años + 1 }, (_, i) => interesSimple(capital, tasa, i));
}

export function serieCompuesta(
  capital: number,
  tasa: number,
  años: number,
  frecuencia: number,
): number[] {
  return Array.from({ length: años + 1 }, (_, i) => interesCompuesto(capital, tasa, i, frecuencia));
}

/** Primer año en que el compuesto supera al simple en más de 1 %. */
export function añoDeSeparacion(simple: number[], compuesto: number[]): number | null {
  for (let i = 1; i < simple.length; i++) {
    if (compuesto[i] > simple[i] * 1.01) return i;
  }
  return null;
}

export const OPCIONES_FRECUENCIA = [
  { valor: 1, nombre: "Anual", detalle: "1 vez al año" },
  { valor: 2, nombre: "Semestral", detalle: "2 veces al año" },
  { valor: 4, nombre: "Trimestral", detalle: "4 veces al año" },
  { valor: 12, nombre: "Mensual", detalle: "12 veces al año" },
  { valor: 365, nombre: "Diaria", detalle: "365 veces al año" },
] as const;