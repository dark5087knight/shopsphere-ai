import { Link } from "@tanstack/react-router";
import { X, Minus, Plus, ShoppingBag, Truck, Tag } from "lucide-react";
import { useCart } from "@/lib/stores";
import { getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export function CartDrawer() {
  const cart = useCart();
  const [coupon, setCoupon] = useState(cart.coupon || "");

  useEffect(() => {
    if (cart.isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [cart.isOpen]);

  const active = cart.items.filter((i) => !i.savedForLater);
  const saved = cart.items.filter((i) => i.savedForLater);

  const subtotal = active.reduce((s, i) => {
    const p = getProduct(i.productId);
    return s + (p?.price ?? 0) * i.qty;
  }, 0);

  const shippingThreshold = 49;
  const remaining = Math.max(0, shippingThreshold - subtotal);
  const couponDiscount = cart.coupon ? subtotal * 0.1 : 0;
  const total = subtotal - couponDiscount;

  return (
    <>
      {cart.isOpen && (
        <div
          className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm animate-in fade-in"
          onClick={cart.close}
        />
      )}
      <aside
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md transform bg-background shadow-2xl transition-transform duration-300 flex flex-col ${
          cart.isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border p-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" />
            Your Bag <span className="text-muted-foreground font-normal">({active.length})</span>
          </h2>
          <button onClick={cart.close} className="rounded-full p-2 hover:bg-muted" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {subtotal > 0 && (
          <div className="border-b border-border p-3 bg-accent/40">
            <div className="flex items-center gap-2 text-xs">
              <Truck className="h-4 w-4 text-primary" />
              {remaining > 0 ? (
                <span>Add <strong>{formatPrice(remaining)}</strong> for FREE shipping</span>
              ) : (
                <span className="font-semibold text-success">🎉 You unlocked free shipping!</span>
              )}
            </div>
            <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full transition-all"
                style={{ width: `${Math.min(100, (subtotal / shippingThreshold) * 100)}%`, background: "var(--gradient-primary)" }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {active.length === 0 && saved.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="grid h-20 w-20 place-items-center rounded-full bg-muted mb-4">
                <ShoppingBag className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold">Your bag is empty</p>
              <p className="text-sm text-muted-foreground mb-4">Discover trending styles below</p>
              <Button onClick={cart.close} asChild>
                <Link to="/">Start shopping</Link>
              </Button>
            </div>
          )}

          {active.map((item) => {
            const p = getProduct(item.productId);
            if (!p) return null;
            const key = `${item.productId}-${item.variant.color}-${item.variant.size}`;
            return (
              <div key={key} className="flex gap-3">
                <Link to="/product/$id" params={{ id: p.id }} onClick={cart.close} className="shrink-0">
                  <img src={p.images[0]} alt={p.title} className="h-24 w-20 rounded-lg object-cover" loading="lazy" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link to="/product/$id" params={{ id: p.id }} onClick={cart.close} className="text-sm font-medium line-clamp-2 hover:text-primary">
                    {p.title}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {[item.variant.color, item.variant.size].filter(Boolean).join(" / ")}
                  </p>
                  <p className="text-sm font-semibold text-primary mt-1">{formatPrice(p.price)}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="inline-flex items-center rounded-full border border-border">
                      <button onClick={() => cart.updateQty(item.productId, item.variant, item.qty - 1)} className="p-1.5 hover:bg-muted rounded-l-full">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-sm">{item.qty}</span>
                      <button onClick={() => cart.updateQty(item.productId, item.variant, item.qty + 1)} className="p-1.5 hover:bg-muted rounded-r-full">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex gap-2 text-xs">
                      <button onClick={() => cart.saveForLater(item.productId, item.variant)} className="text-muted-foreground hover:text-primary">Save</button>
                      <button onClick={() => cart.remove(item.productId, item.variant)} className="text-muted-foreground hover:text-destructive">Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {saved.length > 0 && (
            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-semibold mb-3">Saved for later ({saved.length})</h3>
              <div className="space-y-3">
                {saved.map((item) => {
                  const p = getProduct(item.productId);
                  if (!p) return null;
                  const key = `s-${item.productId}-${item.variant.color}-${item.variant.size}`;
                  return (
                    <div key={key} className="flex gap-3 opacity-80">
                      <img src={p.images[0]} alt="" className="h-16 w-14 rounded object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm line-clamp-1">{p.title}</p>
                        <p className="text-xs text-primary font-semibold">{formatPrice(p.price)}</p>
                        <button onClick={() => cart.moveToCart(item.productId, item.variant)} className="text-xs text-primary hover:underline mt-1">
                          Move to bag
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {active.length > 0 && (
          <div className="border-t border-border p-4 space-y-3 bg-card">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                  placeholder="Promo code"
                  className="w-full rounded-full border border-input bg-background pl-9 pr-3 h-9 text-sm outline-none focus:border-primary"
                />
              </div>
              <Button variant="outline" onClick={() => cart.applyCoupon(coupon)} disabled={!coupon}>
                Apply
              </Button>
            </div>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-success"><span>Promo ({cart.coupon})</span><span>-{formatPrice(couponDiscount)}</span></div>
              )}
              <div className="flex justify-between text-base font-bold pt-2 border-t border-border"><span>Total</span><span className="text-primary">{formatPrice(total)}</span></div>
            </div>
            <Link to="/checkout" onClick={cart.close}>
              <Button className="w-full h-12 text-base font-bold rounded-full" style={{ background: "var(--gradient-primary)" }}>
                Checkout — {formatPrice(total)}
              </Button>
            </Link>
            <Link to="/cart" onClick={cart.close} className="block text-center text-xs text-muted-foreground hover:text-primary">View full bag</Link>
          </div>
        )}
      </aside>
    </>
  );
}