"use client";

import { useMemo, useState } from "react";
import CampoNumero from "@/components/CampoNumero";
import GraficaLineas from "@/components/GraficaLineas";
import TarjetaResultado from "@/components/TarjetaResultado";
import type { Consulta } from "@/hooks/useHistorial";
import {
  interesCompuesto,
  OPCIONES_FRECUENCIA,
  serieCompuesta,
  tasaEfectivaAnual,
} from "@/lib/finanzas";
import {
  bs,
  pct,
  REGLA_CAPITAL,
  REGLA_TASA,
  REGLA_TIEMPO,
  validarNumero,
} from "@/lib/formato";

const COLOR = "#17714a";

interface Props {
  registrar: (dato: Omit<Consulta, "id" | "interes" | "fecha">) => void;
}

export default function VentanaCompuesto({ registrar }: Props) {
  const [capital, setCapital] = useState("10000");
  const [tasa, setTasa] = useState("8.5");
  const [tiempo, setTiempo] = useState("10");
  const [frecuencia, setFrecuencia] = useState(12);
  const [errores, setErrores] = useState<Record<string, string | null>>({});
  const [resultado, setResultado] = useState<{
    capital: number;
    tasa: number;
    anios: number;
    frecuencia: number;
    final: number;
    serie: number[];
  } | null>(null);

  function calcular() {
    const c = validarNumero(capital, REGLA_CAPITAL);
    const t = validarNumero(tasa, REGLA_TASA);
    const n = validarNumero(tiempo, REGLA_TIEMPO);
    setErrores({ capital: c.error, tasa: t.error, tiempo: n.error });
    if (c.valor === null || t.valor === null || n.valor === null) return;

    const final = interesCompuesto(c.valor, t.valor, n.valor, frecuencia);
    const nombreFrec = OPCIONES_FRECUENCIA.find((o) => o.valor === frecuencia)?.nombre ?? "";
    setResultado({
      capital: c.valor,
      tasa: t.valor,
      anios: n.valor,
      frecuencia,
      final,
      serie: serieCompuesta(c.valor, t.valor, n.valor, frecuencia),
    });
    registrar({
      tipo: "Compuesto",
      capital: c.valor,
      tasa: t.valor,
      años: n.valor,
      final,
      extra: nombreFrec,
    });
  }

  function restablecer() {
    setCapital("10000");
    setTasa("8.5");
    setTiempo("10");
    setFrecuencia(12);
    setErrores({});
    setResultado(null);
  }

  const detalle = useMemo(() => {
    if (!resultado) return [];
    return Array.from({ length: resultado.anios }, (_, i) => {
      const anio = i + 1;
      return {
        anio,
        inicio: resultado.serie[anio - 1],
        delAnio: resultado.serie[anio] - resultado.serie[anio - 1],
        cierre: resultado.serie[anio],
      };
    });
  }, [resultado]);

  return (
    <div>
      <header className="mb-7 max-w-[62ch] border-l-[3px] border-[#17714a] pl-4">
        <h1 className="text-[28px] font-semibold tracking-tight text-[#14202a]">Interés compuesto</h1>
        <p className="mt-1.5 text-[15px] text-[#5a6872]">
          Cada periodo el interés se suma al capital y vuelve a generar interés. Por eso la curva se
          acelera.
        </p>
        <p className="mt-2.5 font-mono text-[15px] text-[#14202a]">
          A = P · (1 + r/n)<sup className="text-[11px]">n·t</sup>
        </p>
      </header>

      <div className="mb-6 grid items-start gap-5 lg:grid-cols-[1fr_340px]">
        <div className="rounded border border-[#d3d7cc] bg-white p-6">
          <div className="space-y-[18px]">
            <CampoNumero etiqueta="Capital inicial" valor={capital} onChange={setCapital} error={errores.capital} unidadIzq="Bs" />
            <CampoNumero etiqueta="Tasa de interés anual" valor={tasa} onChange={setTasa} error={errores.tasa} unidadDer="%" />
            <CampoNumero etiqueta="Tiempo" valor={tiempo} onChange={setTiempo} error={errores.tiempo} unidadDer="años" />
            <div>
              <label className="mb-1.5 block text-[13px] font-medium text-[#5a6872]">Capitalización</label>
              <div className="flex items-stretch overflow-hidden rounded border border-[#d3d7cc] bg-white focus-within:border-[#14202a] focus-within:ring-2 focus-within:ring-[#14202a]/10">
                <select
                  value={frecuencia}
                  onChange={(e) => setFrecuencia(Number(e.target.value))}
                  className="w-full cursor-pointer bg-transparent px-3 py-2.5 text-[15px] text-[#14202a] outline-none"
                >
                  {OPCIONES_FRECUENCIA.map((o) => (
                    <option key={o.valor} value={o.valor}>
                      {o.nombre} ({o.detalle})
                    </option>
                  ))}
                </select>
              </div>
              <p className="mt-1 min-h-[17px]" />
            </div>
          </div>
          <div className="mt-5 flex gap-2.5">
            <button onClick={calcular} className="rounded border border-[#14202a] bg-[#14202a] px-[18px] py-2.5 text-[14.5px] font-medium text-white transition hover:bg-[#0c1820]">
              Calcular monto
            </button>
            <button onClick={restablecer} className="rounded border border-[#d3d7cc] bg-white px-[18px] py-2.5 text-[14.5px] font-medium text-[#14202a] transition hover:border-[#14202a]">
              Restablecer
            </button>
          </div>
        </div>

        {resultado ? (
          <TarjetaResultado
            final={resultado.final}
            acento="compuesto"
            filas={[
              { etiqueta: "Capital inicial", valor: bs(resultado.capital) },
              { etiqueta: "Interés ganado", valor: bs(resultado.final - resultado.capital), ganancia: true },
              { etiqueta: "Tasa efectiva anual", valor: pct(tasaEfectivaAnual(resultado.tasa, resultado.frecuencia)) },
            ]}
          />
        ) : (
          <div className="flex min-h-[220px] items-center justify-center rounded border border-dashed border-[#d3d7cc] bg-white/60 p-6 text-center text-[14px] text-[#5a6872]">
            Completá los datos y pulsá Calcular para ver el resultado.
          </div>
        )}
      </div>

      {resultado && (
        <>
          <section className="mb-5 rounded border border-[#d3d7cc] bg-white px-6 pb-6 pt-5">
            <h2 className="mb-3.5 text-[15px] font-semibold text-[#14202a]">Evolución año por año</h2>
            <GraficaLineas series={[{ nombre: "Interés compuesto", datos: resultado.serie, color: COLOR }]} />
          </section>

          <section className="rounded border border-[#d3d7cc] bg-white px-6 pb-5 pt-5">
            <h2 className="mb-3.5 text-[15px] font-semibold text-[#14202a]">Detalle anual</h2>
            <div className="max-h-[300px] overflow-auto">
              <table className="w-full border-collapse text-[14px]">
                <thead>
                  <tr>
                    {["Año", "Capital al inicio", "Interés del año", "Capital al cierre"].map((c, i) => (
                      <th key={c} className={`sticky top-0 border-b border-[#d3d7cc] bg-white px-3 py-2 text-[12.5px] font-medium text-[#5a6872] ${i === 0 ? "text-left" : "text-right"}`}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detalle.map((f) => (
                    <tr key={f.anio} className="hover:bg-[#f7f9f4]">
                      <td className="border-b border-[#e6e8e1] px-3 py-2 text-left font-mono">{f.anio}</td>
                      <td className="border-b border-[#e6e8e1] px-3 py-2 text-right font-mono">{bs(f.inicio)}</td>
                      <td className="border-b border-[#e6e8e1] px-3 py-2 text-right font-mono">{bs(f.delAnio)}</td>
                      <td className="border-b border-[#e6e8e1] px-3 py-2 text-right font-mono">{bs(f.cierre)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
