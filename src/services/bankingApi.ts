import { supabase } from "./supabaseClient";
import {
  Cuenta,
  MovimientoCuenta,
  Tarjeta as TarjetaEntity,
  Prestamo as PrestamoEntity,
  Pago as PagoEntity,
  Notificacion as NotificacionEntity,
} from "../types/supabaseEntities";

export type Account = {
  id: string;
  name: string;
  number: string;
  balance: number;
  currency: string;
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number;
};

export type Card = {
  id: string;
  type: string;
  brand?: string | null;
  last4: string;
  limit?: number | null;
  balance?: number | null;
};

export type Loan = {
  id: string;
  name: string;
  balance: number;
  installment?: number | null;
  dueDate?: string | null;
  cuentaId?: string | null;
};

export type Payment = {
  id: string;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
  description?: string | null;
};

export type Notification = {
  id: string;
  title: string;
  body: string;
  date: string;
  type?: string | null;
  read?: boolean;
};

const ensureSupabase = (context: string) => {
  if (!supabase) {
    throw new Error(
      `Supabase no está configurado (${context}). Revisa el archivo .env.`
    );
  }
};

/**
 * CUENTAS
 */
export const fetchAccounts = async (userId?: string): Promise<Account[]> => {
  ensureSupabase("fetchAccounts");

  const query = supabase!
    .from("cuentas")
    .select(
      "id,usuario_id,numero_cuenta,nombre,tipo,moneda,saldo,estado,creado_en"
    )
    .order("creado_en", { ascending: false });

  const { data, error } = userId
    ? await query.eq("usuario_id", userId)
    : await query;

  if (error) {
    console.error("Error en fetchAccounts:", error.message);
    throw error;
  }

  if (!data) return [];

  const rows = data as Cuenta[];

  return rows.map((row) => ({
    id: row.id,
    name: row.nombre,
    number: row.numero_cuenta,
    balance: Number(row.saldo ?? 0),
    currency: row.moneda || "HNL",
  }));
};

export type CreateAccountParams = {
  usuarioId: string;
  nombre: string;
  tipo: "ahorros" | "corriente";
  moneda?: string;
};

const generateAccountNumber = () => {
  const timePart = Date.now().toString().slice(-6);
  const randPart = Math.floor(Math.random() * 900000 + 100000).toString();
  return `000${timePart}${randPart.slice(0, 3)}`;
};

export const createAccount = async (params: CreateAccountParams) => {
  ensureSupabase("createAccount");

  const { usuarioId, nombre, tipo, moneda } = params;
  const numeroCuenta = generateAccountNumber();

  const { data, error } = await supabase!
    .from("cuentas")
    .insert({
      usuario_id: usuarioId,
      numero_cuenta: numeroCuenta,
      nombre,
      tipo,
      moneda: moneda ?? "HNL",
      saldo: 0,
      estado: "activa",
    })
    .select("*")
    .single();

  if (error) {
    console.error("Error createAccount:", error.message);
    throw error;
  }

  return data;
};

/**
 * MOVIMIENTOS DE CUENTA
 */
export const fetchAccountMovements = async (
  accountId: string
): Promise<Transaction[]> => {
  ensureSupabase("fetchAccountMovements");

  const { data, error } = await supabase!
    .from("movimientos_cuenta")
    .select(
      "id,cuenta_id,tipo,monto,descripcion,categoria,saldo_despues,transferencia_relacionada_id,creado_en"
    )
    .eq("cuenta_id", accountId)
    .order("creado_en", { ascending: false });

  if (error) {
    console.error("Error en fetchAccountMovements:", error.message);
    throw error;
  }

  if (!data) return [];

  const rows = data as MovimientoCuenta[];

  return rows.map((row) => ({
    id: String(row.id),
    date: row.creado_en,
    description: row.descripcion ?? "",
    amount:
      row.tipo === "debito" ? -Number(row.monto ?? 0) : Number(row.monto ?? 0),
  }));
};

/**
 * TARJETAS
 */
