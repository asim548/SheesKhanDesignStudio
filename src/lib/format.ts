/** Server-safe price formatter (cart has a client twin) */
export function formatPriceStatic(amount: number, currency = "PKR") {
  if (currency === "PKR") {
    return `Rs ${amount.toLocaleString("en-PK")}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
