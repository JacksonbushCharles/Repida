import { ArrowRight, Box, Globe2, Plane, Truck } from "lucide-react";
import Link from "next/link";
import { services } from "@/lib/mock-data";

export default function ServicesPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <p className="eyebrow text-[#F36B21]">Services</p>
        <h1 className="mt-3 text-5xl font-bold tracking-[-0.08em] text-[#171717]">Flexible logistics for every shipment.</h1>
      </div>

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {services.map((service) => (
          <div key={service.title} className="rounded-[28px] border border-[#E8E4DE] bg-white p-6 shadow-sm">
            <div className={`inline-flex rounded-full px-3 py-2 text-sm font-semibold ${service.accent}`}>
              <Box className="h-4 w-4" />
            </div>
            <h2 className="mt-5 text-2xl font-bold text-[#171717]">{service.title}</h2>
            <p className="mt-3 leading-7 text-[#777777]">{service.description}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 grid gap-8 lg:grid-cols-3">
        {[
          { title: "International forwarding", icon: Globe2, text: "Cross-border shipping coordination with customs and route support." },
          { title: "Fast-moving cargo", icon: Plane, text: "Priority air freight and urgent dispatch for time-sensitive consignments." },
          { title: "Regional road freight", icon: Truck, text: "Flexible road deliveries for businesses requiring dependable local or intercity transport." },
        ].map((item) => (
          <div key={item.title} className="rounded-[28px] border border-[#E8E4DE] bg-[#F4F0EA] p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#F36B21] shadow-sm">
              <item.icon className="h-5 w-5" />
            </div>
            <h3 className="text-2xl font-bold text-[#171717]">{item.title}</h3>
            <p className="mt-4 leading-7 text-[#777777]">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-[32px] border border-[#E8E4DE] bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="eyebrow text-[#F36B21]">Support</p>
            <h2 className="mt-2 text-4xl font-bold tracking-[-0.06em] text-[#171717]">Need help choosing the right service?</h2>
          </div>
          <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[#F36B21] px-6 py-3 font-semibold text-white transition hover:bg-[#d85a1d]">
            Talk to a logistics advisor <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
