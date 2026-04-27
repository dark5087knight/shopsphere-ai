export const formatPrice = (n: number, currency = "USD") =>
  new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n);

export const discountPct = (price: number, compare?: number) =>
  compare && compare > price ? Math.round(((compare - price) / compare) * 100) : 0;