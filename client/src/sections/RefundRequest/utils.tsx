// types/refund.types.ts
export interface Avatar {
  public_id: string;
  url: string;
}

export interface User {
   phone?: string;
  _id: string;
  name: string;
  email: string;
  avatar?: Avatar;
}

export interface Event {
  _id: string;
  date: string;
  title?: string;
  venue?: string;
}

export interface Order {
  _id: string;
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
  orderNumber?: string;
}

export interface Ticket {
  ticketId: string;
  ticketType: string;
  quantity: number;
  unitPrice: number;
  _id: string;
}

export interface RefundPolicy {
  fullRefund?: boolean;
  fullRefundDaysBefore?: string;
}

export interface RefundRequestTyp {
    transactionId?: string;
  _id: string;
  user: User;
  event: Event;
  order: Order;
  tickets: Ticket[];
  totalAmount: number;
  refundAmount: number;
  paymentMethod: string;
  reason: string;
  refundPolicy?: RefundPolicy;
  eventDate: string;
  refundStatus: 'pending' | 'approved' | 'rejected' | 'refunded' | 'cancelled'|'processed';
  isAdminForwrd: boolean;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
  adminActionAt?: string;
}

export interface AdminState {
  refundReqs: RefundRequestTyp[];
  loading: boolean;
  error: string | null;
}