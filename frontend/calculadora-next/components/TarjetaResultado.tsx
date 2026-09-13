import { bs } from "@/lib/formato";

interface Fila {
  etiqueta: string;
  valor: string;
  ganancia?: boolean;
}

interface Props {
  final: number;
  filas: Fila[];
  acento?: "simple" | "compuesto";
}

/** Panel oscuro que resalta el capital final y desglosa el resto. */
export default function TarjetaResultado({ final, filas, acento = "simple" }: Props) {
  const colorMonto = acento === "compuesto" ? "text-[#6fd3a0]" : "text-white";

  return (
    <div className="rounded bg-[#14202a] p-6 text-[#eef2f5]">
      <span className="mb-1 block text-[13px] text-[#9fb0ba]">Capital final</span>
      <strong className={`block font-mono text-[30px] font-medium leading-tight tracking-tight ${colorMonto}`}>
        {bs(final)}
      </strong>

      <dl className="mt-5 border-t border-white/15">
        {filas.map((f) => (
          <div key={f.etiqueta} className="flex justify-between gap-3 border-b border-white/10 py-2.5">
            <dt className="text-[13.5px] text-[#9fb0ba]">{f.etiqueta}</dt>
            <dd className={`font-mono text-[14px] ${f.ganancia ? "text-[#6fd3a0]" : ""}`}>{f.valor}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
