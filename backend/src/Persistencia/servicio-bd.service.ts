import 'dotenv/config';
import { Injectable } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class ServicioBD {
  private prisma: PrismaClient;

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    this.prisma = new PrismaClient({ adapter });
  }

  async guardar(datos: {
    modelo_calculo: string;
    clasificacion_flujo: string;
    capital_base: number;
    tasa_interes: number;
    periodos_plazo: number;
    monto_proyectado: number;
    justificacion_contextual?: string;
  }) {
    return this.prisma.registroFinanciero.create({
      data: datos,
    });
  }

  async getHistorial() {
    return this.prisma.registroFinanciero.findMany({
      orderBy: {
        fecha_operacion: 'desc',
      },
    });
  }

  async filtrarFlujo(flujo: string) {
    return this.prisma.registroFinanciero.findMany({
      where: {
        clasificacion_flujo: flujo,
      },
      orderBy: {
        fecha_operacion: 'desc',
      },
    });
  }
}