import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type FilterState = {
  priceMax: number;
  rating: number;
  colors: string[];
  sizes: string[];
  brands: string[];
  sort: "relevance" | "newest" | "price-asc" | "price-desc" | "rating";
};

export const defaultFilters: FilterState = {
  priceMax: 200,
  rating: 0,
  colors: [],
  sizes: [],
  brands: [],
  sort: "relevance",
};

export function FilterPanel({
  filters,
  setFilters,
  availableColors,
  availableSizes,
  availableBrands,
  onClose,
}: {
  filters: FilterState;
  setFilters: (f: FilterState) => void;
  availableColors: string[];
  availableSizes: string[];
  availableBrands: string[];
  onClose?: () => void;
}) {
  const toggle = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];

  return (
    <div className="space-y-6">
      {onClose && (
        <div className="flex items-center justify-between md:hidden">
          <h3 className="text-lg font-bold">Filters</h3>
          <button onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold mb-2">Price (up to ${filters.priceMax})</h4>
        <input
          type="range"
          min={5}
          max={200}
          value={filters.priceMax}
          onChange={(e) => setFilters({ ...filters, priceMax: +e.target.value })}
          className="w-full accent-primary"
        />
      </div>

      <div>
        <h4 className="text-sm font-semibold mb-2">Rating</h4>
        <div className="flex flex-wrap gap-2">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              onClick={() => setFilters({ ...filters, rating: filters.rating === r ? 0 : r })}
              className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs ${
                filters.rating === r ? "border-primary bg-primary/10 text-primary" : "border-border"
              }`}
            >
              {r}+ <Star className="h-3 w-3 fill-warning text-warning" />
            </button>
          ))}
        </div>
      </div>

      {availableColors.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Color</h4>
          <div className="flex flex-wrap gap-1.5">
            {availableColors.map((c) => {
              const active = filters.colors.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => setFilters({ ...filters, colors: toggle(filters.colors, c) })}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    active ? "border-primary bg-primary/10 text-primary" : "border-border"
                  }`}
                >
                  {c}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {availableSizes.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Size</h4>
          <div className="flex flex-wrap gap-1.5">
            {availableSizes.map((s) => {
              const active = filters.sizes.includes(s);
              return (
                <button
                  key={s}
                  onClick={() => setFilters({ ...filters, sizes: toggle(filters.sizes, s) })}
                  className={`rounded-md border px-3 py-1 text-xs font-semibold ${
                    active ? "border-primary bg-primary/10 text-primary" : "border-border"
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {availableBrands.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold mb-2">Brand</h4>
          <div className="space-y-1.5 max-h-40 overflow-y-auto">
            {availableBrands.map((b) => (
              <label key={b} className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brands.includes(b)}
                  onChange={() => setFilters({ ...filters, brands: toggle(filters.brands, b) })}
                  className="accent-primary"
                />
                {b}
              </label>
            ))}
          </div>
        </div>
      )}

      <Button variant="outline" className="w-full" onClick={() => setFilters(defaultFilters)}>
        Reset filters
      </Button>
    </div>
  );
}

export function applyFilters<T extends { price: number; rating: number; colors: string[]; sizes: string[]; brand: string; badges: string[]; reviewCount: number }>(
  items: T[],
  f: FilterState,
) {
  let r = items.filter((p) => p.price <= f.priceMax && p.rating >= f.rating);
  if (f.colors.length) r = r.filter((p) => p.colors.some((c) => f.colors.includes(c)));
  if (f.sizes.length) r = r.filter((p) => p.sizes.some((s) => f.sizes.includes(s)));
  if (f.brands.length) r = r.filter((p) => f.brands.includes(p.brand));
  switch (f.sort) {
    case "price-asc": r = [...r].sort((a, b) => a.price - b.price); break;
    case "price-desc": r = [...r].sort((a, b) => b.price - a.price); break;
    case "rating": r = [...r].sort((a, b) => b.rating - a.rating); break;
    case "newest": r = [...r].sort((a, b) => (b.badges.includes("New") ? 1 : 0) - (a.badges.includes("New") ? 1 : 0)); break;
  }
  return r;
}