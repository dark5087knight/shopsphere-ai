import { createFileRoute } from "@tanstack/react-router";
import { useOrders } from "@/lib/stores";
import { MapPin, Trash2 } from "lucide-react";

export const Route = createFileRoute("/account/addresses")({
  component: AddressesPage,
});

function AddressesPage() {
  const { addresses, removeAddress } = useOrders();
  if (addresses.length === 0) {
    return <div className="rounded-2xl border border-border p-10 text-center text-muted-foreground"><MapPin className="h-8 w-8 mx-auto mb-2" />No saved addresses yet.</div>;
  }
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {addresses.map((a) => (
        <div key={a.id} className="rounded-2xl border border-border p-4">
          <div className="flex items-start justify-between">
            <div className="text-sm">
              <p className="font-semibold">{a.name}{a.isDefault && <span className="ml-2 text-xs text-primary">Default</span>}</p>
              <p className="text-muted-foreground">{a.line1}{a.line2 ? `, ${a.line2}` : ""}</p>
              <p className="text-muted-foreground">{a.city}, {a.region} {a.postal}</p>
              <p className="text-muted-foreground">{a.phone}</p>
            </div>
            <button onClick={() => removeAddress(a.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      ))}
    </div>
  );
}