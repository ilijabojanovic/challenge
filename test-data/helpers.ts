import { SHIPPING, type Shipping } from "./constants";

export function formatCartTotal(amount: number): string {
  const cents = Math.round(amount * 100) / 100;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents);
}

export function buildShipping(overrides: Partial<Shipping> = {}): Shipping {
  return { ...SHIPPING, ...overrides };
}
