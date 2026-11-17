import { ArrowRight, Building2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function BusinessPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[38px] border border-[#E8E4DE] bg-white p-8 shadow-[0_20px_60px_rgba(23,23,23,0.04)] lg:p-12">
        <p className="eyebrow text-[#F36B21]">Business shipping</p>
        <h1 className="mt-3 text-5xl font-bold tracking-[-0.08em] text-[#171717]">Reliable freight support for scaling teams.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#777777]">
          Repida brings enterprise-grade dispatch planning, transparent communication and route intelligence to fast-moving businesses that need dependable delivery performance.
        </p>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Bulk shipping", text: "Plan large and recurring dispatches with route coordination and milestone visibility." },
          { title: "Retail fulfilment", text: "Support multi-location inventory drops and order fulfilment readiness." },
          { title: "B2B account support", text: "Dedicated account communication for essential outbound programmes." },
          { title: "Commercial analytics", text: "Measure delivery value, price efficiency and service performance across corridors." },
        ].map((item) => (
          <div key={item.title} className="rounded-[28px] border border-[#E8E4DE] bg-[#F4F0EA] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#F36B21] shadow-sm">
              <Building2 className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-[#171717]">{item.title}</h2>
            <p className="mt-3 leading-7 text-[#777777]">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="rounded-[32px] border border-[#E8E4DE] bg-white p-8 shadow-sm">
          <p className="eyebrow text-[#F36B21]">Why businesses choose Repida</p>
          <ul className="mt-6 space-y-4 text-[#171717]">
            {[
              "Coordination across warehouses, inventory flows and outbound dispatch windows.",
              "Transparent commercial updates for partnerships, returns and delivery issues.",
              "Consistent service planning that supports scaling operations across regions.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 text-[#249B68]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[32px] border border-[#E8E4DE] bg-[#171717] p-8 text-white">
          <p className="eyebrow text-[#F4C7AE]">Operational visibility</p>
          <div className="mt-6 space-y-6">
            <div className="rounded-2xl bg-white/5 p-4">
              <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                <span>On-time rate</span>
                <span className="font-semibold text-white">96.4%</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/10">
                <div className="h-full w-[96%] rounded-full bg-[#F36B21]" />
              </div>
            </div>
            <div className="rounded-2xl bg-white/5 p-4">
              <div className="mb-2 flex items-center justify-between text-sm text-white/70">
                <span>Route efficiency</span>
                <span className="font-semibold text-white">+23%</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/10">
                <div className="h-full w-[77%] rounded-full bg-[#F36B21]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 rounded-[34px] border border-[#E8E4DE] bg-[#F4F0EA] p-8 text-center">
        <p className="eyebrow text-[#F36B21]">Ready to discuss your next shipment volume?</p>
        <Link href="/pricing" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#F36B21] px-6 py-3 font-semibold text-white transition hover:bg-[#d85a1d]">
          View pricing <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
