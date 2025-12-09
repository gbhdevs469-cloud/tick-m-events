export interface BasePromo {
  code: string;
  eventId?: string;
  ticketSelection?: string;
  validityPeriodStart?: string;
  validityPeriodEnd?: string;
  minPurchase?: number;
}
 
export interface PercentagePromo extends BasePromo {
  type: "percentage";
  value: number; // % discount
}
 
export interface SimplePromo extends BasePromo {
  type: "simple";
  value: number; // fixed amount discount
}
 
export interface GroupPromo extends BasePromo {
  type: "group";
  groupBuy: number;
  groupGet: number;
}
 
export interface EarlyBuyerPromo extends BasePromo {
  type: "earlyBuyer";
  value: number; // % discount for early buyers
  earlyBuyerDiscountType?: 'percentage' | 'fixed'; // Add this field
  daysBeforeEvent?: number; // Add this field
  promotionType?: string; // Add this field for backend compatibility
}
 
// Add new promotion types
export interface PercentageDiscountPromo extends BasePromo {
  type: "percentageDiscount";
  value: number; // % discount
}
 
export interface FixedValueDiscountPromo extends BasePromo {
  type: "fixedValueDiscount";
  value: number; // fixed amount discount
}
 
export interface EarlyBuyerDiscountPromo extends BasePromo {
  type: "earlyBuyerDiscount";
  value: number;
  earlyBuyerDiscountType: 'percentage' | 'fixed';
  daysBeforeEvent: number;
  promotionType?: string;
}
 
export type PromoCode =
  | PercentagePromo
  | SimplePromo
  | GroupPromo
  | EarlyBuyerPromo
  | PercentageDiscountPromo
  | FixedValueDiscountPromo
  | EarlyBuyerDiscountPromo;
 
export const availablePromoCodes: PromoCode[] = [
    { code: 'SAVE20', type: 'percentage', value: 20, minPurchase: 10000 }, // 20% off
    { code: 'FIXED5000', type: 'simple', value: 5000, minPurchase: 1000 }, // 5000 XAF off
    { code: 'GROUP3FOR2', type: 'group', groupBuy: 3, groupGet: 1 }, // buy 3 get 1 free
];
 