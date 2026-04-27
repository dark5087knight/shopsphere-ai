import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Flame, Sparkles, TrendingUp } from "lucide-react";
import { categories, products } from "@/lib/catalog";
import { ProductCard, ProductGrid } from "@/components/product/ProductCard";
import { Countdown } from "@/components/product/CountdownBadge";
import { useRecent } from "@/lib/stores";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GLAM — Trendy Fashion, Beauty & More" },
      { name: "description", content: "New drops daily. Up to 70% off trending styles, beauty, accessories and more." },
    ],
  }),
  component: Index,
});

const heroSlides = [
  {
    eyebrow: "NEW SEASON",
    title: "Spring Drop is Here",
    sub: "Floral, fresh & flirty — up to 50% off",
    cta: "Shop Women",
    to: "/category/$slug" as const,
    params: { slug: "women" },
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=70",
    accent: "from-primary/80 to-purple-500/40",
  },
  {
    eyebrow: "MEN'S EDIT",
    title: "Sharp. Street. Statement.",
    sub: "The wardrobe overhaul starts now",
    cta: "Shop Men",
    to: "/category/$slug" as const,
    params: { slug: "men" },
    image: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=1600&q=70",
    accent: "from-foreground/70 to-primary/30",
  },
  {
    eyebrow: "GLOW UP",
    title: "Beauty That Hits Different",
    sub: "K-beauty, clean glam & viral musts",
    cta: "Shop Beauty",
    to: "/category/$slug" as const,
    params: { slug: "beauty" },
    image: "https://images.unsplash.com/photo-1522335789203-aaa2e757fff8?auto=format&fit=crop&w=1600&q=70",
    accent: "from-pink-500/60 to-orange-300/40",
  },
];

function Index() {
  const [slide, setSlide] = useState(0);
  const recentIds = useRecent((s) => s.ids);

  useEffect(() => {
    const t = setInterval(() => setSlide((s) => (s + 1) % heroSlides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const flashDeals = useMemo(
    () => products.filter((p) => p.compareAtPrice && p.badges.includes("Sale")).slice(0, 8),
    [],
  );
  const trending = useMemo(() => products.filter((p) => p.badges.includes("Trending")).slice(0, 8), []);
  const newArrivals = useMemo(() => products.filter((p) => p.badges.includes("New")).slice(0, 8), []);
  const recentProducts = useMemo(
    () => recentIds.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products,
    [recentIds],
  );
  const feed = useMemo(() => [...products].sort(() => Math.random() - 0.5).slice(0, 24), []);
  const dealEnd = useMemo(() => Date.now() + 6 * 3600 * 1000 + 23 * 60000, []);

  const s = heroSlides[slide];

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="relative h-[60vh] min-h-[420px] max-h-[640px] w-full">
          {heroSlides.map((sl, i) => (
            <div
              key={i}
              className={`absolute inset-0 transition-opacity duration-700 ${i === slide ? "opacity-100" : "opacity-0"}`}
            >
              <img src={sl.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className={`absolute inset-0 bg-gradient-to-r ${sl.accent}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            </div>
          ))}

          <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-6">
            <div key={slide} className="max-w-xl text-white animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-xs font-bold tracking-[0.3em] mb-3 opacity-90">{s.eyebrow}</p>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[1.05] mb-3">{s.title}</h1>
              <p className="text-base sm:text-lg opacity-90 mb-6">{s.sub}</p>
              <Link to={s.to} params={s.params}>
                <Button size="lg" className="rounded-full font-bold h-12 px-7 bg-white text-foreground hover:bg-white/90">
                  {s.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {heroSlides.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                className={`h-1.5 rounded-full transition-all ${i === slide ? "w-8 bg-white" : "w-2 bg-white/50"}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* QUICK BENEFITS */}
      <section className="border-b border-border bg-card">
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {[
            { t: "Free shipping", s: "Orders over $49" },
            { t: "30-day returns", s: "No questions asked" },
            { t: "Secure checkout", s: "Encrypted payments" },
            { t: "Daily new drops", s: "Always fresh" },
          ].map((b, i) => (
            <div key={i} className="px-4 py-4 text-center">
              <p className="text-sm font-semibold">{b.t}</p>
              <p className="text-xs text-muted-foreground">{b.s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FLASH DEALS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary">
              <Flame className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black">Flash Deals</h2>
              <p className="text-xs text-muted-foreground">Hurry — these prices won't last</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Ends in</span>
            <Countdown to={dealEnd} />
          </div>
        </div>
        <ProductGrid products={flashDeals} />
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-black mb-5">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="group relative aspect-square overflow-hidden rounded-2xl"
            >
              <img src={c.image} alt={c.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 text-white">
                <p className="text-lg font-bold">{c.name}</p>
                <p className="text-xs opacity-90">{c.tagline}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TRENDING */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-warning/20 text-warning">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-black">Trending Now</h2>
          </div>
          <Link to="/search" search={{ q: "trending" }} className="text-sm font-medium text-primary hover:underline">
            See all →
          </Link>
        </div>
        <ProductGrid products={trending} />
      </section>

      {/* RECENT ACTIVITY */}
      {recentProducts.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10 border-t border-border">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-accent text-accent-foreground">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black">Inspired by your activity</h2>
              <p className="text-xs text-muted-foreground">Picks based on what you've viewed</p>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar">
            {recentProducts.map((p) => (
              <div key={p.id} className="w-44 sm:w-52 shrink-0">
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* NEW ARRIVALS BANNER */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <div className="rounded-3xl overflow-hidden relative p-8 sm:p-12 text-white" style={{ background: "var(--gradient-hero)" }}>
          <div className="relative z-10 max-w-lg">
            <p className="text-xs font-bold tracking-[0.3em] mb-2 opacity-80">FRESH DROP</p>
            <h2 className="text-3xl sm:text-4xl font-black mb-3">New Arrivals — Just Landed</h2>
            <p className="opacity-90 mb-5">Hand-picked pieces from this week's drop. Get them before they sell out.</p>
            <Link to="/search" search={{ q: "new" }}>
              <Button size="lg" className="rounded-full bg-white text-foreground hover:bg-white/90">
                Shop the drop <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-6">
          <ProductGrid products={newArrivals} />
        </div>
      </section>

      {/* INFINITE FEED */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
        <h2 className="text-2xl font-black mb-5">Just for you</h2>
        <ProductGrid products={feed} cols="wide" />
        <div className="mt-8 text-center">
          <Link to="/search" search={{ q: "" }}>
            <Button variant="outline" className="rounded-full px-8">Discover more</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
