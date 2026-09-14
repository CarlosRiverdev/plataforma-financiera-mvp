import { Module } from '@nestjs/common';
import { ServicioBD } from './servicio-bd.service.js';
import { PersistenciaController } from './persistencia.controller.js';

@Module({
  controllers: [PersistenciaController],
  providers: [ServicioBD],
  exports: [ServicioBD],
})
export class PersistenciaModule {}