export const fetchCards = async (userId?: string): Promise<Card[]> => {
  ensureSupabase("fetchCards");

  const query = supabase!
    .from("tarjetas")
    .select(
      "id,usuario_id,cuenta_id,tipo,marca,ultimos4,limite_credito,saldo_actual,creado_en"
    )
    .order("creado_en", { ascending: false });

  const { data, error } = userId
    ? await query.eq("usuario_id", userId)
    : await query;

  if (error) {
    console.error("Error en fetchCards:", error.message);
    throw error;
  }

  if (!data) return [];

  const rows = data as TarjetaEntity[];

  return rows.map((row) => ({
    id: row.id,
    type: row.tipo,
    brand: row.marca,
    last4: row.ultimos4,
    limit: row.limite_credito != null ? Number(row.limite_credito) : null,
    balance: row.saldo_actual != null ? Number(row.saldo_actual) : null,
  }));
};

/**
 * PRÉSTAMOS
 */
export const fetchLoans = async (userId?: string): Promise<Loan[]> => {
  ensureSupabase("fetchLoans");

  const query = supabase!
    .from("prestamos")
    .select(
      "id,usuario_id,cuenta_id,nombre,monto_principal,tasa_interes,plazo_meses,fecha_inicio,fecha_fin,estado,saldo_pendiente,creado_en"
    )
    .order("creado_en", { ascending: false });

  const { data, error } = userId
    ? await query.eq("usuario_id", userId)
    : await query;

  if (error) {
    console.error("Error en fetchLoans:", error.message);
    throw error;
  }

  if (!data) return [];

  const rows = data as PrestamoEntity[];

  return rows.map((row) => ({
    id: row.id,
    name: row.nombre,
    balance: Number(row.saldo_pendiente ?? 0),
    installment: null,
    dueDate: row.fecha_fin ?? null,
    cuentaId: row.cuenta_id ?? null,
  }));
};

export type LoanRequestParams = {
  usuarioId: string;
  cuentaDepositoId: string;
  nombre: string;
  montoPrincipal: number;
  tasaInteres: number;
  plazoMeses: number;
};

export type LoanPaymentParams = {
  usuarioId: string;
  prestamoId: string;
  cuentaOrigenId: string;
  montoPrincipal: number;
  montoInteres?: number;
};

export const requestLoan = async (params: LoanRequestParams) => {
  const {
    usuarioId,
    cuentaDepositoId,
    nombre,
    montoPrincipal,
    tasaInteres,
    plazoMeses,
  } = params;

  ensureSupabase("requestLoan");

  if (!usuarioId || !cuentaDepositoId) {
    throw new Error("Faltan datos del usuario o de la cuenta.");
  }
  if (!montoPrincipal || montoPrincipal <= 0) {
    throw new Error("El monto del préstamo debe ser mayor a 0.");
  }
  if (!plazoMeses || plazoMeses <= 0) {
    throw new Error("El plazo debe ser mayor a 0.");
  }

  const { data, error } = await supabase!.rpc("solicitar_prestamo", {
    p_usuario_id: usuarioId,
    p_cuenta_deposito: cuentaDepositoId,
    p_nombre: nombre || "Préstamo personal",
    p_monto_principal: montoPrincipal,
    p_tasa_interes: tasaInteres,
    p_plazo_meses: plazoMeses,
  });

  if (error) {
    console.error("Error en requestLoan:", error.message);
    throw error;
  }

  return (data as any)?.[0] ?? null;
};

export const payLoan = async (params: LoanPaymentParams) => {
  const { usuarioId, prestamoId, cuentaOrigenId, montoPrincipal } = params;
  const montoInteres = params.montoInteres ?? 0;

  ensureSupabase("payLoan");

  if (!usuarioId || !prestamoId || !cuentaOrigenId) {
    throw new Error("Faltan datos del pago de préstamo.");
  }
  if (!montoPrincipal || montoPrincipal <= 0) {
    throw new Error("El monto del pago debe ser mayor a 0.");
  }

  const { data, error } = await supabase!.rpc("pagar_prestamo", {
    p_usuario_id: usuarioId,
    p_prestamo_id: prestamoId,
    p_cuenta_origen_id: cuentaOrigenId,
    p_monto_principal: montoPrincipal,
    p_monto_interes: montoInteres,
  });

  if (error) {
    console.error("Error en payLoan:", error.message);
    throw error;
  }

  return (data as any)?.[0] ?? null;
};

