import { create } from "zustand";

interface Payment {
  id: string;
  local: string;
  foreign: string;
  exchangeRateId: string;
  rateId: string;
} 
interface Recipient {
    name: string
    bankName: string
    bankCountry: string
    swiftCode: string
    bankAccount: string
    id: string
}
interface TransactionData {
    payment: Payment,
    recipient: Recipient
}
interface PartialTransactionData {
    payment: Payment,
    recipient: Omit<Recipient, "id">

}
interface Store {
  currentPayment?: Payment;
  currentRecipient?:Recipient
  currentPartialTransactionData?: PartialTransactionData
  currentTransactionData?: TransactionData
 setNewPayment: (payment: Payment)=> void
 clearPayment: ()=> void
 setNewRecipient: (recipient: Recipient)=> void
 clearRecipient: ()=> void
 setNewTransactionData: (transactionData: TransactionData)=> void
 clearTransactionData: ()=> void
 setNewPartialTransactionData: (partialTransactionData: PartialTransactionData)=> void
 clearPartialTransactionData: ()=> void
}
const store = create<Store>((set) => ({
    currentPayment: undefined,
    currentRecipient: undefined,
    currentPartialTransactionData: undefined,
    currentTransactionData: undefined,
    setNewPayment:  (payment ) => set({ currentPayment: payment }),
    clearPayment: ()=> set({currentPayment: undefined}),
    setNewRecipient:  (recipient ) => set({ currentRecipient: recipient }),
    clearRecipient: ()=> set({currentRecipient: undefined}),
    setNewTransactionData:  (transactionData ) => set({ currentTransactionData: transactionData }),
    clearTransactionData: ()=> set({currentTransactionData: undefined}),
    setNewPartialTransactionData:  (PartialTransactionData ) => set({ currentPartialTransactionData: PartialTransactionData }),
    clearPartialTransactionData: ()=> set({currentPartialTransactionData: undefined}),
    


}));
 export default store