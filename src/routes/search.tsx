import { createFileRoute } from "@tanstack/react-router";
import { zodValidator, fallback } from "@tanstack/zod-adapter";
import { z } from "zod";
import { useMemo, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { products } from "@/lib/catalog";
import { ProductGrid } from "@/components/product/ProductCard";
import { FilterPanel, applyFilters, defaultFilters, type FilterState } from "@/components/product/FilterPanel";
import { Button } from "@/components/ui/button";

const searchSchema = z.object({
  q: fallback(z.string(), "").default(""),
});

export const Route = createFileRoute("/search")({
  validateSearch: zodValidator(searchSchema),
  head: () => ({
    meta: [{ title: "Search — GLAM" }],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = Route.useNavigate();
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  const items = useMemo(() => {
    const query = q.toLowerCase().trim();
    if (!query) return products;
    if (query === "sale") return products.filter((p) => p.compareAtPrice);
    if (query === "trending") return products.filter((p) => p.badges.includes("Trending"));
    if (query === "new") return products.filter((p) => p.badges.includes("New"));
    if (query === "best") return [...products].sort((a, b) => b.rating - a.rating).slice(0, 40);
    return products.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.tags.some((t) => t.includes(query)) ||
        p.categorySlug.includes(query),
    );
  }, [q]);

  const filtered = useMemo(() => applyFilters(items, filters), [items, filters]);
  const colors = useMemo(() => Array.from(new Set(items.flatMap((p) => p.colors))).sort(), [items]);
  const sizes = useMemo(() => Array.from(new Set(items.flatMap((p) => p.sizes))), [items]);
  const brands = useMemo(() => Array.from(new Set(items.map((p) => p.brand))).sort(), [items]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h1 className="text-2xl font-black">
          {q ? <>Results for <span className="text-primary">"{q}"</span></> : "Browse all"}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">{filtered.length} of {items.length} items</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters(true)}
          className="md:hidden inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
        <input
          value={q}
          onChange={(e) => navigate({ search: { q: e.target.value } })}
          placeholder="Refine search..."
          className="hidden md:block flex-1 max-w-sm rounded-full border border-input bg-background px-4 py-2 text-sm outline-none focus:border-primary"
        />
        <select
          value={filters.sort}
          onChange={(e) => setFilters({ ...filters, sort: e.target.value as FilterState["sort"] })}
          className="rounded-full border border-border bg-background px-3 py-1.5 text-sm"
        >
          <option value="relevance">Relevance</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
          <option value="rating">Top rated</option>
        </select>
      </div>

      <div className="grid md:grid-cols-[240px_1fr] gap-6">
        <aside className="hidden md:block">
          <div className="sticky top-32">
            <FilterPanel filters={filters} setFilters={setFilters} availableColors={colors} availableSizes={sizes} availableBrands={brands} />
          </div>
        </aside>

        {showFilters && (
          <div className="md:hidden fixed inset-0 z-50 bg-foreground/40" onClick={() => setShowFilters(false)}>
            <div className="absolute bottom-0 left-0 right-0 max-h-[85vh] overflow-y-auto rounded-t-3xl bg-background p-5" onClick={(e) => e.stopPropagation()}>
              <FilterPanel filters={filters} setFilters={setFilters} availableColors={colors} availableSizes={sizes} availableBrands={brands} onClose={() => setShowFilters(false)} />
              <Button className="w-full mt-4" onClick={() => setShowFilters(false)}>Show {filtered.length}</Button>
            </div>
          </div>
        )}

        <div>
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold mb-2">No matches found</p>
              <p className="text-sm text-muted-foreground">Try a different search or reset filters.</p>
            </div>
          ) : (
            <ProductGrid products={filtered} />
          )}
        </div>
      </div>
    </div>
  );
}