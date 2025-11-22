export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number; // positivo = abono, negativo = débito
};

export type Account = {
  id: string;
  name: string;
  number: string;
  balance: number;
  currency: string;
};

export const accounts: Account[] = [
  {
    id: "1",
    name: "Cuenta de Ahorro Lempiras",
    number: "0123 4567 8901",
    balance: 8500.5,
    currency: "L",
  },
  {
    id: "2",
    name: "Cuenta Corriente Lempiras",
    number: "0123 9999 0001",
    balance: 3200,
    currency: "L",
  },
];

export const transactionsByAccount: Record<string, Transaction[]> = {
  "1": [
    {
      id: "t1",
      date: "2025-01-10",
      description: "Depósito nómina",
      amount: 7500,
    },
    {
      id: "t2",
      date: "2025-01-12",
      description: "Pago supermercado",
      amount: -1500.25,
    },
    {
      id: "t3",
      date: "2025-01-15",
      description: "Transferencia recibida",
      amount: 500,
    },
  ],
  "2": [
    { id: "t4", date: "2025-01-09", description: "Pago luz", amount: -900 },
    {
      id: "t5",
      date: "2025-01-18",
      description: "Pago internet",
      amount: -700,
    },
  ],
};
