import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ChevronRight, Heart, ShoppingBag, Star, Truck, Shield, RotateCcw, Store, Plus, Minus } from "lucide-react";
import { getProduct, products as allProducts } from "@/lib/catalog";
import { useCart, useWishlist, useRecent } from "@/lib/stores";
import { formatPrice, discountPct } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/ProductCard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$id")({
  loader: ({ params }) => {
    const product = getProduct(params.id);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.product.title} — GLAM` },
      { name: "description", content: loaderData?.product.description.slice(0, 155) },
      { property: "og:title", content: loaderData?.product.title },
      { property: "og:description", content: loaderData?.product.description.slice(0, 155) },
      { property: "og:image", content: loaderData?.product.images[0] },
      { name: "twitter:image", content: loaderData?.product.images[0] },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-7xl px-6 py-20 text-center">
      <h1 className="text-2xl font-bold mb-2">Product not found</h1>
      <Link to="/" className="text-primary hover:underline">Back to home</Link>
    </div>
  ),
  component: ProductPage,
});

const colorMap: Record<string, string> = {
  Black: "#0f0f10", Ivory: "#f5f1e8", Pink: "#f7c4d4", Sage: "#a3b899", Cocoa: "#6b4f3a",
  Lilac: "#c8b6e2", Crimson: "#b3243a", Sand: "#e0cfa9", Sky: "#9ec6e3", Olive: "#7a8043",
};

function ProductPage() {
  const { product } = Route.useLoaderData();
  const wishlist = useWishlist();
  const cart = useCart();
  const recent = useRecent();

  const [activeImg, setActiveImg] = useState(0);
  const [color, setColor] = useState(product.colors[0]);
  const [size, setSize] = useState(product.sizes[0] || "");
  const [qty, setQty] = useState(1);
  const [zip, setZip] = useState("");

  useEffect(() => {
    recent.add(product.id);
    setActiveImg(0);
    setColor(product.colors[0]);
    setSize(product.sizes[0] || "");
    setQty(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);

  const off = discountPct(product.price, product.compareAtPrice);
  const liked = wishlist.has(product.id);

  const related = useMemo(
    () => allProducts.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 8),
    [product.id, product.categorySlug],
  );
  const fbt = useMemo(
    () => allProducts.filter((p) => p.id !== product.id && p.brand === product.brand).slice(0, 3),
    [product.id, product.brand],
  );

  const addToBag = () => {
    if (product.sizes.length && !size) {
      toast.error("Please select a size");
      return;
    }
    cart.add(product.id, { color, size }, qty);
    toast.success("Added to bag", { description: `${product.title} × ${qty}` });
  };

  const fbtTotal = (fbt.reduce((s, p) => s + p.price, 0) + product.price);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/category/$slug" params={{ slug: product.categorySlug }} className="hover:text-primary capitalize">{product.categorySlug}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground line-clamp-1">{product.title}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
        {/* gallery */}
        <div className="flex gap-3">
          <div className="hidden sm:flex flex-col gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                onMouseEnter={() => setActiveImg(i)}
                onClick={() => setActiveImg(i)}
                className={`h-16 w-16 overflow-hidden rounded-lg border-2 ${activeImg === i ? "border-primary" : "border-transparent opacity-70"}`}
              >
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
          <div className="relative flex-1 aspect-[3/4] overflow-hidden rounded-2xl bg-muted group">
            <img src={product.images[activeImg]} alt={product.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            {off > 0 && (
              <span className="absolute top-3 left-3 rounded-md bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">-{off}% OFF</span>
            )}
          </div>
        </div>

        {/* details */}
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{product.brand}</p>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">{product.title}</h1>

          <div className="flex items-center gap-3 mt-2 text-sm">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} className={`h-4 w-4 ${i <= Math.round(product.rating) ? "fill-warning text-warning" : "text-muted"}`} />
              ))}
              <span className="ml-1 font-semibold">{product.rating}</span>
            </div>
            <span className="text-muted-foreground">·</span>
            <a href="#reviews" className="text-muted-foreground hover:text-primary">{product.reviewCount} reviews</a>
          </div>

          <div className="mt-4 flex items-baseline gap-3">
            <span className="text-3xl font-black text-primary">{formatPrice(product.price)}</span>
            {product.compareAtPrice && (
              <>
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.compareAtPrice)}</span>
                <span className="rounded bg-primary/10 text-primary px-2 py-0.5 text-xs font-bold">SAVE {off}%</span>
              </>
            )}
          </div>

          {product.colors.length > 0 && (
            <div className="mt-5">
              <p className="text-sm"><span className="font-semibold">Color:</span> {color}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    aria-label={c}
                    className={`h-9 w-9 rounded-full border-2 transition-all ${color === c ? "border-primary scale-110" : "border-border"}`}
                    style={{ background: colorMap[c] || "var(--muted)" }}
                  />
                ))}
              </div>
            </div>
          )}

          {product.sizes.length > 0 && (
            <div className="mt-5">
              <div className="flex items-center justify-between text-sm">
                <p><span className="font-semibold">Size:</span> {size || "—"}</p>
                <button className="text-xs text-primary hover:underline">Size guide</button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`min-w-[44px] rounded-md border px-3 py-2 text-sm font-semibold ${size === s ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-foreground"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-5 flex items-center gap-3">
            <div className="inline-flex items-center rounded-full border border-border">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-2.5 hover:bg-muted rounded-l-full"><Minus className="h-4 w-4" /></button>
              <span className="px-4 text-sm font-semibold">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="p-2.5 hover:bg-muted rounded-r-full"><Plus className="h-4 w-4" /></button>
            </div>
            <span className="text-xs text-muted-foreground">{product.stock} in stock</span>
          </div>

          <div className="mt-5 flex gap-3">
            <Button onClick={addToBag} className="flex-1 h-12 rounded-full text-base font-bold" style={{ background: "var(--gradient-primary)" }}>
              <ShoppingBag className="mr-2 h-5 w-5" /> Add to Bag
            </Button>
            <Button onClick={() => wishlist.toggle(product.id)} variant="outline" className="h-12 w-12 rounded-full p-0">
              <Heart className={`h-5 w-5 ${liked ? "fill-primary text-primary" : ""}`} />
            </Button>
          </div>

          {/* shipping estimator */}
          <div className="mt-6 rounded-2xl border border-border p-4 space-y-3">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-semibold">Delivery</p>
                <p className="text-xs text-muted-foreground">Enter zip code for ETA</p>
              </div>
              <input
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="ZIP"
                className="w-24 rounded-lg border border-input bg-background px-3 py-1.5 text-sm outline-none focus:border-primary"
              />
            </div>
            {zip.length >= 4 && (
              <p className="text-xs text-success animate-in fade-in">
                Delivers to {zip} in 3–5 business days · Free shipping over $49
              </p>
            )}
            <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground pt-2 border-t border-border">
              <div className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> Secure pay</div>
              <div className="flex items-center gap-1.5"><RotateCcw className="h-4 w-4" /> 30-day returns</div>
              <div className="flex items-center gap-1.5"><Store className="h-4 w-4" /> Verified seller</div>
            </div>
          </div>

          {/* seller */}
          <div className="mt-4 flex items-center gap-3 rounded-2xl bg-muted/50 p-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-foreground text-background font-bold">
              {product.brand[0]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{product.brand}</p>
              <p className="text-xs text-muted-foreground">98% positive · 12k+ orders</p>
            </div>
            <Button variant="outline" size="sm">Visit shop</Button>
          </div>
        </div>
      </div>

      {/* description, FBT, reviews */}
      <div className="mt-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-xl font-bold mb-3">About this item</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </section>

          {fbt.length > 0 && (
            <section>
              <h2 className="text-xl font-bold mb-3">Frequently bought together</h2>
              <div className="rounded-2xl border border-border p-4">
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                  <div className="flex items-center gap-2 shrink-0">
                    <img src={product.images[0]} alt="" className="h-20 w-16 rounded-lg object-cover" />
                    {fbt.map((p) => (
                      <div key={p.id} className="flex items-center gap-2">
                        <Plus className="h-4 w-4 text-muted-foreground" />
                        <Link to="/product/$id" params={{ id: p.id }}>
                          <img src={p.images[0]} alt="" className="h-20 w-16 rounded-lg object-cover hover:opacity-80" />
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
                  <p className="text-sm">Bundle price: <strong className="text-primary text-lg">{formatPrice(fbtTotal * 0.9)}</strong> <span className="text-xs text-muted-foreground line-through">{formatPrice(fbtTotal)}</span></p>
                  <Button onClick={addToBag} variant="outline" className="rounded-full">Add bundle to bag</Button>
                </div>
              </div>
            </section>
          )}

          <section id="reviews">
            <div className="flex items-baseline justify-between mb-3">
              <h2 className="text-xl font-bold">Reviews ({product.reviewCount})</h2>
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-warning text-warning" />
                <strong>{product.rating}</strong>
                <span className="text-muted-foreground">/ 5</span>
              </div>
            </div>
            <div className="space-y-3">
              {product.reviews?.map((r) => (
                <div key={r.id} className="rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-semibold">{r.user}</p>
                    <div className="flex items-center gap-1">
                      {[1,2,3,4,5].map((i) => (
                        <Star key={i} className={`h-3 w-3 ${i <= r.rating ? "fill-warning text-warning" : "text-muted"}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm font-medium">{r.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{r.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-3">Questions & Answers</h2>
            <Accordion type="single" collapsible className="rounded-2xl border border-border">
              <AccordionItem value="q1" className="px-4">
                <AccordionTrigger>How does the sizing run?</AccordionTrigger>
                <AccordionContent>True to size for most. If you're between sizes, we recommend sizing up for a relaxed fit.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="q2" className="px-4">
                <AccordionTrigger>What's the return policy?</AccordionTrigger>
                <AccordionContent>Free returns within 30 days. Item must be unworn with original tags attached.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="q3" className="px-4 border-b-0">
                <AccordionTrigger>How is shipping calculated?</AccordionTrigger>
                <AccordionContent>Free standard shipping over $49. Express options available at checkout.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>
        </div>

        <aside className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider">You may also like</h3>
          {related.slice(0, 4).map((p) => (
            <Link key={p.id} to="/product/$id" params={{ id: p.id }} className="flex items-center gap-3 rounded-xl p-2 hover:bg-muted">
              <img src={p.images[0]} alt="" className="h-16 w-14 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="text-sm line-clamp-1">{p.title}</p>
                <p className="text-xs text-muted-foreground">{p.brand}</p>
                <p className="text-sm font-bold text-primary">{formatPrice(p.price)}</p>
              </div>
            </Link>
          ))}
        </aside>
      </div>

      {/* customers also viewed */}
      <section className="mt-12">
        <h2 className="text-xl font-bold mb-4">Customers also viewed</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {related.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}