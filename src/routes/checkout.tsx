import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, CreditCard, MapPin, Package, Truck } from "lucide-react";
import { useCart, useOrders } from "@/lib/stores";
import { getProduct } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import type { Address, Order } from "@/lib/types";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — GLAM" }] }),
  component: CheckoutPage,
});

const steps = [
  { id: 1, label: "Address", icon: MapPin },
  { id: 2, label: "Shipping", icon: Truck },
  { id: 3, label: "Payment", icon: CreditCard },
  { id: 4, label: "Review", icon: Package },
];

function CheckoutPage() {
  const cart = useCart();
  const orders = useOrders();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState<Address>({
    id: "", name: "", line1: "", line2: "", city: "", region: "", postal: "", country: "United States", phone: "", isDefault: true,
  });
  const [shipping, setShipping] = useState<"standard" | "express">("standard");
  const [payment, setPayment] = useState({ number: "", name: "", expiry: "", cvv: "" });

  const active = cart.items.filter((i) => !i.savedForLater);
  const subtotal = active.reduce((s, i) => {
    const p = getProduct(i.productId); return s + (p?.price ?? 0) * i.qty;
  }, 0);
  const shipCost = shipping === "express" ? 14.99 : subtotal > 49 ? 0 : 6.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipCost + tax;

  if (active.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-2">Your bag is empty</h1>
        <Link to="/"><Button>Continue shopping</Button></Link>
      </div>
    );
  }

  const validStep = () => {
    if (step === 1) return address.name && address.line1 && address.city && address.postal && address.phone;
    if (step === 3) return payment.number.length >= 12 && payment.name && payment.expiry && payment.cvv.length >= 3;
    return true;
  };

  const placeOrder = () => {
    const order: Order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toISOString(),
      status: "processing",
      items: active.map((i) => {
        const p = getProduct(i.productId)!;
        return { productId: p.id, title: p.title, image: p.images[0], price: p.price, qty: i.qty, variant: i.variant };
      }),
      subtotal, shipping: shipCost, tax, total,
      address: { ...address, id: `addr-${Date.now()}` },
      trackingSteps: [
        { label: "Order placed", date: new Date().toISOString(), done: true },
        { label: "Processing", done: true },
        { label: "Shipped", done: false },
        { label: "Out for delivery", done: false },
        { label: "Delivered", done: false },
      ],
    };
    orders.addOrder(order);
    if (address.name) orders.addAddress({ ...address, id: `addr-${Date.now()}` });
    cart.clear();
    toast.success("Order placed!", { description: order.id });
    navigate({ to: "/checkout/success" });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-black mb-6">Checkout</h1>

      {/* progress */}
      <div className="mb-8 flex items-center justify-between">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center flex-1">
            <div className={`flex items-center gap-2 ${step >= s.id ? "text-primary" : "text-muted-foreground"}`}>
              <div className={`grid h-9 w-9 place-items-center rounded-full border-2 ${step > s.id ? "bg-primary border-primary text-primary-foreground" : step === s.id ? "border-primary" : "border-border"}`}>
                {step > s.id ? <Check className="h-4 w-4" /> : <s.icon className="h-4 w-4" />}
              </div>
              <span className="hidden sm:inline text-sm font-semibold">{s.label}</span>
            </div>
            {i < steps.length - 1 && <div className={`flex-1 mx-2 h-0.5 ${step > s.id ? "bg-primary" : "bg-border"}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="rounded-2xl border border-border p-6">
          {step === 1 && (
            <div className="space-y-3">
              <h2 className="font-bold mb-2">Shipping address</h2>
              <Input label="Full name" value={address.name} onChange={(v) => setAddress({ ...address, name: v })} />
              <Input label="Address line 1" value={address.line1} onChange={(v) => setAddress({ ...address, line1: v })} />
              <Input label="Address line 2 (optional)" value={address.line2 || ""} onChange={(v) => setAddress({ ...address, line2: v })} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="City" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} />
                <Input label="State / Region" value={address.region} onChange={(v) => setAddress({ ...address, region: v })} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Postal code" value={address.postal} onChange={(v) => setAddress({ ...address, postal: v })} />
                <Input label="Phone" value={address.phone} onChange={(v) => setAddress({ ...address, phone: v })} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <h2 className="font-bold mb-2">Shipping method</h2>
              {[
                { id: "standard", title: "Standard (3–5 days)", price: subtotal > 49 ? 0 : 6.99 },
                { id: "express", title: "Express (1–2 days)", price: 14.99 },
              ].map((opt) => (
                <label key={opt.id} className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer ${shipping === opt.id ? "border-primary bg-primary/5" : "border-border"}`}>
                  <input type="radio" checked={shipping === opt.id} onChange={() => setShipping(opt.id as "standard" | "express")} className="accent-primary" />
                  <div className="flex-1"><p className="text-sm font-semibold">{opt.title}</p></div>
                  <span className="font-bold text-primary">{opt.price === 0 ? "Free" : formatPrice(opt.price)}</span>
                </label>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-3">
              <h2 className="font-bold mb-2">Payment details</h2>
              <p className="text-xs text-muted-foreground mb-2">Demo only — no real charges. Use any 16-digit number.</p>
              <Input label="Card number" value={payment.number} onChange={(v) => setPayment({ ...payment, number: v })} />
              <Input label="Cardholder name" value={payment.name} onChange={(v) => setPayment({ ...payment, name: v })} />
              <div className="grid grid-cols-2 gap-3">
                <Input label="Expiry (MM/YY)" value={payment.expiry} onChange={(v) => setPayment({ ...payment, expiry: v })} />
                <Input label="CVV" value={payment.cvv} onChange={(v) => setPayment({ ...payment, cvv: v })} />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-bold">Review your order</h2>
              <div className="rounded-xl bg-muted/50 p-4 text-sm">
                <p className="font-semibold">{address.name}</p>
                <p className="text-muted-foreground">{address.line1}{address.line2 ? `, ${address.line2}` : ""}, {address.city}, {address.region} {address.postal}</p>
                <p className="text-muted-foreground">{address.phone}</p>
              </div>
              <div className="space-y-2">
                {active.map((i) => {
                  const p = getProduct(i.productId)!;
                  return (
                    <div key={`${i.productId}-${i.variant.color}-${i.variant.size}`} className="flex items-center gap-3 text-sm">
                      <img src={p.images[0]} alt="" className="h-12 w-10 rounded object-cover" />
                      <div className="flex-1 min-w-0"><p className="line-clamp-1">{p.title}</p><p className="text-xs text-muted-foreground">×{i.qty}</p></div>
                      <span className="font-semibold">{formatPrice(p.price * i.qty)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="mt-6 flex justify-between">
            <Button variant="outline" disabled={step === 1} onClick={() => setStep((s) => s - 1)}>Back</Button>
            {step < 4 ? (
              <Button disabled={!validStep()} onClick={() => setStep((s) => s + 1)} style={{ background: "var(--gradient-primary)" }}>Continue</Button>
            ) : (
              <Button onClick={placeOrder} style={{ background: "var(--gradient-primary)" }}>Place order — {formatPrice(total)}</Button>
            )}
          </div>
        </div>

        <aside className="rounded-2xl border border-border p-5 h-fit lg:sticky lg:top-32">
          <h2 className="font-bold mb-3">Summary</h2>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Items ({active.length})</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{shipCost === 0 ? "Free" : formatPrice(shipCost)}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-border"><span>Total</span><span className="text-primary">{formatPrice(total)}</span></div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Input({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
    </label>
  );
}