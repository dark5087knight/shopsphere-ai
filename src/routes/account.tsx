import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Bell, CreditCard, Heart, MapPin, Package, User } from "lucide-react";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "My Account — GLAM" }] }),
  component: AccountLayout,
});

const navItems: { to: string; label: string; icon: typeof User; exact?: boolean }[] = [
  { to: "/account", label: "Overview", icon: User, exact: true },
  { to: "/account/orders", label: "Orders", icon: Package },
  { to: "/account/addresses", label: "Addresses", icon: MapPin },
  { to: "/account/payment", label: "Payment methods", icon: CreditCard },
  { to: "/account/notifications", label: "Notifications", icon: Bell },
  { to: "/wishlist", label: "Wishlist", icon: Heart },
];

function AccountLayout() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-black mb-6">My Account</h1>
      <div className="grid md:grid-cols-[240px_1fr] gap-6">
        <aside className="rounded-2xl border border-border p-3 h-fit">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const active = item.exact ? path === item.to : path.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to as "/account"}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${active ? "bg-primary/10 text-primary font-semibold" : "hover:bg-muted"}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>
        <div className="min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
}