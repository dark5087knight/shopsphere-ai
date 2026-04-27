import { createFileRoute } from "@tanstack/react-router";
import { Bell } from "lucide-react";

const items = [
  { t: "Your order ORD-1234 has shipped", s: "Track in My Orders", time: "2h ago" },
  { t: "Flash sale ends tonight 🔥", s: "Up to 70% off — don't miss out", time: "1d ago" },
  { t: "New drop in Beauty", s: "12 fresh items just landed", time: "3d ago" },
];

export const Route = createFileRoute("/account/notifications")({
  component: () => (
    <div className="space-y-2">
      {items.map((n, i) => (
        <div key={i} className="flex items-start gap-3 rounded-2xl border border-border p-4">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary"><Bell className="h-4 w-4" /></div>
          <div className="flex-1"><p className="text-sm font-semibold">{n.t}</p><p className="text-xs text-muted-foreground">{n.s}</p></div>
          <span className="text-xs text-muted-foreground">{n.time}</span>
        </div>
      ))}
    </div>
  ),
});