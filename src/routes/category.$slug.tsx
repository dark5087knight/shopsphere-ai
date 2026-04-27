import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ChevronRight, SlidersHorizontal } from "lucide-react";
import { getCategory, productsByCategory } from "@/lib/catalog";
import type { Category } from "@/lib/types";
import { ProductGrid } from "@/components/product/ProductCard";
import { FilterPanel, applyFilters, defaultFilters, type FilterState } from "@/components/product/FilterPanel";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const cat = getCategory(params.slug);
    if (!cat) throw notFound();
    return { category: cat };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.category.name} — GLAM` },
      { name: "description", content: `Shop ${loaderData?.category.name}: ${loaderData?.category.tagline}.` },
      { property: "og:title", content: `${loaderData?.category.name} — GLAM` },
      { property: "og:image", content: loaderData?.category.image },
    ],
  }),
  notFoundComponent: () => (
    <div className="mx-auto max-w-7xl px-6 py-20 text-center">
      <h1 className="text-2xl font-bold mb-2">Category not found</h1>
      <Link to="/" className="text-primary hover:underline">Back to home</Link>
    </div>
  ),
  component: CategoryPage,
});

function CategoryPage() {
  const { category } = Route.useLoaderData() as { category: Category };
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);

  const items = useMemo(() => productsByCategory(category.slug), [category.slug]);
  const filtered = useMemo(() => applyFilters(items, filters), [items, filters]);

  const colors = useMemo(() => Array.from(new Set(items.flatMap((p) => p.colors))).sort(), [items]);
  const sizes = useMemo(() => Array.from(new Set(items.flatMap((p) => p.sizes))), [items]);
  const brands = useMemo(() => Array.from(new Set(items.map((p) => p.brand))).sort(), [items]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
      {/* breadcrumbs */}
      <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
        <Link to="/" className="hover:text-primary">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{category.name}</span>
      </nav>

      {/* hero */}
      <div className="relative h-40 sm:h-56 w-full rounded-2xl overflow-hidden mb-6">
        <img src={category.image} alt={category.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/10" />
        <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-10 text-white">
          <p className="text-xs tracking-widest opacity-80">{items.length} ITEMS</p>
          <h1 className="text-3xl sm:text-5xl font-black">{category.name}</h1>
          <p className="opacity-90">{category.tagline}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setShowFilters((v) => !v)}
          className="md:hidden inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-sm"
        >
          <SlidersHorizontal className="h-4 w-4" /> Filters
        </button>
        <p className="hidden md:block text-sm text-muted-foreground">{filtered.length} of {items.length} results</p>
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
              <Button className="w-full mt-4" onClick={() => setShowFilters(false)}>Show {filtered.length} results</Button>
            </div>
          </div>
        )}

        <div>
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold mb-2">No products match your filters</p>
              <Button variant="outline" onClick={() => setFilters(defaultFilters)}>Reset filters</Button>
            </div>
          ) : (
            <ProductGrid products={filtered} />
          )}
        </div>
      </div>
    </div>
  );
}