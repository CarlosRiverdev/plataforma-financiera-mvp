"use client";

import { useCallback, useEffect, useState } from "react";

export interface Consulta {
  id: string;
  tipo: "Simple" | "Compuesto";
  capital: number;
  tasa: number;
  años: number;
  final: number;
  interes: number;
  extra: string;
  fecha: string; // ISO
}

const CLAVE = "calculadora-interes:historial";
const TOPE = 50;

/**
 * Guarda las consultas en localStorage para que sobrevivan al cierre del navegador.
 * La lista arranca vacía en el servidor y se rellena al montar, para no romper el SSR.
 */
export function useHistorial() {
  const [consultas, setConsultas] = useState<Consulta[]>([]);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE);
      if (guardado) setConsultas(JSON.parse(guardado));
    } catch {
      // Si el navegador bloquea el almacenamiento, seguimos solo en memoria.
    }
    setListo(true);
  }, []);

  useEffect(() => {
    if (!listo) return;
    try {
      localStorage.setItem(CLAVE, JSON.stringify(consultas));
    } catch {
      // Sin persistencia; la sesión actual igual funciona.
    }
  }, [consultas, listo]);

  const registrar = useCallback((dato: Omit<Consulta, "id" | "interes" | "fecha">) => {
    setConsultas((previas) => {
      const nueva: Consulta = {
        ...dato,
        id: crypto.randomUUID(),
        interes: dato.final - dato.capital,
        fecha: new Date().toISOString(),
      };
      return [nueva, ...previas].slice(0, TOPE);
    });
  }, []);

  const limpiar = useCallback(() => setConsultas([]), []);

  return { consultas, registrar, limpiar };
}
