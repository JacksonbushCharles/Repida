import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const plans = [
  { name: "Standard", price: "$18", detail: "For personal parcels and light domestic shipping.", features: ["Tracked delivery", "Pickup scheduling", "Email updates"] },
  { name: "Priority", price: "$42", detail: "For businesses and urgent customer deliveries.", features: ["Priority route handling", "Live milestone tracking", "Dedicated support line"], featured: true },
  { name: "Freight", price: "$120", detail: "For regular business shipments and international freight workflows.", features: ["Volume-based pricing", "Custom dispatch planning", "Fulfilment coordination"] },
];

export default function PricingPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="eyebrow text-[#F36B21]">Pricing</p>
        <h1 className="mt-3 text-5xl font-bold tracking-[-0.08em] text-[#171717]">Simple, transparent shipping rates.</h1>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.name} className={`rounded-[28px] border p-6 shadow-sm ${plan.featured ? "border-[#F36B21] bg-[#F4F0EA]" : "border-[#E8E4DE] bg-white"}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#171717]">{plan.name}</h2>
              {plan.featured && <span className="rounded-full bg-[#F36B21] px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white">Popular</span>}
            </div>
            <div className="mt-5 flex items-end gap-2">
              <span className="text-4xl font-bold tracking-[-0.06em] text-[#171717]">{plan.price}</span>
              <span className="pb-2 text-sm text-[#777777]">/ shipment</span>
            </div>
            <p className="mt-4 leading-7 text-[#777777]">{plan.detail}</p>
            <ul className="mt-6 space-y-3 text-[#171717]">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-[#249B68]" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Link href="/business" className={`mt-8 inline-flex items-center gap-2 rounded-full px-5 py-3 font-semibold ${plan.featured ? "bg-[#F36B21] text-white" : "border border-[#E8E4DE] bg-white text-[#171717]"}`}>
              Get started <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
