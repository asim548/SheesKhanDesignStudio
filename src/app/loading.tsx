/**
 * Non-blocking route indicator — never covers the page.
 * (A full-screen loader caused stuck "loading…" on mobile navigations.)
 */
export default function Loading() {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-0 z-[200] h-[2px] overflow-hidden bg-espresso/10"
      role="status"
      aria-label="Loading"
    >
      <div className="h-full w-1/3 origin-left animate-pulse bg-espresso/60" />
      <span className="sr-only">Loading</span>
    </div>
  );
}
