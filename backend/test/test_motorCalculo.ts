import { Test, TestingModule } from '@nestjs/testing';
import { CalculoService } from '../src/calculo/calculo.service.js';

describe('CalculoService', () => {
    let service: CalculoService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [CalculoService],
        }).compile();

        service = module.get<CalculoService>(CalculoService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('calcSimple', () => {
        it('debe calcular el interés simple correctamente (caso estándar)', () => {
            // P = 1000, r = 0.05 (5%), t = 3 años.
            // SI = 1000 * 0.05 * 3 = 150
            const resultado = service.calcSimple(1000, 0.05, 3);
            expect(resultado).toBe(150);
        });

        it('debe devolver 0 si el capital inicial es 0', () => {
            const resultado = service.calcSimple(0, 0.05, 3);
            expect(resultado).toBe(0);
        });

        it('debe devolver 0 si la tasa de interés es 0', () => {
            const resultado = service.calcSimple(1000, 0, 3);
            expect(resultado).toBe(0);
        });

        it('debe devolver 0 si el tiempo es 0', () => {
            const resultado = service.calcSimple(1000, 0.05, 0);
            expect(resultado).toBe(0);
        });
    });

    describe('calcCompuesto', () => {
        it('debe calcular el monto compuesto anualmente (n=1 por defecto)', () => {
            // P = 1000, r = 0.05, t = 3, n = 1
            // A = 1000 * (1 + 0.05)^3 = 1000 * 1.157625 = 1157.625
            const resultado = service.calcCompuesto(1000, 0.05, 3);
            expect(resultado).toBeCloseTo(1157.625, 3);
        });

        it('debe calcular el monto compuesto mensualmente (n=12)', () => {
            // P = 1000, r = 0.05, t = 1, n = 12
            // A = 1000 * (1 + 0.05/12)^12 = 1051.16189...
            const resultado = service.calcCompuesto(1000, 0.05, 1, 12);
            expect(resultado).toBeCloseTo(1051.16, 2);
        });

        it('debe calcular el monto compuesto diariamente (n=365)', () => {
            // P = 1000, r = 0.05, t = 1, n = 365
            const resultado = service.calcCompuesto(1000, 0.05, 1, 365);
            expect(resultado).toBeCloseTo(1051.27, 2);
        });

        it('debe devolver el capital inicial si el tiempo es 0', () => {
            const resultado = service.calcCompuesto(1000, 0.05, 0);
            expect(resultado).toBe(1000);
        });
    });

    describe('genGrafica - SIMPLE', () => {
        it('debe generar la serie correcta para interés simple', () => {
            // P = 1000, r = 0.10, t = 3
            // Interés por periodo = 100
            const grafica = service.genGrafica('SIMPLE', 1000, 0.10, 3);

            expect(grafica).toHaveLength(3);

            // Periodo 1
            expect(grafica[0].periodo).toBe(1);
            expect(grafica[0].capitalAcumulado).toBe(1100);
            expect(grafica[0].interesDelPeriodo).toBe(100);

            // Periodo 2
            expect(grafica[1].periodo).toBe(2);
            expect(grafica[1].capitalAcumulado).toBe(1200);
            expect(grafica[1].interesDelPeriodo).toBe(100);

            // Periodo 3
            expect(grafica[2].periodo).toBe(3);
            expect(grafica[2].capitalAcumulado).toBe(1300);
            expect(grafica[2].interesDelPeriodo).toBe(100);
        });
    });

    describe('genGrafica - COMPUESTO', () => {
        it('debe generar la serie correcta para interés compuesto (n=1)', () => {
            // P = 1000, r = 0.10, t = 3, n = 1
            const grafica = service.genGrafica('COMPUESTO', 1000, 0.10, 3, 1);

            expect(grafica).toHaveLength(3);

            // Periodo 1: 1000 * 1.10 = 1100
            expect(grafica[0].periodo).toBe(1);
            expect(grafica[0].capitalAcumulado).toBe(1100);
            expect(grafica[0].interesDelPeriodo).toBe(100);

            // Periodo 2: 1100 * 1.10 = 1210
            expect(grafica[1].periodo).toBe(2);
            expect(grafica[1].capitalAcumulado).toBe(1210);
            expect(grafica[1].interesDelPeriodo).toBe(110);

            // Periodo 3: 1210 * 1.10 = 1331
            expect(grafica[2].periodo).toBe(3);
            expect(grafica[2].capitalAcumulado).toBe(1331);
            expect(grafica[2].interesDelPeriodo).toBe(121);
        });
    });

    describe('procesarCalculoFinanciero', () => {
        it('debe procesar correctamente un flujo de interés simple', () => {
            // El controlador ya pasó la limpieza y validación.
            const params = { p: 1000, r: 0.10, t: 2, tipo: 'SIMPLE' };

            const resultado = service.procesarCalculoFinanciero(params);

            expect(resultado.total).toBe(1200); // 1000 + (1000 * 0.10 * 2)
            expect(resultado.interes).toBe(200);
            expect(resultado.grafica).toHaveLength(2);
        });

        it('debe procesar correctamente un flujo de interés compuesto', () => {
            const params = { p: 1000, r: 0.10, t: 2, n: 1, tipo: 'COMPUESTO' };

            const resultado = service.procesarCalculoFinanciero(params);

            expect(resultado.total).toBe(1210); // 1000 * (1.10)^2
            expect(resultado.interes).toBe(210);
            expect(resultado.grafica).toHaveLength(2);
        });
    });
});