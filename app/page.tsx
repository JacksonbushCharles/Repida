import Link from "next/link";
import { ArrowRight, CheckCircle2, ChevronRight, Clock3, Globe2, PackageCheck, ShieldCheck, Star, Truck } from "lucide-react";
import { destinations, faqItems, services, shippingSteps } from "@/lib/mock-data";

export default function HomePage() {
  return (
    <main>
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-24 lg:pt-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow text-[#F36B21]">Global logistics, simplified</p>
            <h1 className="mt-5 text-5xl font-extrabold tracking-[-0.08em] text-[#171717] sm:text-6xl lg:text-7xl">
              Send Anything. <span className="text-[#F36B21]">Anywhere.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-[#777777]">
              Repida helps businesses and households move parcels, freight and urgent consignments across borders with clarity, speed and dependable tracking.
            </p>

            <div className="mt-8 rounded-[28px] border border-[#E8E4DE] bg-white p-4 shadow-[0_18px_50px_rgba(23,23,23,0.05)]">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#777777]">Pickup</label>
                  <input className="form-input" defaultValue="Lagos, Nigeria" />
                </div>
                <div>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-[#777777]">Destination</label>
                  <input className="form-input" defaultValue="London, United Kingdom" />
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <button className="inline-flex items-center justify-center gap-2 rounded-full bg-[#F36B21] px-5 py-3 font-semibold text-white transition hover:bg-[#d85a1d]">
                  Ship Now
                  <ArrowRight className="h-4 w-4" />
                </button>
                <Link href="/track" className="inline-flex items-center justify-center rounded-full border border-[#E8E4DE] px-5 py-3 font-semibold text-[#171717] transition hover:border-[#F36B21] hover:text-[#F36B21]">
                  Track Shipment
                </Link>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-3xl font-extrabold tracking-[-0.06em] text-[#171717]">120K+</p>
                <p className="mt-1 text-sm text-[#777777]">Shipments delivered</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold tracking-[-0.06em] text-[#171717]">98.6%</p>
                <p className="mt-1 text-sm text-[#777777]">On-time performance</p>
              </div>
              <div>
                <p className="text-3xl font-extrabold tracking-[-0.06em] text-[#171717]">24/7</p>
                <p className="mt-1 text-sm text-[#777777]">Route support</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-[32px] border border-[#E8E4DE] bg-[#F4F0EA] p-6 shadow-[0_24px_70px_rgba(23,23,23,0.08)]">
              <div className="absolute right-6 top-6 rounded-full bg-[#F36B21] px-3 py-1 text-xs font-bold text-white">Live</div>

              <div className="rounded-[28px] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between text-sm text-[#777777]">
                  <span>Route overview</span>
                  <span>ETA 18h 20m</span>
                </div>
                <div className="mt-6 space-y-5">
                  <div className="flex items-center justify-between rounded-2xl border border-[#E8E4DE] bg-[#F4F0EA] p-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-[#777777]">Origin</p>
                      <p className="mt-1 font-semibold">Lagos</p>
                    </div>
                    <Truck className="h-5 w-5 text-[#F36B21]" />
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-[0.18em] text-[#777777]">Destination</p>
                      <p className="mt-1 font-semibold">London</p>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#E8E4DE] p-4">
                    <div className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-[#777777]">
                      <span>Parcel</span>
                      <span>Priority</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-3 text-sm">
                      <div>
                        <p className="font-medium text-[#171717]">Electronics kit</p>
                        <p className="text-[#777777]">Weight: 12.4 kg</p>
                      </div>
                      <div className="rounded-full bg-[#F36B21]/10 px-3 py-1 text-xs font-semibold text-[#F36B21]">On route</div>
                    </div>
                  </div>

                  <div>
                    <div className="mb-2 flex items-center justify-between text-sm text-[#171717]">
                      <span>Parcel progress</span>
                      <span>82%</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-[#F4F0EA]">
                      <div className="h-full w-[82%] rounded-full bg-[#F36B21]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fff] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-[#F36B21]">Services</p>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.06em] text-[#171717]">Complete delivery support</h2>
            </div>
            <Link href="/services" className="inline-flex items-center gap-2 text-sm font-semibold text-[#171717]">
              Explore all services <ChevronRight className="h-4 w-4 text-[#F36B21]" />
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {services.map((service) => (
              <div key={service.title} className="rounded-[26px] border border-[#E8E4DE] bg-[#F4F0EA] p-5 transition hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(23,23,23,0.06)]">
                <div className={`mb-5 inline-flex rounded-full px-3 py-2 text-sm font-semibold ${service.accent}`}>
                  <PackageCheck className="h-4 w-4" />
                </div>
                <h3 className="text-xl font-bold text-[#171717]">{service.title}</h3>
                <p className="mt-3 leading-7 text-[#777777]">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-[#F36B21]">How it works</p>
            <h2 className="mt-3 text-4xl font-bold tracking-[-0.06em] text-[#171717]">Four simple steps to delivery</h2>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {shippingSteps.map((step, index) => (
            <div key={step} className="rounded-[28px] border border-[#E8E4DE] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F36B21] text-sm font-bold text-white">
                  {index + 1}
                </div>
                <p className="text-lg font-semibold text-[#171717]">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F1F1EF] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-[#F36B21]">Coverage</p>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.06em] text-[#171717]">Global destinations</h2>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {destinations.map((destination) => (
              <div key={destination} className="rounded-[24px] border border-[#E8E4DE] bg-white p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe2 className="h-5 w-5 text-[#F36B21]" />
                    <p className="font-semibold text-[#171717]">{destination}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-[#F36B21]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-[36px] border border-[#E8E4DE] bg-[#171717] p-8 text-white shadow-[0_32px_80px_rgba(23,23,23,0.14)] lg:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="eyebrow text-[#F4C7AE]">Track a shipment</p>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.06em] text-white">See every movement in real time.</h2>
            </div>
            <div className="flex w-full max-w-xl gap-3 rounded-full bg-white p-2 text-[#171717] shadow-sm">
              <input className="w-full bg-transparent px-4 py-3 text-sm outline-none" defaultValue="RPD-4821A" />
              <Link href="/track" className="inline-flex items-center justify-center rounded-full bg-[#F36B21] px-5 py-3 text-sm font-semibold text-white">
                Track
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#fff] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="eyebrow text-[#F36B21]">Business solutions</p>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.06em] text-[#171717]">Logistics built for growth.</h2>
              <p className="mt-5 text-lg leading-8 text-[#777777]">
                From high-volume commerce fulfilment to scheduled vehicle dispatch, Repida helps teams plan routes, reduce delays and keep customers informed.
              </p>
              <ul className="mt-7 space-y-4 text-[#171717]">
                {[
                  "Warehousing and cross-docking support",
                  "Dashboard insights for route performance",
                  "Priority communication for enterprise accounts",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-1 h-5 w-5 text-[#249B68]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/business" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#F36B21] px-5 py-3 font-semibold text-white transition hover:bg-[#d85a1d]">
                Learn about business shipping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                { title: "B2B fulfillment", detail: "Connect inventory, dispatch and delivery in one flow." },
                { title: "Priority routing", detail: "Optimise corridor capacity and day-of delivery performance." },
                { title: "Managed account support", detail: "Dedicated onboarding and account operations assistance." },
                { title: "Insight dashboards", detail: "Track performance, costs and service outcomes in context." },
              ].map((card) => (
                <div key={card.title} className="rounded-[26px] border border-[#E8E4DE] bg-[#F4F0EA] p-5 shadow-sm">
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#F36B21] shadow-sm">
                    <Clock3 className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-[#171717]">{card.title}</h3>
                  <p className="mt-3 leading-7 text-[#777777]">{card.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-5">
          {[
            { label: "Reliability", text: "Consistent routes, proven carriers and delivered promises." },
            { label: "Visibility", text: "Real-time shipment movement and escalation readiness." },
            { label: "Security", text: "Protected handoffs and verification checks at every stage." },
            { label: "Affordability", text: "Transparent pricing and optimised route planning." },
            { label: "Support", text: "Human support teams for customer and business account needs." },
          ].map((item) => (
            <div key={item.label} className="rounded-[26px] border border-[#E8E4DE] bg-white p-5 shadow-sm">
              <ShieldCheck className="h-8 w-8 text-[#F36B21]" />
              <h3 className="mt-4 text-xl font-bold text-[#171717]">{item.label}</h3>
              <p className="mt-3 text-sm leading-7 text-[#777777]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#F1F1EF] py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow text-[#F36B21]">Testimonials</p>
              <h2 className="mt-3 text-4xl font-bold tracking-[-0.06em] text-[#171717]">Trusted by customers and teams</h2>
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {[
              "Repida gave our retail operations a more predictable shipping flow and clearer customer updates.",
              "The team handled our urgent freight with detail and responsiveness from pickup to destination.",
              "Their tracking experience has been a real advantage for our fulfilment and support staff.",
            ].map((quote, index) => (
              <div key={quote} className="rounded-[26px] border border-[#E8E4DE] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-1 text-[#F36B21]">
                  {Array.from({ length: 5 }).map((_, starIndex) => (
                    <Star key={`${quote}-${starIndex}`} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-5 text-base leading-7 text-[#171717]">“{quote}”</p>
                <div className="mt-6 text-sm text-[#777777]">
                  <p className="font-semibold text-[#171717]">{["Nadia Lee", "Kofi Mensah", "Sophie Martin"][index]}</p>
                  <p>{["E-commerce lead", "Operations manager", "Supply chain director"][index]}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-[#F36B21]">FAQs</p>
            <h2 className="mt-3 text-4xl font-bold tracking-[-0.06em] text-[#171717]">Everything you need to know</h2>
          </div>
        </div>

        <div className="mt-10 space-y-4">
          {faqItems.map((item) => (
            <div key={item.question} className="rounded-[24px] border border-[#E8E4DE] bg-white p-5 shadow-sm">
              <p className="text-lg font-semibold text-[#171717]">{item.question}</p>
              <p className="mt-3 leading-7 text-[#777777]">{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[34px] border border-[#E8E4DE] bg-[#F4F0EA] p-8 text-center shadow-[0_20px_60px_rgba(23,23,23,0.05)] lg:p-12">
          <p className="eyebrow text-[#F36B21]">Ready to ship?</p>
          <h2 className="mt-3 text-4xl font-bold tracking-[-0.06em] text-[#171717]">Move goods with greater certainty.</h2>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/business" className="inline-flex items-center justify-center rounded-full bg-[#F36B21] px-6 py-3 font-semibold text-white transition hover:bg-[#d85a1d]">
              Request a quote
            </Link>
            <Link href="/track" className="inline-flex items-center justify-center rounded-full border border-[#E8E4DE] bg-white px-6 py-3 font-semibold text-[#171717] transition hover:border-[#F36B21] hover:text-[#F36B21]">
              Track a shipment
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
