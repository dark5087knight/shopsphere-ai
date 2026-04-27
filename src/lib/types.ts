export type Category = {
  slug: string;
  name: string;
  image: string;
  tagline: string;
};

export type ProductVariant = {
  color?: string;
  size?: string;
};

export type Review = {
  id: string;
  user: string;
  rating: number;
  title: string;
  body: string;
  date: string;
  images?: string[];
};

export type Product = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  categorySlug: string;
  colors: string[];
  sizes: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  badges: string[];
  tags: string[];
  reviews?: Review[];
};

export type CartItem = {
  productId: string;
  variant: ProductVariant;
  qty: number;
  savedForLater?: boolean;
};

export type Address = {
  id: string;
  name: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postal: string;
  country: string;
  phone: string;
  isDefault?: boolean;
};

export type Order = {
  id: string;
  date: string;
  status: "processing" | "shipped" | "delivered" | "cancelled";
  items: { productId: string; title: string; image: string; price: number; qty: number; variant: ProductVariant }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  address: Address;
  trackingSteps: { label: string; date?: string; done: boolean }[];
};