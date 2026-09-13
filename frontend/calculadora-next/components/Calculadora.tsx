"use client";

import { useState } from "react";
import VentanaComparacion from "@/components/VentanaComparacion";
import VentanaCompuesto from "@/components/VentanaCompuesto";
import VentanaHistorial from "@/components/VentanaHistorial";
import VentanaSimple from "@/components/VentanaSimple";
import { useHistorial } from "@/hooks/useHistorial";

type Ventana = "simple" | "compuesto" | "grafica" | "historial";

const PESTANAS: { clave: Ventana; texto: string }[] = [
  { clave: "simple", texto: "Interés simple" },
  { clave: "compuesto", texto: "Interés compuesto" },
  { clave: "grafica", texto: "Comparación" },
  { clave: "historial", texto: "Historial" },
];

export default function Calculadora() {
  const [ventana, setVentana] = useState<Ventana>("simple");
  const { consultas, registrar, limpiar } = useHistorial();

  return (
    <div className="min-h-screen bg-[#eef0ea] bg-[length:28px_28px] [background-image:linear-gradient(to_right,rgba(20,32,42,.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(20,32,42,.045)_1px,transparent_1px)]">
      <header className="bg-[#14202a] px-6 pt-[18px] text-[#f4f6f2]">
        <div className="mx-auto flex max-w-[1080px] flex-wrap items-baseline gap-x-3.5 gap-y-1 pb-4">
          <span className="text-[19px] font-semibold tracking-tight">Calculadora de interés</span>
          <span className="text-[13.5px] text-[#9fb0ba]">
            Simple y compuesto · proyección a varios años
          </span>
        </div>
        <nav className="mx-auto flex max-w-[1080px] gap-1 overflow-x-auto" aria-label="Ventanas">
          {PESTANAS.map((p) => {
            const activa = ventana === p.clave;
            return (
              <button
                key={p.clave}
                onClick={() => setVentana(p.clave)}
                aria-current={activa ? "page" : undefined}
                className={`whitespace-nowrap border-b-[3px] px-4 py-2.5 text-[14.5px] font-medium transition ${
                  activa
                    ? "rounded-t border-b-[#eef0ea] bg-[#eef0ea] text-[#14202a]"
                    : "border-b-transparent text-[#b9c7cf] hover:text-white"
                }`}
              >
                {p.texto}
              </button>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-[1080px] px-6 pb-14 pt-8">
        {ventana === "simple" && <VentanaSimple registrar={registrar} />}
        {ventana === "compuesto" && <VentanaCompuesto registrar={registrar} />}
        {ventana === "grafica" && <VentanaComparacion />}
        {ventana === "historial" && <VentanaHistorial consultas={consultas} limpiar={limpiar} />}
      </main>

      <footer className="mx-auto max-w-[1080px] px-6 pb-9 text-[13px] text-[#5a6872]">
        Proyecto académico · Next.js, Tailwind CSS y Chart.js
      </footer>
    </div>
  );
}
