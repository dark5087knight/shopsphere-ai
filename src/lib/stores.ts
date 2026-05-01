import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address, CartItem, Order, ProductVariant } from "./types";

const USER_ID = "guest-user-1";
import { API_URL, apiFetch as fetch } from './api';
type CartState = {
  items: CartItem[];
  isOpen: boolean;
  coupon?: string;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (productId: string, variant: ProductVariant, qty?: number) => Promise<void>;
  remove: (productId: string, variant: ProductVariant) => Promise<void>;
  updateQty: (productId: string, variant: ProductVariant, qty: number) => Promise<void>;
  saveForLater: (productId: string, variant: ProductVariant) => Promise<void>;
  moveToCart: (productId: string, variant: ProductVariant) => Promise<void>;
  applyCoupon: (code: string) => void;
  clear: () => Promise<void>;
  fetchState: () => Promise<void>;
};

const sameVariant = (a: ProductVariant, b: ProductVariant) =>
  (a.color || "") === (b.color || "") && (a.size || "") === (b.size || "");

export const useCart = create<CartState>()((set, get) => ({
  items: [],
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  fetchState: async () => {
    try {
      const res = await fetch(`${API_URL}/cart?user_id=${USER_ID}`);
      if (res.ok) {
        const data = await res.json();
        set({ items: data });
      }
    } catch (e) {
      console.error(e);
    }
  },
  add: async (productId, variant, qty = 1) => {
    try {
      await fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: USER_ID, productId, variant, qty, savedForLater: false })
      });
      await get().fetchState();
      set({ isOpen: true });
    } catch (e) { console.error(e); }
  },
  remove: async (productId, variant) => {
    // We need the item_id to delete. Find it first.
    const item = get().items.find((i) => i.productId === productId && sameVariant(i.variant, variant));
    if (!item) return;
    try {
      // @ts-ignore - Assuming the backend returns 'id' for CartItem
      await fetch(`${API_URL}/cart/${item.id}`, { method: "DELETE" });
      await get().fetchState();
    } catch (e) { console.error(e); }
  },
  updateQty: async (productId, variant, qty) => {
    const item = get().items.find((i) => i.productId === productId && sameVariant(i.variant, variant));
    if (!item) return;
    try {
      // @ts-ignore
      await fetch(`${API_URL}/cart/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, qty: Math.max(1, qty) })
      });
      await get().fetchState();
    } catch (e) { console.error(e); }
  },
  saveForLater: async (productId, variant) => {
    const item = get().items.find((i) => i.productId === productId && sameVariant(i.variant, variant));
    if (!item) return;
    try {
      // @ts-ignore
      await fetch(`${API_URL}/cart/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, savedForLater: true })
      });
      await get().fetchState();
    } catch (e) { console.error(e); }
  },
  moveToCart: async (productId, variant) => {
    const item = get().items.find((i) => i.productId === productId && sameVariant(i.variant, variant));
    if (!item) return;
    try {
      // @ts-ignore
      await fetch(`${API_URL}/cart/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, savedForLater: false })
      });
      await get().fetchState();
    } catch (e) { console.error(e); }
  },
  applyCoupon: (coupon) => set({ coupon }),
  clear: async () => {
    try {
      await fetch(`${API_URL}/cart/clear/${USER_ID}`, { method: "DELETE" });
      set({ items: [], coupon: undefined });
    } catch (e) { console.error(e); }
  },
}));

// Initialize cart state
useCart.getState().fetchState();


type WishlistState = {
  ids: string[];
  toggle: (id: string) => Promise<void>;
  has: (id: string) => boolean;
  clear: () => Promise<void>;
  fetchState: () => Promise<void>;
};

export const useWishlist = create<WishlistState>()((set, get) => ({
  ids: [],
  fetchState: async () => {
    try {
      const res = await fetch(`${API_URL}/wishlist?user_id=${USER_ID}`);
      if (res.ok) set({ ids: await res.json() });
    } catch (e) { console.error(e); }
  },
  toggle: async (id) => {
    try {
      await fetch(`${API_URL}/wishlist`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: USER_ID, productId: id })
      });
      await get().fetchState();
    } catch (e) { console.error(e); }
  },
  has: (id) => get().ids.includes(id),
  clear: async () => {
    try {
      await fetch(`${API_URL}/wishlist/clear/${USER_ID}`, { method: "DELETE" });
      set({ ids: [] });
    } catch (e) { console.error(e); }
  },
}));

useWishlist.getState().fetchState();


type RecentState = {
  ids: string[];
  add: (id: string) => Promise<void>;
  fetchState: () => Promise<void>;
};

export const useRecent = create<RecentState>()((set, get) => ({
  ids: [],
  fetchState: async () => {
    try {
      const res = await fetch(`${API_URL}/recent?user_id=${USER_ID}`);
      if (res.ok) set({ ids: await res.json() });
    } catch (e) { console.error(e); }
  },
  add: async (id) => {
    try {
      await fetch(`${API_URL}/recent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: USER_ID, productId: id })
      });
      await get().fetchState();
    } catch (e) { console.error(e); }
  },
}));

useRecent.getState().fetchState();


type OrdersState = {
  orders: Order[];
  addresses: Address[];
  addOrder: (o: Order) => Promise<void>;
  addAddress: (a: Address) => void; // Keep addresses local for now unless asked
  removeAddress: (id: string) => void;
  fetchState: () => Promise<void>;
};

export const useOrders = create<OrdersState>()((set, get) => ({
  orders: [],
  addresses: [], // Keeping simple addresses local for now as it wasn't strictly requested to move
  fetchState: async () => {
    try {
      const res = await fetch(`${API_URL}/orders?user_id=${USER_ID}`);
      if (res.ok) set({ orders: await res.json() });
    } catch (e) { console.error(e); }
  },
  addOrder: async (o) => {
    try {
      await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...o, user_id: USER_ID })
      });
      await get().fetchState();
    } catch (e) { console.error(e); }
  },
  addAddress: (a) =>
    set((s) => ({
      addresses: a.isDefault
        ? [a, ...s.addresses.map((x) => ({ ...x, isDefault: false }))]
        : [...s.addresses, a],
    })),
  removeAddress: (id) => set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),
}));

useOrders.getState().fetchState();


type ThemeState = { theme: "light" | "dark"; toggle: () => void; set: (t: "light" | "dark") => void };
export const useTheme = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      toggle: () =>
        set((s) => {
          const next = s.theme === "dark" ? "light" : "dark";
          if (typeof document !== "undefined") {
            document.documentElement.classList.toggle("dark", next === "dark");
          }
          return { theme: next };
        }),
      set: (t) => {
        if (typeof document !== "undefined") document.documentElement.classList.toggle("dark", t === "dark");
        set({ theme: t });
      },
    }),
    { name: "theme" },
  ),
);