import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Address, CartItem, Order, ProductVariant } from "./types";

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  coupon?: string;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (productId: string, variant: ProductVariant, qty?: number) => void;
  remove: (productId: string, variant: ProductVariant) => void;
  updateQty: (productId: string, variant: ProductVariant, qty: number) => void;
  saveForLater: (productId: string, variant: ProductVariant) => void;
  moveToCart: (productId: string, variant: ProductVariant) => void;
  applyCoupon: (code: string) => void;
  clear: () => void;
};

const sameVariant = (a: ProductVariant, b: ProductVariant) =>
  (a.color || "") === (b.color || "") && (a.size || "") === (b.size || "");

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      add: (productId, variant, qty = 1) =>
        set((s) => {
          const idx = s.items.findIndex((i) => i.productId === productId && sameVariant(i.variant, variant) && !i.savedForLater);
          if (idx >= 0) {
            const items = [...s.items];
            items[idx] = { ...items[idx], qty: items[idx].qty + qty };
            return { items, isOpen: true };
          }
          return { items: [...s.items, { productId, variant, qty }], isOpen: true };
        }),
      remove: (productId, variant) =>
        set((s) => ({ items: s.items.filter((i) => !(i.productId === productId && sameVariant(i.variant, variant))) })),
      updateQty: (productId, variant, qty) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === productId && sameVariant(i.variant, variant) ? { ...i, qty: Math.max(1, qty) } : i,
          ),
        })),
      saveForLater: (productId, variant) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === productId && sameVariant(i.variant, variant) ? { ...i, savedForLater: true } : i,
          ),
        })),
      moveToCart: (productId, variant) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.productId === productId && sameVariant(i.variant, variant) ? { ...i, savedForLater: false } : i,
          ),
        })),
      applyCoupon: (coupon) => set({ coupon }),
      clear: () => set({ items: [], coupon: undefined }),
    }),
    { name: "glam-cart" },
  ),
);

type WishlistState = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((s) => ({ ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id] })),
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] }),
    }),
    { name: "glam-wishlist" },
  ),
);

type RecentState = {
  ids: string[];
  add: (id: string) => void;
};
export const useRecent = create<RecentState>()(
  persist(
    (set) => ({
      ids: [],
      add: (id) =>
        set((s) => ({ ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, 12) })),
    }),
    { name: "glam-recent" },
  ),
);

type OrdersState = {
  orders: Order[];
  addresses: Address[];
  addOrder: (o: Order) => void;
  addAddress: (a: Address) => void;
  removeAddress: (id: string) => void;
};
export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      addresses: [],
      addOrder: (o) => set((s) => ({ orders: [o, ...s.orders] })),
      addAddress: (a) =>
        set((s) => ({
          addresses: a.isDefault
            ? [a, ...s.addresses.map((x) => ({ ...x, isDefault: false }))]
            : [...s.addresses, a],
        })),
      removeAddress: (id) => set((s) => ({ addresses: s.addresses.filter((a) => a.id !== id) })),
    }),
    { name: "glam-orders" },
  ),
);

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