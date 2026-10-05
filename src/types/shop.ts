export interface ProductVariant {
  id: string;
  name: string;
  inStock: boolean;
}

export interface ProductReview {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  category: 'Living' | 'Lighting' | 'Audio' | 'Apothecary' | 'Objects';
  price: number;
  originalPrice?: number;
  description: string;
  materials: string;
  dimensions: string;
  origin: string;
  care: string;
  stock: number;
  rating: number;
  reviewCount: number;
  image: string;
  tags: string[];
  variants: ProductVariant[];
  reviews: ProductReview[];
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface CartItem {
  cartId: string;
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export type OrderStatus = 'Processing' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  deliveryMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'apple_pay' | 'cod';
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  trackingNumber: string;
  estimatedDelivery: string;
  notes?: string;
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  minSpend: number;
  description: string;
  isActive: boolean;
}
