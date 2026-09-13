"use client";

import type { Consulta } from "@/hooks/useHistorial";
import { bs, pct } from "@/lib/formato";

interface Props {
  consultas: Consulta[];
  limpiar: () => void;
}

function fechaCorta(iso: string): string {
  const d = new Date(iso);
  const fecha = d.toLocaleDateString("es-BO", { day: "2-digit", month: "2-digit" });
  const hora = d.toLocaleTimeString("es-BO", { hour: "2-digit", minute: "2-digit" });
  return `${fecha} · ${hora}`;
}

export default function VentanaHistorial({ consultas, limpiar }: Props) {
  function pedirLimpieza() {
    if (consultas.length === 0) return;
    if (confirm(`Se van a borrar las ${consultas.length} consultas guardadas. ¿Seguimos?`)) limpiar();
  }

  return (
    <div>
      <header className="mb-7 max-w-[62ch] border-l-[3px] border-[#14202a] pl-4">
        <h1 className="text-[28px] font-semibold tracking-tight text-[#14202a]">Historial</h1>
        <p className="mt-1.5 text-[15px] text-[#5a6872]">
          Cada cálculo que hacés queda guardado acá, con los datos que usaste y el resultado que
          salió. Se conserva aunque cierres el navegador.
        </p>
      </header>

      <section className="rounded border border-[#d3d7cc] bg-white px-6 pb-5 pt-5">
        <div className="mb-3.5 flex items-center justify-between gap-4">
          <h2 className="text-[15px] font-semibold text-[#14202a]">
            Consultas guardadas
            <span className="ml-1.5 inline-block rounded-full border border-[#d3d7cc] bg-[#f2f4ee] px-2.5 py-px font-mono text-[12px] text-[#5a6872]">
              {consultas.length}
            </span>
          </h2>
          <button
            onClick={pedirLimpieza}
            disabled={consultas.length === 0}
            className="rounded border border-[#e4c4bc] px-[18px] py-2.5 text-[14.5px] font-medium text-[#a3321e] transition hover:border-[#a3321e] hover:bg-[#fdf6f4] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#e4c4bc] disabled:hover:bg-transparent"
          >
            Limpiar historial
          </button>
        </div>

        <div className="max-h-[440px] overflow-auto">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr>
                {["Tipo", "Capital", "Tasa", "Tiempo", "Capital final", "Interés", "Fecha"].map((c, i) => (
                  <th key={c} className={`sticky top-0 whitespace-nowrap border-b border-[#d3d7cc] bg-white px-3 py-2 text-[12.5px] font-medium text-[#5a6872] ${i === 0 ? "text-left" : "text-right"}`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {consultas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-[#5a6872]">
                    Todavía no hay consultas. Calculá algo en las otras ventanas y aparece acá.
                  </td>
                </tr>
              ) : (
                consultas.map((r) => (
                  <tr key={r.id} className="hover:bg-[#f7f9f4]">
                    <td className="border-b border-[#e6e8e1] px-3 py-2">
                      <span className={`inline-block whitespace-nowrap rounded px-2.5 py-0.5 text-[12.5px] font-medium ${r.tipo === "Simple" ? "bg-[#2c5d8f]/10 text-[#2c5d8f]" : "bg-[#17714a]/10 text-[#17714a]"}`}>
                        {r.tipo}
                      </span>
                    </td>
                    <td className="whitespace-nowrap border-b border-[#e6e8e1] px-3 py-2 text-right font-mono">{bs(r.capital)}</td>
                    <td className="whitespace-nowrap border-b border-[#e6e8e1] px-3 py-2 text-right font-mono">
                      {pct(r.tasa)}{r.extra ? ` · ${r.extra}` : ""}
                    </td>
                    <td className="whitespace-nowrap border-b border-[#e6e8e1] px-3 py-2 text-right font-mono">
                      {r.años} {r.años === 1 ? "año" : "años"}
                    </td>
                    <td className="whitespace-nowrap border-b border-[#e6e8e1] px-3 py-2 text-right font-mono">{bs(r.final)}</td>
                    <td className="whitespace-nowrap border-b border-[#e6e8e1] px-3 py-2 text-right font-mono text-[#17714a]">{bs(r.interes)}</td>
                    <td className="whitespace-nowrap border-b border-[#e6e8e1] px-3 py-2 text-right text-[13px] text-[#5a6872]">{fechaCorta(r.fecha)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
