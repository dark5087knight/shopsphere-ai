import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Search, Heart, ShoppingBag, User, Menu, X, Sun, Moon, Sparkles } from "lucide-react";
import { categories, products } from "@/lib/catalog";
import { useCart, useTheme, useWishlist } from "@/lib/stores";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const trending = ["satin dress", "cargo pants", "chunky sneakers", "lip gloss", "tote bag", "hoop earrings"];

export function Navbar() {
  const cart = useCart();
  const wishlist = useWishlist();
  const theme = useTheme();
  const navigate = useNavigate();
  const routerState = useRouterState();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const cartCount = cart.items.filter((i) => !i.savedForLater).reduce((s, i) => s + i.qty, 0);

  // Close menus on route change
  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
    setSearchFocused(false);
  }, [routerState.location.pathname]);

  // Sync theme on mount
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    theme.set(isDark ? "dark" : "light");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const suggestions = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return products.filter((p) => p.title.toLowerCase().includes(q) || p.tags.some((t) => t.includes(q))).slice(0, 6);
  }, [search]);

  const submitSearch = (q: string) => {
    if (!q.trim()) return;
    navigate({ to: "/search", search: { q } });
    setSearch("");
    setSearchFocused(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
      {/* announcement bar */}
      <div className="overflow-hidden bg-foreground text-background text-xs">
        <div className="flex animate-marquee whitespace-nowrap py-1.5">
          {Array.from({ length: 2 }).map((_, k) => (
            <div key={k} className="flex shrink-0 gap-10 px-5">
              <span>✨ Free shipping over $49</span>
              <span>🔥 Flash sale — up to 70% off</span>
              <span>🚚 Express delivery available</span>
              <span>💖 Sign up & get 15% off your first order</span>
              <span>🎁 New drops every Friday</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <button
          className="md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <Link to="/" className="flex items-center gap-1.5 text-2xl font-black tracking-tight">
          <span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--gradient-primary)" }}>
            GLAM
          </span>
          <Sparkles className="h-4 w-4 text-primary" />
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4">
          <button
            onMouseEnter={() => setMegaOpen(true)}
            onClick={() => setMegaOpen((v) => !v)}
            className="px-3 py-2 text-sm font-medium hover:text-primary transition-colors"
          >
            Categories
          </button>
          <Link to="/category/$slug" params={{ slug: "women" }} className="px-3 py-2 text-sm font-medium hover:text-primary">
            Women
          </Link>
          <Link to="/category/$slug" params={{ slug: "men" }} className="px-3 py-2 text-sm font-medium hover:text-primary">
            Men
          </Link>
          <Link to="/category/$slug" params={{ slug: "beauty" }} className="px-3 py-2 text-sm font-medium hover:text-primary">
            Beauty
          </Link>
          <Link to="/search" search={{ q: "sale" }} className="px-3 py-2 text-sm font-bold text-primary">
            Sale
          </Link>
        </nav>

        {/* search */}
        <div ref={searchRef} className="relative ml-auto flex-1 max-w-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch(search);
            }}
            className="relative"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              placeholder="Search trending styles, brands, items..."
              className="w-full rounded-full border border-input bg-secondary/60 pl-10 pr-4 h-10 text-sm outline-none focus:bg-background focus:border-primary transition-all"
            />
          </form>
          {searchFocused && (
            <div className="absolute left-0 right-0 top-12 rounded-2xl border border-border bg-popover shadow-lg p-3 z-50 animate-in fade-in slide-in-from-top-2">
              {suggestions.length > 0 ? (
                <div className="space-y-1">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 mb-1">Products</p>
                  {suggestions.map((p) => (
                    <Link
                      key={p.id}
                      to="/product/$id"
                      params={{ id: p.id }}
                      className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-muted"
                    >
                      <img src={p.images[0]} alt="" className="h-10 w-10 rounded object-cover" loading="lazy" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm">{p.title}</p>
                        <p className="text-xs text-muted-foreground">{p.brand}</p>
                      </div>
                      <span className="text-sm font-semibold text-primary">${p.price.toFixed(2)}</span>
                    </Link>
                  ))}
                </div>
              ) : (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground px-2 mb-2">Trending</p>
                  <div className="flex flex-wrap gap-1.5 px-2 pb-1">
                    {trending.map((t) => (
                      <button
                        key={t}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          submitSearch(t);
                        }}
                        className="rounded-full border border-border bg-muted px-3 py-1 text-xs hover:border-primary hover:text-primary transition-colors"
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={theme.toggle}
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Toggle theme"
          >
            {theme.theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <Link
            to="/account"
            className="hidden sm:inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Account"
          >
            <User className="h-4 w-4" />
          </Link>

          <Link
            to="/wishlist"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Wishlist"
          >
            <Heart className="h-4 w-4" />
            {wishlist.ids.length > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {wishlist.ids.length}
              </span>
            )}
          </Link>

          <button
            onClick={cart.open}
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-muted transition-colors"
            aria-label="Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* mega menu */}
      {megaOpen && (
        <div
          onMouseLeave={() => setMegaOpen(false)}
          className="hidden md:block absolute left-0 right-0 top-full border-b border-border bg-popover shadow-xl animate-in fade-in slide-in-from-top-2"
        >
          <div className="mx-auto grid max-w-7xl grid-cols-4 gap-4 p-6">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="group relative aspect-[5/3] overflow-hidden rounded-xl"
              >
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-3 left-4 text-white">
                  <p className="text-lg font-bold">{c.name}</p>
                  <p className="text-xs opacity-90">{c.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* secondary nav */}
      <div className="hidden md:block border-t border-border/50">
        <div className="mx-auto flex max-w-7xl items-center gap-6 overflow-x-auto px-6 py-2 text-xs no-scrollbar">
          <Link to="/search" search={{ q: "new" }} className="whitespace-nowrap text-muted-foreground hover:text-primary">New Arrivals</Link>
          <Link to="/search" search={{ q: "trending" }} className="whitespace-nowrap text-muted-foreground hover:text-primary">Trending</Link>
          <Link to="/search" search={{ q: "sale" }} className="whitespace-nowrap text-muted-foreground hover:text-primary">Flash Deals</Link>
          <Link to="/search" search={{ q: "best" }} className="whitespace-nowrap text-muted-foreground hover:text-primary">Best Sellers</Link>
          <Link to="/category/$slug" params={{ slug: "shoes" }} className="whitespace-nowrap text-muted-foreground hover:text-primary">Shoes</Link>
          <Link to="/category/$slug" params={{ slug: "bags" }} className="whitespace-nowrap text-muted-foreground hover:text-primary">Bags</Link>
          <Link to="/category/$slug" params={{ slug: "accessories" }} className="whitespace-nowrap text-muted-foreground hover:text-primary">Accessories</Link>
          <Link to="/category/$slug" params={{ slug: "home" }} className="whitespace-nowrap text-muted-foreground hover:text-primary">Home</Link>
        </div>
      </div>

      {/* mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background animate-in slide-in-from-top-2">
          <div className="flex flex-col p-4 gap-1">
            {categories.map((c) => (
              <Link
                key={c.slug}
                to="/category/$slug"
                params={{ slug: c.slug }}
                className="flex items-center gap-3 rounded-lg p-2 hover:bg-muted"
              >
                <img src={c.image} alt="" className="h-10 w-10 rounded-md object-cover" />
                <div>
                  <p className="text-sm font-medium">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.tagline}</p>
                </div>
              </Link>
            ))}
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={theme.toggle}>
                {theme.theme === "dark" ? "Light mode" : "Dark mode"}
              </Button>
              <Link to="/account">
                <Button variant="outline" className="w-full">My Account</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export const _navHelper = cn;