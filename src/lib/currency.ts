/** PKR per 1 USD — update via NEXT_PUBLIC_PKR_PER_USD on Vercel (e.g. 280). */
export function getPkrPerUsd(): number {
  const raw = process.env.NEXT_PUBLIC_PKR_PER_USD;
  const rate = raw ? Number(raw) : 280;
  return Number.isFinite(rate) && rate > 0 ? rate : 280;
}

export function pkrToUsd(pkr: number): number {
  if (!Number.isFinite(pkr) || pkr <= 0) return 0;
  return Math.round(pkr / getPkrPerUsd());
}

export function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDualPrice(
  amount: number,
  currency = "PKR"
): { primary: string; secondary: string | null; combined: string } {
  if (currency !== "PKR") {
    const primary = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
    return { primary, secondary: null, combined: primary };
  }

  const primary = `Rs ${amount.toLocaleString("en-PK")}`;
  const usd = pkrToUsd(amount);
  const secondary = usd > 0 ? formatUsd(usd) : null;
  const combined = secondary ? `${primary} · ${secondary}` : primary;

  return { primary, secondary, combined };
}
