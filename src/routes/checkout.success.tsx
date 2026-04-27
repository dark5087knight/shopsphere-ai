import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { useOrders } from "@/lib/stores";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/checkout/success")({
  head: () => ({ meta: [{ title: "Order Confirmed — GLAM" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const orders = useOrders();
  const last = orders.orders[0];
  return (
    <div className="mx-auto max-w-2xl px-6 py-20 text-center">
      <div className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-success/15 text-success">
        <CheckCircle2 className="h-10 w-10" />
      </div>
      <h1 className="text-3xl font-black mb-2">Order confirmed!</h1>
      <p className="text-muted-foreground mb-1">Thanks for shopping with GLAM 💖</p>
      {last && <p className="text-sm font-mono text-muted-foreground mb-6">Order {last.id}</p>}
      <div className="flex justify-center gap-3">
        <Link to="/account/orders"><Button>View order</Button></Link>
        <Link to="/"><Button variant="outline">Keep shopping</Button></Link>
      </div>
    </div>
  );
}