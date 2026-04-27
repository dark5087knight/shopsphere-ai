import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Package } from "lucide-react";
import { useOrders, useWishlist, useRecent } from "@/lib/stores";
import { products } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";

export const Route = createFileRoute("/account/")({
  component: AccountOverview,
});

function AccountOverview() {
  const orders = useOrders();
  const wishlist = useWishlist();
  const recent = useRecent();
  const recentProducts = recent.ids.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-6 text-white" style={{ background: "var(--gradient-hero)" }}>
        <p className="text-xs tracking-widest opacity-80">WELCOME BACK</p>
        <h2 className="text-2xl font-black">Hello, beautiful 💖</h2>
        <p className="opacity-90 text-sm">You have {orders.orders.length} orders and {wishlist.ids.length} saved items.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/account/orders" className="rounded-2xl border border-border p-5 hover:border-primary transition-colors">
          <Package className="h-6 w-6 text-primary mb-2" />
          <p className="text-2xl font-black">{orders.orders.length}</p>
          <p className="text-sm text-muted-foreground">Total orders</p>
        </Link>
        <Link to="/wishlist" className="rounded-2xl border border-border p-5 hover:border-primary transition-colors">
          <Heart className="h-6 w-6 text-primary mb-2" />
          <p className="text-2xl font-black">{wishlist.ids.length}</p>
          <p className="text-sm text-muted-foreground">Wishlist items</p>
        </Link>
      </div>
      {recentProducts.length > 0 && (
        <div>
          <h3 className="font-bold mb-3">Recently viewed</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recentProducts.slice(0, 4).map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  );
}