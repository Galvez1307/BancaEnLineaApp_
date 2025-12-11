export interface Cuenta {
  id: string;
  usuario_id: string;
  numero_cuenta: string;
  nombre: string;
  tipo: string | null;
  moneda: string;
  saldo: number | null;
  estado: string | null;
  creado_en: string;
}

export interface MovimientoCuenta {
  id: string;
  cuenta_id: string;
  tipo: string;
  monto: number | null;
  descripcion: string | null;
  categoria: string | null;
  saldo_despues: number | null;
  transferencia_relacionada_id: string | null;
  creado_en: string;
}

export interface Tarjeta {
  id: string;
  usuario_id: string;
  cuenta_id: string | null;
  tipo: string;
  marca: string | null;
  ultimos4: string;
  mes_vencimiento: number | null;
  ano_vencimiento: number | null;
  estado: string | null;
  limite_credito: number | null;
  saldo_actual: number | null;
  creado_en: string;
}

export interface Prestamo {
  id: string;
  usuario_id: string;
  cuenta_id: string | null;
  nombre: string;
  monto_principal: number | null;
  tasa_interes: number | null;
  plazo_meses: number | null;
  fecha_inicio: string | null;
  fecha_fin: string | null;
  estado: string | null;
  saldo_pendiente: number | null;
  creado_en: string;
}

export interface Pago {
  id: string;
  usuario_id: string;
  cuenta_origen_id: string | null;
  tipo_destino: string;
  tarjeta_destino_id: string | null;
  prestamo_destino_id: string | null;
  monto: number | null;
  estado: string | null;
  creado_en: string;
  ejecutado_en: string | null;
}

export interface Notificacion {
  id: string;
  usuario_id: string;
  tipo: string;
  titulo: string;
  cuerpo: string;
  datos: Record<string, unknown> | null;
  leida_en: string | null;
  creado_en: string;
}
