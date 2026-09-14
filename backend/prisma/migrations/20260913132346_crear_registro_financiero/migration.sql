-- CreateTable
CREATE TABLE "RegistroFinanciero" (
    "id" SERIAL NOT NULL,
    "modelo_calculo" TEXT NOT NULL,
    "clasificacion_flujo" TEXT NOT NULL,
    "capital_base" DOUBLE PRECISION NOT NULL,
    "tasa_interes" DOUBLE PRECISION NOT NULL,
    "periodos_plazo" INTEGER NOT NULL,
    "monto_proyectado" DOUBLE PRECISION NOT NULL,
    "justificacion_contextual" TEXT,
    "fecha_operacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RegistroFinanciero_pkey" PRIMARY KEY ("id")
);
