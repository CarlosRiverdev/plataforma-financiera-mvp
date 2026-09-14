import { Injectable } from '@nestjs/common';

@Injectable()
export class CalculoService {
    private precision: number = 2;

    /**
     * Punto de entrada del motor financiero para realizar los cálculos.
     * Asume que la entrada YA HA SIDO validada y limpiada por la clase DatosEntrada.
     *
     * @param params Parámetros previamente validados y limpiados (tipo temporal 'any').
     */
    public procesarCalculoFinanciero(params: any): any {
        // Asumimos que los métodos limpiar() y validar() ya no se llaman aquí.
        // Esa responsabilidad recae en el controlador usando la clase DatosEntrada
        // antes de llamar a este servicio.

        const { p, r, t, n = 1, tipo } = params;
        let total = 0;
        let interes = 0;

        if (tipo === 'SIMPLE') {
            interes = this.calcSimple(p, r, t);
            total = p + interes;
        } else {
            total = this.calcCompuesto(p, r, t, n);
            interes = total - p; // El interés es el Total (A) menos el Capital (P)
        }

        const grafica = this.genGrafica(tipo, p, r, t, n);

        return {
            total: Number(total.toFixed(this.precision)),
            interes: Number(interes.toFixed(this.precision)),
            grafica
        };
    }

    /**
     * Fórmula de Interés Simple: SI = P * r * t
     */
    public calcSimple(p: number, r: number, t: number): number {
        return p * r * t;
    }

    /**
     * Fórmula de Interés Compuesto: A = P(1 + r/n)^(nt)
     * Cuando no se ingresa la variable 'n', se usa 1 por defecto.
     */
    public calcCompuesto(p: number, r: number, t: number, n = 1): number {
        return p * Math.pow(1 + r / n, n * t);
    }

    /**
     * Motor iterativo: Calcula el crecimiento período a período.
     * Complejidad de tiempo: O(t) donde 't' son los períodos.
     */
    public genGrafica(tipo: string, p: number, r: number, t: number, n = 1): any[] {
        const grafica: any[] = [];
        let capitalAnterior = p;

        for (let i = 1; i <= t; i++) {
            let capitalAcumulado = 0;
            let interesDelPeriodo = 0;

            if (tipo === 'SIMPLE') {
                // En interés simple, el interés del período es siempre constante: P * r
                interesDelPeriodo = p * r;
                capitalAcumulado = p + (interesDelPeriodo * i);
            } else {
                // En compuesto, calculamos el acumulado hasta el período 'i'
                capitalAcumulado = this.calcCompuesto(p, r, i, n);
                // El interés marginal es la diferencia con el período anterior
                interesDelPeriodo = capitalAcumulado - capitalAnterior;
                capitalAnterior = capitalAcumulado; // Actualizamos para la siguiente iteración
            }

            grafica.push({
                periodo: i,
                capitalAcumulado: Number(capitalAcumulado.toFixed(this.precision)),
                interesDelPeriodo: Number(interesDelPeriodo.toFixed(this.precision))
            });
        }

        return grafica;
    }


}