export const processOneTableHeaders = ["#", "Ticket Type ", "Unit Price (XAF)", "Included Benefits", "Selection"];
 
export interface PaymentOption {
  src: string;
  name: string;
  value: string;
}
 
const paymentIcons: Record<string, string> = {
  "Mobile Money": "./assets/images/payment-gateway-logo/mobile-money.png",
  "Cash": "./assets/images/payment-gateway-logo/bank-transfer.png",
  "Orange Money": "./assets/images/payment-gateway-logo/orange-money.png",
  "Bank Card": "./assets/images/payment-gateway-logo/bank-card.jpg",
  "Bank Transfer": "./assets/images/payment-gateway-logo/bank-transfer.png",
  "Cash on Delivery": "./assets/images/payment-gateway-logo/bank-transfer.png",
};
 
export function getPaymentOptions(methods: string[]): PaymentOption[] {
  return methods.map((method) => ({
    src: paymentIcons[method] || "./assets/images/payment-gateway-logo/default.png",
    name: method,
    value: method.toLowerCase().replace(/\s+/g, "_"), // e.g. "Mobile Money" → "mobile_money"
  }));
}