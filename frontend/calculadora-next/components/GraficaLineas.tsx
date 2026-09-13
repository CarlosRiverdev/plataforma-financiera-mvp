"use client";

import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { bs, bsCompacto } from "@/lib/formato";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend,
);

export interface SerieGrafica {
  nombre: string;
  datos: number[];
  color: string;
  punteada?: boolean;
}

interface Props {
  series: SerieGrafica[];
  alto?: number;
}

/** Gráfica de líneas reutilizable, con el eje en bolivianos y tooltips formateados. */
export default function GraficaLineas({ series, alto = 260 }: Props) {
  const anios = series[0]?.datos.length ?? 0;
  const etiquetas = Array.from({ length: anios }, (_, i) => String(i));

  const data = {
    labels: etiquetas,
    datasets: series.map((s) => ({
      label: s.nombre,
      data: s.datos,
      borderColor: s.color,
      backgroundColor: s.color + "14",
      borderWidth: 2,
      borderDash: s.punteada ? [6, 4] : [],
      tension: 0,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointBackgroundColor: s.color,
      fill: true,
    })),
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#14202a",
        padding: 12,
        cornerRadius: 4,
        titleFont: { weight: "bold" },
        callbacks: {
          title: (items) => "Año " + items[0].label,
          label: (item) => " " + item.dataset.label + ": " + bs(item.parsed.y ?? 0),
        },
      },
    },
    scales: {
      x: {
        title: { display: true, text: "Años", color: "#5a6872" },
        grid: { color: "rgba(20,32,42,.06)" },
        border: { color: "#d3d7cc" },
        ticks: { color: "#5a6872" },
      },
      y: {
        beginAtZero: false,
        grid: { color: "rgba(20,32,42,.06)" },
        border: { color: "#d3d7cc" },
        ticks: { color: "#5a6872", callback: (v) => bsCompacto(Number(v)) },
      },
    },
  };

  return (
    <div style={{ height: alto }} className="relative">
      <Line data={data} options={options} />
    </div>
  );
}
