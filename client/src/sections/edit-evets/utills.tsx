// src/types/eventTypes.ts

export interface CloudinaryImage {
  public_id: string;
  url: string;
}

export interface TicketType {
  ticketType: string;
  id: string;
  price: string;
  totalTickets: string;
  description: string;
  isLimitedSeat: boolean;
  isLinkPramotion: boolean;
  _id?: string;
}

export interface RefundPolicy {
  fullRefund: boolean;
  fullRefundDaysBefore?: string;
  partialRefund: boolean;
  partialRefundPercent?: string;
  noRefundAfterDate: boolean;
  noRefundDate?: Date;
  _id?: string;
}

export interface TicketConfiguration {
  _id: string;
  eventId: string;
  tickets: TicketType[];
  payStatus: 'free' | 'paid';
  purchaseDeadlineDate?: Date;
  isPurchaseDeadlineEnabled: boolean;
  paymentMethods?: string;
  refundPolicy: RefundPolicy;
  isRefundPolicyEnabled: boolean;
  __v?: number;
}

export interface VisibilitySettings {
  publicEvent: boolean;
  privateEvent: boolean;
}

export interface PromotionAndHighlight {
  homepageHighlighting: boolean;
  autoShareOnSocialMedia: boolean;
}

export interface Visibility {
  visibilityType: string;
  promotionAndHighlight: PromotionAndHighlight;
  _id: string;
  eventId: string;
  ticketCustomId: string;
  eventCustomizationId: string;
  customUrl: string;
  status: 'publish' | 'draft';
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface SocialMedia {
  whatsapp: string;
  linkedin: string;
  facebook: string;
  tiktok: string;
}

export interface Organizer {
  socialMedia: SocialMedia;
  _id: string;
  eventId: string;
  name: string;
  number: string;
  email: string;
  website: string;
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface Customization {
  eventLogo: CloudinaryImage;
  _id: string;
  eventId: string;
  ticketCustomId: string;
  themeColor: string;
  customColor: string;
  frame: 'circle' | 'square' | 'rounded' | 'triangle';
  createdAt: string;
  updatedAt: string;
  __v?: number;
}

export interface Event {
  coverImage: CloudinaryImage;
  portraitImage: CloudinaryImage;
  _id: string;
  eventName: string;
  date: string;
  time: string;
  category: string;
  eventType: string;
  averageRating: number;
  reviewCount: number;
  location: string;
  format: string;
  description: string;
  createdBy: string;
  isDelete: boolean;
  createdAt: string;
  updatedAt: string;
  __v?: number;
  ticketQuantity?: string;
  soldTicket?: number;
}

export interface EventData {
  event: Event;
  customization: Customization;
  tickets: TicketConfiguration;
  visibility: Visibility;
  organizer: Organizer;
}