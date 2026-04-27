import { Link } from "@tanstack/react-router";
import { Heart, ShoppingBag, Star } from "lucide-react";
import type { Product } from "@/lib/types";
import { formatPrice, discountPct } from "@/lib/format";
import { useCart, useWishlist } from "@/lib/stores";
import { toast } from "sonner";

export function ProductCard({ product }: { product: Product }) {
  const wishlist = useWishlist();
  const cart = useCart();
  const liked = wishlist.has(product.id);
  const off = discountPct(product.price, product.compareAtPrice);
  const lowStock = product.stock < 10;

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    cart.add(product.id, { color: product.colors[0], size: product.sizes[0] }, 1);
    toast.success("Added to bag", { description: product.title });
  };

  const toggleWish = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    wishlist.toggle(product.id);
  };

  return (
    <Link to="/product/$id" params={{ id: product.id }} className="group relative block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-muted">
        <img
          src={product.images[0]}
          alt={product.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-0"
        />
        <img
          src={product.images[1] || product.images[0]}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover scale-105 transition-transform duration-500 group-hover:scale-100"
        />

        {/* badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {off > 0 && (
            <span className="rounded-md bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
              -{off}%
            </span>
          )}
          {product.badges.includes("New") && (
            <span className="rounded-md bg-foreground px-1.5 py-0.5 text-[10px] font-bold text-background">NEW</span>
          )}
          {product.badges.includes("Trending") && (
            <span className="rounded-md bg-warning px-1.5 py-0.5 text-[10px] font-bold text-foreground">🔥 HOT</span>
          )}
        </div>

        <button
          onClick={toggleWish}
          aria-label="Wishlist"
          className="absolute top-2 right-2 grid h-8 w-8 place-items-center rounded-full bg-background/90 backdrop-blur-sm shadow-sm transition-transform hover:scale-110"
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-primary text-primary" : "text-foreground"}`} />
        </button>

        <button
          onClick={quickAdd}
          className="absolute bottom-2 right-2 grid h-9 w-9 place-items-center rounded-full bg-foreground text-background opacity-0 translate-y-2 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-primary"
          aria-label="Quick add"
        >
          <ShoppingBag className="h-4 w-4" />
        </button>

        {lowStock && (
          <div className="absolute bottom-2 left-2 rounded-md bg-foreground/85 px-1.5 py-0.5 text-[10px] font-medium text-background">
            Only {product.stock} left
          </div>
        )}
      </div>

      <div className="pt-2.5 px-0.5">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground font-medium">{product.brand}</p>
        <p className="mt-0.5 text-sm line-clamp-1">{product.title}</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-primary">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
            )}
          </div>
          <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
            <Star className="h-3 w-3 fill-warning text-warning" />
            <span>{product.rating}</span>
            <span className="text-[10px]">({product.reviewCount})</span>
          </div>
        </div>
        <div className="mt-1.5 flex gap-1">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c}
              title={c}
              className="h-3 w-3 rounded-full border border-border"
              style={{ background: colorMap[c] || "var(--muted)" }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] text-muted-foreground">+{product.colors.length - 4}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

const colorMap: Record<string, string> = {
  Black: "#0f0f10",
  Ivory: "#f5f1e8",
  Pink: "#f7c4d4",
  Sage: "#a3b899",
  Cocoa: "#6b4f3a",
  Lilac: "#c8b6e2",
  Crimson: "#b3243a",
  Sand: "#e0cfa9",
  Sky: "#9ec6e3",
  Olive: "#7a8043",
};

export function ProductGrid({ products, cols = "default" }: { products: Product[]; cols?: "default" | "wide" }) {
  const gridCls = cols === "wide"
    ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
    : "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4";
  return (
    <div className={gridCls}>
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] rounded-xl bg-muted" />
      <div className="mt-2 h-3 w-1/3 bg-muted rounded" />
      <div className="mt-2 h-3 w-3/4 bg-muted rounded" />
      <div className="mt-2 h-4 w-1/2 bg-muted rounded" />
    </div>
  );
}