"use client";

import { useMemo, useState } from "react";
import CampoNumero from "@/components/CampoNumero";
import GraficaLineas from "@/components/GraficaLineas";
import TarjetaResultado from "@/components/TarjetaResultado";
import type { Consulta } from "@/hooks/useHistorial";
import { interesSimple, serieSimple } from "@/lib/finanzas";
import {
  bs,
  pct,
  REGLA_CAPITAL,
  REGLA_TASA,
  REGLA_TIEMPO,
  validarNumero,
} from "@/lib/formato";

const COLOR = "#2c5d8f";

interface Props {
  registrar: (dato: Omit<Consulta, "id" | "interes" | "fecha">) => void;
}

export default function VentanaSimple({ registrar }: Props) {
  const [capital, setCapital] = useState("10000");
  const [tasa, setTasa] = useState("8.5");
  const [tiempo, setTiempo] = useState("10");
  const [errores, setErrores] = useState<Record<string, string | null>>({});
  const [resultado, setResultado] = useState<{
    capital: number;
    tasa: number;
    años: number;
    final: number;
    serie: number[];
  } | null>(null);

  function calcular() {
    const c = validarNumero(capital, REGLA_CAPITAL);
    const t = validarNumero(tasa, REGLA_TASA);
    const n = validarNumero(tiempo, REGLA_TIEMPO);
    setErrores({ capital: c.error, tasa: t.error, tiempo: n.error });
    if (c.valor === null || t.valor === null || n.valor === null) return;

    const final = interesSimple(c.valor, t.valor, n.valor);
    setResultado({
      capital: c.valor,
      tasa: t.valor,
      años: n.valor,
      final,
      serie: serieSimple(c.valor, t.valor, n.valor),
    });
    registrar({ tipo: "Simple", capital: c.valor, tasa: t.valor, años: n.valor, final, extra: "" });
  }

  function restablecer() {
    setCapital("10000");
    setTasa("8.5");
    setTiempo("10");
    setErrores({});
    setResultado(null);
  }

  const detalle = useMemo(() => {
    if (!resultado) return [];
    const interesAnual = resultado.capital * (resultado.tasa / 100);
    return Array.from({ length: resultado.años }, (_, i) => {
      const año = i + 1;
      return {
        año,
        delAño: interesAnual,
        acumulado: interesAnual * año,
        capital: resultado.serie[año],
      };
    });
  }, [resultado]);

  return (
    <div>
      <header className="mb-7 max-w-[62ch] border-l-[3px] border-[#2c5d8f] pl-4">
        <h1 className="text-[28px] font-semibold tracking-tight text-[#14202a]">Interés simple</h1>
        <p className="mt-1.5 text-[15px] text-[#5a6872]">
          El interés se calcula siempre sobre el capital inicial, así que el crecimiento es una línea
          recta.
        </p>
        <p className="mt-2.5 font-mono text-[15px] text-[#14202a]">A = P · (1 + r · t)</p>
      </header>

      <div className="mb-6 grid items-start gap-5 lg:grid-cols-[1fr_340px]">
        <div className="rounded border border-[#d3d7cc] bg-white p-6">
          <div className="space-y-[18px]">
            <CampoNumero etiqueta="Capital inicial" valor={capital} onChange={setCapital} error={errores.capital} unidadIzq="Bs" />
            <CampoNumero etiqueta="Tasa de interés anual" valor={tasa} onChange={setTasa} error={errores.tasa} unidadDer="%" />
            <CampoNumero etiqueta="Tiempo" valor={tiempo} onChange={setTiempo} error={errores.tiempo} unidadDer="años" />
          </div>
          <div className="mt-5 flex gap-2.5">
            <button onClick={calcular} className="rounded border border-[#14202a] bg-[#14202a] px-[18px] py-2.5 text-[14.5px] font-medium text-white transition hover:bg-[#0c1820]">
              Calcular interés
            </button>
            <button onClick={restablecer} className="rounded border border-[#d3d7cc] bg-white px-[18px] py-2.5 text-[14.5px] font-medium text-[#14202a] transition hover:border-[#14202a]">
              Restablecer
            </button>
          </div>
        </div>

        {resultado ? (
          <TarjetaResultado
            final={resultado.final}
            acento="simple"
            filas={[
              { etiqueta: "Capital inicial", valor: bs(resultado.capital) },
              { etiqueta: "Interés ganado", valor: bs(resultado.final - resultado.capital), ganancia: true },
              {
                etiqueta: "Crecimiento total",
                valor: pct(resultado.capital > 0 ? ((resultado.final - resultado.capital) / resultado.capital) * 100 : 0),
              },
            ]}
          />
        ) : (
          <div className="flex min-h-[220px] items-center justify-center rounded border border-dashed border-[#d3d7cc] bg-white/60 p-6 text-center text-[14px] text-[#5a6872]">
            Completa los datos y pulsa Calcular para ver el resultado.
          </div>
        )}
      </div>

      {resultado && (
        <>
          <section className="mb-5 rounded border border-[#d3d7cc] bg-white px-6 pb-6 pt-5">
            <h2 className="mb-3.5 text-[15px] font-semibold text-[#14202a]">Evolución año por año</h2>
            <GraficaLineas series={[{ nombre: "Interés simple", datos: resultado.serie, color: COLOR }]} />
          </section>

          <section className="rounded border border-[#d3d7cc] bg-white px-6 pb-5 pt-5">
            <h2 className="mb-3.5 text-[15px] font-semibold text-[#14202a]">Detalle anual</h2>
            <div className="max-h-[300px] overflow-auto">
              <table className="w-full border-collapse text-[14px]">
                <thead>
                  <tr>
                    {["Año", "Interés del año", "Interés acumulado", "Capital"].map((c, i) => (
                      <th key={c} className={`sticky top-0 border-b border-[#d3d7cc] bg-white px-3 py-2 text-[12.5px] font-medium text-[#5a6872] ${i === 0 ? "text-left" : "text-right"}`}>
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detalle.map((f) => (
                    <tr key={f.año} className="hover:bg-[#f7f9f4]">
                      <td className="border-b border-[#e6e8e1] px-3 py-2 text-left font-mono">{f.año}</td>
                      <td className="border-b border-[#e6e8e1] px-3 py-2 text-right font-mono">{bs(f.delAño)}</td>
                      <td className="border-b border-[#e6e8e1] px-3 py-2 text-right font-mono">{bs(f.acumulado)}</td>
                      <td className="border-b border-[#e6e8e1] px-3 py-2 text-right font-mono">{bs(f.capital)}</td>
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