/**
 * PAGOS
 */
export const fetchPayments = async (userId?: string): Promise<Payment[]> => {
  ensureSupabase("fetchPayments");

  const query = supabase!
    .from("pagos")
    .select(
      "id,usuario_id,cuenta_origen_id,tipo_destino,tarjeta_destino_id,prestamo_destino_id,monto,estado,creado_en,ejecutado_en"
    )
    .order("creado_en", { ascending: false });

  const { data, error } = userId
    ? await query.eq("usuario_id", userId)
    : await query;

  if (error) {
    console.error("Error en fetchPayments:", error.message);
    throw error;
  }

  if (!data) return [];

  const rows = data as PagoEntity[];

  return rows.map((row) => ({
    id: row.id,
    amount: Number(row.monto ?? 0),
    type: row.tipo_destino ?? "desconocido",
    status: row.estado ?? "pendiente",
    createdAt: row.creado_en,
  }));
};

/**
 * NOTIFICACIONES
 */
export const fetchNotifications = async (
  userId?: string
): Promise<Notification[]> => {
  ensureSupabase("fetchNotifications");

  const query = supabase!
    .from("notificaciones")
    .select("id,usuario_id,tipo,titulo,cuerpo,datos,leida_en,creado_en")
    .order("creado_en", { ascending: false });

  const { data, error } = userId
    ? await query.eq("usuario_id", userId)
    : await query;

  if (error) {
    console.error("Error en fetchNotifications:", error.message);
    throw error;
  }

  if (!data) return [];

  const rows = data as NotificacionEntity[];

  return rows.map((row) => ({
    id: row.id,
    title: row.titulo,
    body: row.cuerpo,
    date: row.creado_en,
    type: row.tipo,
    read: Boolean(row.leida_en),
  }));
};

/**
 * REALIZAR TRANSFERENCIA (RPC)
 */
export const makeTransfer = async (params: {
  usuarioId: string;
  cuentaOrigenId: string;
  cuentaDestinoId: string;
  monto: number;
  concepto?: string;
}) => {
  ensureSupabase("makeTransfer");

  const { usuarioId, cuentaOrigenId, cuentaDestinoId, monto, concepto } =
    params;

  // Validaciones cliente
  if (!usuarioId || !usuarioId.trim()) {
    throw new Error("usuarioId es requerido");
  }
  if (!cuentaOrigenId || !cuentaOrigenId.trim()) {
    throw new Error("cuentaOrigenId es requerido");
  }
  if (!cuentaDestinoId || !cuentaDestinoId.trim()) {
    throw new Error("cuentaDestinoId es requerido");
  }
  if (cuentaOrigenId === cuentaDestinoId) {
    throw new Error("La cuenta origen y destino no pueden ser la misma");
  }
  if (typeof monto !== "number" || Number.isNaN(monto) || monto <= 0) {
    throw new Error("El monto debe ser un número mayor a 0");
  }

  try {
    const { data, error } = await supabase!.rpc("realizar_transferencia", {
      p_usuario_id: usuarioId,
      p_cuenta_origen: cuentaOrigenId,
      p_cuenta_destino: cuentaDestinoId,
      p_monto: monto,
      p_concepto: concepto ?? null,
    });

    if (error) {
      console.error("Error en makeTransfer:", error.message);
      throw error;
    }

    // Supabase RPC puede devolver un array de rows
    return (data as any)?.[0] ?? null;
  } catch (err: any) {
    console.error("Exception en makeTransfer:", err?.message ?? err);
    throw err;
  }
};

export const getAccountIdByNumber = async (
  accountNumber: string
): Promise<string> => {
  ensureSupabase("getAccountIdByNumber");

  const trimmed = accountNumber?.trim?.();
  if (!trimmed) {
    throw new Error("El número de cuenta destino es requerido.");
  }

  const { data, error } = await supabase!
    .from("cuentas")
    .select("id")
    .eq("numero_cuenta", trimmed)
    .single();

  if (error || !data) {
    console.error(
      "Error en getAccountIdByNumber:",
      error?.message ?? "no data"
    );
    throw new Error("Cuenta destino no encontrada.");
  }

  return data.id as string;
};
