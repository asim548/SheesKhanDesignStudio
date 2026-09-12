import {
  SIZE_CHART_NOTE,
  SIZE_CHART_SIZES,
  SIZE_CHART_TABLES,
} from "@/lib/size-chart";
import SizeChartTrigger from "@/components/shop/SizeChartTrigger";

export default function SizeChartSection({ className = "" }: { className?: string }) {
  return (
    <section className={className}>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="label-luxury mb-2">Size Guide</p>
          <h2 className="heading-display text-2xl md:text-3xl">
            Women&apos;s Size Guide
          </h2>
        </div>
        <SizeChartTrigger label="Open Full Chart" />
      </div>

      <div className="space-y-10">
        {SIZE_CHART_TABLES.map((table) => (
          <div key={table.title}>
            <h3 className="mb-4 text-center font-serif text-lg font-light text-espresso md:text-xl">
              {table.title}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px] border-collapse text-center font-sans text-sm text-espresso">
                <thead>
                  <tr>
                    <th className="border border-espresso/20 bg-blush/20 px-3 py-2.5 text-left font-normal text-espresso/60" />
                    {SIZE_CHART_SIZES.map((size) => (
                      <th
                        key={size}
                        className="border border-espresso/20 bg-blush/20 px-2 py-2.5 font-sans text-[11px] uppercase tracking-[0.14em]"
                      >
                        {size}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {table.rows.map((row) => (
                    <tr key={row.label}>
                      <td className="border border-espresso/20 px-3 py-2.5 text-left text-xs text-espresso/75 md:text-sm">
                        {row.label}
                      </td>
                      {row.values.map((value, i) => (
                        <td
                          key={`${row.label}-${i}`}
                          className="border border-espresso/20 px-2 py-2.5 text-sm"
                        >
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center font-sans text-xs italic text-espresso/50">
        {SIZE_CHART_NOTE}
      </p>
    </section>
  );
}
