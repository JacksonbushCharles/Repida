import { ArrowRight, CheckCircle2, Globe2, ShieldCheck, Truck } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[38px] border border-[#E8E4DE] bg-white p-8 shadow-[0_20px_60px_rgba(23,23,23,0.04)] lg:p-12">
        <p className="eyebrow text-[#F36B21]">About Repida</p>
        <h1 className="mt-3 text-5xl font-bold tracking-[-0.08em] text-[#171717]">Built to move goods with confidence.</h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[#777777]">
          Repida was built for a world where businesses move inventory, families send parcels and teams need dependable logistics support. We combine route planning, transparent visibility and responsive support so every shipment keeps moving with less friction.
        </p>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {[
          { title: "International reach", text: "From regional corridors to cross-border routes, we serve growing markets with dependable coverage." },
          { title: "Operational clarity", text: "Clear documentation, consistent updates and realistic shipment milestones give customers confidence." },
          { title: "Human support", text: "Our teams stay close to the journey, managing exceptions and helping resolve issues quickly." },
        ].map((item) => (
          <div key={item.title} className="rounded-[28px] border border-[#E8E4DE] bg-white p-6 shadow-sm">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#F36B21]/10 text-[#F36B21]">
              <Globe2 className="h-5 w-5" />
            </div>
            <h2 className="text-2xl font-bold text-[#171717]">{item.title}</h2>
            <p className="mt-3 leading-7 text-[#777777]">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[28px] border border-[#E8E4DE] bg-[#F4F0EA] p-8">
          <p className="eyebrow text-[#F36B21]">What we stand for</p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.06em] text-[#171717]">Simple, reliable delivery operations.</h2>
          <ul className="mt-6 space-y-4 text-[#171717]">
            {[
              "Transparent delivery timelines and status updates.",
              "Professional route planning for both urgent and routine freight.",
              "Support for customers, businesses and account teams across a growing network.",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 text-[#249B68]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[28px] border border-[#E8E4DE] bg-white p-8 shadow-sm">
          <p className="eyebrow text-[#F36B21]">Our promise</p>
          <div className="mt-6 space-y-6">
            <div className="flex gap-3">
              <ShieldCheck className="h-6 w-6 text-[#249B68]" />
              <div>
                <p className="text-lg font-semibold text-[#171717]">Secure handoff</p>
                <p className="mt-1 text-sm leading-6 text-[#777777]">Every delivery process is built to protect consignments and customer trust.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Truck className="h-6 w-6 text-[#F36B21]" />
              <div>
                <p className="text-lg font-semibold text-[#171717]">Route visibility</p>
                <p className="mt-1 text-sm leading-6 text-[#777777]">Shipment progress is visible from pickup through customs and final delivery.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 flex justify-center">
        <Link href="/business" className="inline-flex items-center gap-2 rounded-full bg-[#F36B21] px-6 py-3 font-semibold text-white transition hover:bg-[#d85a1d]">
          Explore business logistics <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </main>
  );
}
