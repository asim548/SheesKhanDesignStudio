/** Server-safe price formatter (cart has a client twin) */
import { formatDualPrice } from "./currency";

export function formatPriceStatic(amount: number, currency = "PKR") {
  return formatDualPrice(amount, currency).combined;
}
