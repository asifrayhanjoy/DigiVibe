// TypeScript Definitions for DigiVibe Enterprise Digital Service Platform

export type CategoryId = "all" | "vpn" | "subscriptions" | "ip" | "smm" | "email" | "telegram" | "hosting";

export interface Category {
  id: CategoryId | string;
  labelEn: string;
  labelBn: string;
  icon: string;
  count: number;
}

export interface ServiceItem {
  id: string;
  _id?: string;
  title: string;
  category: CategoryId | string;
  badge: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  validity?: string;
  duration?: string;
  delivery: string;
  stock: string;
  icon: string;
  features: string[];
  popular?: boolean;
  subtitle?: string;
  description?: string;
  logo?: string;
  image?: string;
  overview?: string;
  logoType?: string;
  usdPrice?: string;
  inStock?: boolean;
  unit?: string;
  terms?: string;
  priceNote?: string;
  minQuantity?: number;
  maxQuantity?: number;
  operator?: string;
  tag?: string;
  badgeColor?: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface CartItem extends ServiceItem {
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  walletBalance?: number;
  role: "customer" | "admin";
  avatar?: string;
  createdAt?: string;
}


export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface PaymentMethodInfo {
  id: string;
  name: string;
  type: string;
  number: string;
  optionalNumber?: string;
  accountType: string;
  color: string;
  badge: string;
  status?: "active" | "processing";
  disabled?: boolean;
}

export interface OrderPayload {
  orderId?: string;
  items: CartItem[];
  totalAmount: number;
  paymentMethod: string;
  trxId: string;
  customerPhone: string;
  customerEmail?: string;
}

export interface OrderResponse {
  success: boolean;
  orderId: string;
  message: string;
  fulfillmentStatus: "pending" | "processing" | "completed";
  estimatedFulfillmentTime: string;
  data?: any;
}

export type Locale = "en" | "bn";

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  comment: string;
  rating: number;
  avatar: string;
  serviceBought: string;
}

export interface FAQItem {
  questionEn: string;
  questionBn: string;
  answerEn: string;
  answerBn: string;
}
