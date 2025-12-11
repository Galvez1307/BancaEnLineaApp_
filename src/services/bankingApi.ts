import { supabase } from "./supabaseClient";
import { accounts as mockAccounts, transactionsByAccount as mockTransactions } from "../data/accounts";
import {
  Cuenta,
  MovimientoCuenta,
  Tarjeta as TarjetaEntity,
  Prestamo as PrestamoEntity,
  Pago as PagoEntity,
  Notificacion,
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

type CuentaRow = Pick<
  Cuenta,
  "id" | "usuario_id" | "numero_cuenta" | "nombre" | "tipo" | "moneda" | "saldo" | "estado" | "creado_en"
>;
type MovimientoCuentaRow = Pick<
  MovimientoCuenta,
  | "id"
  | "cuenta_id"
  | "tipo"
  | "monto"
  | "descripcion"
  | "categoria"
  | "saldo_despues"
  | "transferencia_relacionada_id"
  | "creado_en"
>;
type TarjetaRow = Pick<
  TarjetaEntity,
  "id" | "usuario_id" | "cuenta_id" | "tipo" | "marca" | "ultimos4" | "limite_credito" | "saldo_actual" | "creado_en"
>;
type PrestamoRow = Pick<
  PrestamoEntity,
  | "id"
  | "usuario_id"
  | "cuenta_id"
  | "nombre"
  | "monto_principal"
  | "tasa_interes"
  | "plazo_meses"
  | "fecha_inicio"
  | "fecha_fin"
  | "estado"
  | "saldo_pendiente"
  | "creado_en"
>;
type PagoRow = Pick<
  PagoEntity,
  | "id"
  | "usuario_id"
  | "cuenta_origen_id"
  | "tipo_destino"
  | "tarjeta_destino_id"
  | "prestamo_destino_id"
  | "monto"
  | "estado"
  | "creado_en"
  | "ejecutado_en"
>;
type NotificacionRow = Pick<Notificacion, "id" | "usuario_id" | "tipo" | "titulo" | "cuerpo" | "datos" | "leida_en" | "creado_en">;

const warnSupabase = (context: string, message?: string) => {
  const detail = message ? `: ${message}` : "";
  console.warn(`Supabase ${context}${detail}`);
};

export const fetchAccounts = async (userId?: string): Promise<Account[]> => {
  if (!supabase) {
    warnSupabase("no configurado en fetchAccounts");
    return mockAccounts;
  }

  try {
    const query = supabase
      .from("cuentas")
      .select("id,usuario_id,numero_cuenta,nombre,tipo,moneda,saldo,estado,creado_en")
      .order("creado_en", { ascending: false });
    const { data, error } = userId ? await query.eq("usuario_id", userId) : await query;

    if (error) {
      warnSupabase("error en fetchAccounts", error.message);
      return mockAccounts;
    }

    if (!data) return [];

    const rows = data as CuentaRow[];

    return rows.map((row) => ({
      id: row.id,
      name: row.nombre,
      number: row.numero_cuenta,
      balance: Number(row.saldo ?? 0),
      currency: row.moneda || "HNL",
    }));
  } catch (e: any) {
    warnSupabase("excepcion en fetchAccounts", e?.message);
    return mockAccounts;
  }
};

export const fetchAccountMovements = async (accountId: string): Promise<Transaction[]> => {
  if (!supabase) {
    warnSupabase("no configurado en fetchAccountMovements");
    return mockTransactions[accountId] || [];
  }

  try {
    const { data, error } = await supabase
      .from("movimientos_cuenta")
      .select("id,cuenta_id,tipo,monto,descripcion,categoria,saldo_despues,transferencia_relacionada_id,creado_en")
      .eq("cuenta_id", accountId)
      .order("creado_en", { ascending: false });

    if (error) {
      warnSupabase("error en fetchAccountMovements", error.message);
      return mockTransactions[accountId] || [];
    }

    if (!data) return [];

    const rows = data as MovimientoCuentaRow[];

    return rows.map((row) => ({
      id: String(row.id),
      date: row.creado_en,
      description: row.descripcion ?? "",
      amount: row.tipo === "debito" ? -Number(row.monto ?? 0) : Number(row.monto ?? 0),
    }));
  } catch (e: any) {
    warnSupabase("excepcion en fetchAccountMovements", e?.message);
    return mockTransactions[accountId] || [];
  }
};

export const fetchCards = async (userId?: string): Promise<Card[]> => {
  if (!supabase) {
    warnSupabase("no configurado en fetchCards");
    return [
      { id: "c1", type: "Visa Oro", brand: "Visa", last4: "1234", limit: 50000, balance: 12300 },
      { id: "c2", type: "Mastercard Black", brand: "Mastercard", last4: "5678", limit: 120000, balance: 45800 },
    ];
  }

  try {
    const query = supabase
      .from("tarjetas")
      .select("id,usuario_id,cuenta_id,tipo,marca,ultimos4,limite_credito,saldo_actual,creado_en")
      .order("creado_en", { ascending: false });
    const { data, error } = userId ? await query.eq("usuario_id", userId) : await query;
    if (error) {
      warnSupabase("error en fetchCards", error.message);
      return [];
    }
    if (!data) {
      return [];
    }
    const rows = data as TarjetaRow[];
    return rows.map((row) => ({
      id: row.id,
      type: row.tipo,
      brand: row.marca,
      last4: row.ultimos4,
      limit: row.limite_credito != null ? Number(row.limite_credito) : null,
      balance: row.saldo_actual != null ? Number(row.saldo_actual) : null,
    }));
  } catch (e: any) {
    warnSupabase("excepcion en fetchCards", e?.message);
    return [];
  }
};

export const fetchLoans = async (userId?: string): Promise<Loan[]> => {
  if (!supabase) {
    warnSupabase("no configurado en fetchLoans");
    return [
      { id: "l1", name: "Prestamo personal", balance: 85000, installment: 3200, dueDate: "10 de cada mes" },
      { id: "l2", name: "Prestamo hipotecario", balance: 1250000, installment: 12800, dueDate: "05 de cada mes" },
    ];
  }

  try {
    const query = supabase
      .from("prestamos")
      .select("id,usuario_id,cuenta_id,nombre,monto_principal,tasa_interes,plazo_meses,fecha_inicio,fecha_fin,estado,saldo_pendiente,creado_en")
      .order("creado_en", { ascending: false });
    const { data, error } = userId ? await query.eq("usuario_id", userId) : await query;
    if (error) {
      warnSupabase("error en fetchLoans", error.message);
      return [];
    }
    if (!data) {
      return [];
    }
    const rows = data as PrestamoRow[];
    return rows.map((row) => ({
      id: row.id,
      name: row.nombre,
      balance: Number(row.saldo_pendiente ?? 0),
      installment: null,
      dueDate: row.fecha_fin ?? null,
    }));
  } catch (e: any) {
    warnSupabase("excepcion en fetchLoans", e?.message);
    return [];
  }
};

export const fetchPayments = async (userId?: string): Promise<Payment[]> => {
  if (!supabase) {
    warnSupabase("no configurado en fetchPayments");
    return [
      { id: "p1", amount: 0, type: "tarjeta", status: "pendiente", createdAt: "", description: "Pago tarjeta de credito" },
      { id: "p2", amount: 0, type: "prestamo", status: "pendiente", createdAt: "", description: "Pago de prestamo" },
      { id: "p3", amount: 0, type: "servicio", status: "pendiente", createdAt: "", description: "Pago de servicios" },
    ];
  }

  try {
    const query = supabase
      .from("pagos")
      .select("id,usuario_id,cuenta_origen_id,tipo_destino,tarjeta_destino_id,prestamo_destino_id,monto,estado,creado_en,ejecutado_en")
      .order("creado_en", { ascending: false });
    const { data, error } = userId ? await query.eq("usuario_id", userId) : await query;
    if (error) {
      warnSupabase("error en fetchPayments", error.message);
      return [];
    }
    if (!data) return [];
    const rows = data as PagoRow[];
    return rows.map((row) => ({
      id: row.id,
      amount: Number(row.monto ?? 0),
      type: row.tipo_destino ?? "desconocido",
      status: row.estado ?? "pendiente",
      createdAt: row.creado_en,
    }));
  } catch (e: any) {
    warnSupabase("excepcion en fetchPayments", e?.message);
    return [];
  }
};

export const fetchNotifications = async (userId?: string): Promise<Notification[]> => {
  if (!supabase) {
    warnSupabase("no configurado en fetchNotifications");
    return [
      {
        id: "n1",
        title: "Deposito recibido",
        body: "L 5,000 a Cuenta de Ahorro",
        date: "2025-01-20",
        read: false,
      },
      {
        id: "n2",
        title: "Pago realizado",
        body: "Pago tarjeta de credito L 2,500",
        date: "2025-01-18",
        read: false,
      },
      {
        id: "n3",
        title: "Transferencia enviada",
        body: "L 1,200 a Juan Perez",
        date: "2025-01-17",
        read: false,
      },
    ];
  }

  try {
    const query = supabase
      .from("notificaciones")
      .select("id,usuario_id,tipo,titulo,cuerpo,datos,leida_en,creado_en")
      .order("creado_en", { ascending: false });
    const { data, error } = userId ? await query.eq("usuario_id", userId) : await query;
    if (error) {
      warnSupabase("error en fetchNotifications", error.message);
      return [];
    }
    if (!data) return [];
    const rows = data as NotificacionRow[];
    return rows.map((row) => ({
      id: row.id,
      title: row.titulo,
      body: row.cuerpo,
      date: row.creado_en,
      type: row.tipo,
      read: Boolean(row.leida_en),
    }));
  } catch (e: any) {
    warnSupabase("excepcion en fetchNotifications", e?.message);
    return [];
  }
};
