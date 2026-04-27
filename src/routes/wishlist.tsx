import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useWishlist } from "@/lib/stores";
import { products } from "@/lib/catalog";
import { ProductGrid } from "@/components/product/ProductCard";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — GLAM" }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const wishlist = useWishlist();
  const items = products.filter((p) => wishlist.ids.includes(p.id));
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <h1 className="text-3xl font-black mb-6">Your Wishlist ({items.length})</h1>
      {items.length === 0 ? (
        <div className="py-20 text-center">
          <div className="grid h-20 w-20 mx-auto mb-4 place-items-center rounded-full bg-muted"><Heart className="h-10 w-10 text-muted-foreground" /></div>
          <p className="text-lg font-semibold mb-2">No favorites yet</p>
          <p className="text-sm text-muted-foreground mb-4">Tap the heart on any product to save it here.</p>
          <Link to="/"><Button>Start shopping</Button></Link>
        </div>
      ) : (
        <ProductGrid products={items} />
      )}
    </div>
  );
}