import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useCart } from "@/lib/stores";
import { getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your Bag — GLAM" }] }),
  component: CartPage,
});

function CartPage() {
  const cart = useCart();
  const active = cart.items.filter((i) => !i.savedForLater);
  const subtotal = active.reduce((s, i) => {
    const p = getProduct(i.productId);
    return s + (p?.price ?? 0) * i.qty;
  }, 0);
  const shipping = subtotal > 49 || subtotal === 0 ? 0 : 6.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (active.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 sm:px-6 py-20 text-center">
        <div className="grid h-20 w-20 mx-auto mb-4 place-items-center rounded-full bg-muted"><ShoppingBag className="h-10 w-10 text-muted-foreground" /></div>
        <h1 className="text-2xl font-bold mb-2">Your bag is empty</h1>
        <Link to="/"><Button>Continue shopping</Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-black mb-6">Your Bag ({active.length})</h1>
      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-3">
          {active.map((item) => {
            const p = getProduct(item.productId);
            if (!p) return null;
            const key = `${item.productId}-${item.variant.color}-${item.variant.size}`;
            return (
              <div key={key} className="flex gap-4 rounded-2xl border border-border p-4">
                <Link to="/product/$id" params={{ id: p.id }} className="shrink-0">
                  <img src={p.images[0]} alt={p.title} className="h-28 w-24 rounded-lg object-cover" loading="lazy" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to="/product/$id" params={{ id: p.id }} className="text-sm font-medium hover:text-primary">{p.title}</Link>
                  <p className="text-xs text-muted-foreground mt-0.5">{[item.variant.color, item.variant.size].filter(Boolean).join(" / ")}</p>
                  <p className="text-base font-bold text-primary mt-1">{formatPrice(p.price)}</p>
                  <div className="mt-3 flex items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button onClick={() => cart.updateQty(p.id, item.variant, item.qty - 1)} className="p-1.5 hover:bg-muted rounded-l-full"><Minus className="h-3 w-3" /></button>
                      <span className="px-3 text-sm">{item.qty}</span>
                      <button onClick={() => cart.updateQty(p.id, item.variant, item.qty + 1)} className="p-1.5 hover:bg-muted rounded-r-full"><Plus className="h-3 w-3" /></button>
                    </div>
                    <button onClick={() => cart.remove(p.id, item.variant)} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1">
                      <Trash2 className="h-3 w-3" /> Remove
                    </button>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold">{formatPrice(p.price * item.qty)}</p>
                </div>
              </div>
            );
          })}
        </div>
        <aside className="rounded-2xl border border-border p-5 h-fit lg:sticky lg:top-32">
          <h2 className="font-bold mb-3">Order Summary</h2>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax (est.)</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-border"><span>Total</span><span className="text-primary">{formatPrice(total)}</span></div>
          </div>
          <Link to="/checkout">
            <Button className="w-full mt-4 h-12 rounded-full font-bold" style={{ background: "var(--gradient-primary)" }}>Checkout</Button>
          </Link>
        </aside>
      </div>
    </div>
  );
}