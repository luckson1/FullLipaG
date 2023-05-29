import { create } from "zustand";

import {
  type ExchangeRate,
  type Payment,
  type Rate,
  type Recipient,
} from ".prisma/client";

interface TransactionData {
  payment: Payment & {
    rate: Rate;
    ExchangeRate: ExchangeRate;
  };
  recipient: Recipient;
}
interface PartialTransactionData {
  payment: Payment & {
    rate: Rate;
    ExchangeRate: ExchangeRate;
  };
  recipient: Omit<Recipient, "id">;
}

export interface Store {
  currentPayment?: Payment & {
    rate: Rate;
    ExchangeRate: ExchangeRate;
  };
  currentRecipient?: Recipient;
  currentPartialTransactionData?: PartialTransactionData;
  currentTransactionData?: TransactionData;
  paymentMethod: "M-pesa" | "pesaLink" | "Manual" | undefined;
}

interface Action {
  setNewPayment: (
    payment: Payment & {
      rate: Rate;
      ExchangeRate: ExchangeRate;
    },
  ) => void;
  clearPayment: () => void;
  setNewRecipient: (recipient: Recipient) => void;
  clearRecipient: () => void;
  setNewPaymentMethod: (
    paymentMethod: "M-pesa" | "pesaLink" | "Manual" | undefined,
  ) => void;
  clearPaymentMethod: () => void;
  setNewTransactionData: (transactionData: TransactionData) => void;
  clearTransactionData: () => void;
  setNewPartialTransactionData: (
    partialTransactionData: PartialTransactionData,
  ) => void;
  clearPartialTransactionData: () => void;
}
const useStore = create<Store & Action>((set) => ({
  currentPayment: undefined,
  currentRecipient: undefined,
  paymentMethod: undefined,
  setNewPaymentMethod: (payment) => set({ paymentMethod: payment }),
  clearPaymentMethod: () => set({ paymentMethod: undefined }),

  currentPartialTransactionData: undefined,
  currentTransactionData: undefined,
  setNewPayment: (payment) => set({ currentPayment: payment }),
  clearPayment: () => set({ currentPayment: undefined }),
  setNewRecipient: (recipient) => set({ currentRecipient: recipient }),
  clearRecipient: () => set({ currentRecipient: undefined }),
  setNewTransactionData: (transactionData) =>
    set({ currentTransactionData: transactionData }),
  clearTransactionData: () => set({ currentTransactionData: undefined }),
  setNewPartialTransactionData: (PartialTransactionData) =>
    set({ currentPartialTransactionData: PartialTransactionData }),
  clearPartialTransactionData: () =>
    set({ currentPartialTransactionData: undefined }),
}));

export default useStore;
