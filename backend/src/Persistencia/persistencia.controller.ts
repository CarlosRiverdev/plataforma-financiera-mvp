import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ServicioBD } from './servicio-bd.service.js';

@Controller('api/v1/calculos')
export class PersistenciaController {
  constructor(private readonly servicioBD: ServicioBD) {}

  @Post()
  async guardar(@Body() datos: any) {
    return this.servicioBD.guardar(datos);
  }

  @Get('historial')
  async getHistorial() {
    return this.servicioBD.getHistorial();
  }

  @Get('historial/flujo')
  async filtrarFlujo(@Query('flujo') flujo: string) {
    return this.servicioBD.filtrarFlujo(flujo);
  }
}