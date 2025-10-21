import { PaymentMethod } from "@/lib/server/stay/enum";

export const paymentMethodList = [
  { value: PaymentMethod.CARD_PAYMENT, label: "💳 Card Payment (Credit/Debit)" },
  { value: PaymentMethod.CASH, label: "💰 Cash" },
  { value: PaymentMethod.BANK_TRANSFER, label: "🏦 Bank Transfer" },
  { value: PaymentMethod.OTHER, label: "💳 Other" },
];