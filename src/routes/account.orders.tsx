import { createFileRoute, Link } from "@tanstack/react-router";
import { Package } from "lucide-react";
import { useOrders } from "@/lib/stores";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/account/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const { orders } = useOrders();
  if (orders.length === 0) {
    return (
      <div className="rounded-2xl border border-border p-10 text-center">
        <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="font-semibold mb-1">No orders yet</p>
        <p className="text-sm text-muted-foreground mb-4">When you place your first order, it'll appear here.</p>
        <Link to="/"><Button>Start shopping</Button></Link>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      {orders.map((o) => (
        <div key={o.id} className="rounded-2xl border border-border p-5">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <div>
              <p className="text-xs text-muted-foreground">{new Date(o.date).toLocaleDateString()}</p>
              <p className="font-mono text-sm">{o.id}</p>
            </div>
            <span className="rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold capitalize">{o.status}</span>
          </div>
          <div className="space-y-2 mb-3">
            {o.items.map((it, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <img src={it.image} alt="" className="h-12 w-10 rounded object-cover" />
                <div className="flex-1 min-w-0"><p className="line-clamp-1">{it.title}</p><p className="text-xs text-muted-foreground">×{it.qty}</p></div>
                <span className="font-semibold">{formatPrice(it.price * it.qty)}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <p className="text-sm">Total: <strong className="text-primary">{formatPrice(o.total)}</strong></p>
          </div>
          <div className="mt-4 flex items-center justify-between">
            {o.trackingSteps.map((s, i) => (
              <div key={i} className="flex flex-col items-center flex-1">
                <div className={`h-3 w-3 rounded-full ${s.done ? "bg-primary" : "bg-muted"}`} />
                <span className="text-[10px] text-muted-foreground mt-1 text-center">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}