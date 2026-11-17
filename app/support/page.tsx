import { ArrowRight, Headphones, MessageSquareText } from "lucide-react";
import Link from "next/link";

export default function SupportPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="rounded-[38px] border border-[#E8E4DE] bg-white p-8 shadow-sm lg:p-12">
        <p className="eyebrow text-[#F36B21]">Support centre</p>
        <h1 className="mt-3 text-5xl font-bold tracking-[-0.08em] text-[#171717]">Helpful service for every step of the journey.</h1>
      </div>

      <div className="mt-12 grid gap-5 lg:grid-cols-2">
        <div className="rounded-[28px] border border-[#E8E4DE] bg-[#F4F0EA] p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#F36B21] shadow-sm">
            <Headphones className="h-5 w-5" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-[#171717]">Talk to an expert</h2>
          <p className="mt-3 leading-7 text-[#777777]">Speak with a customer support specialist about delivery updates, shipping guidance or service planning.</p>
          <Link href="/contact" className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#F36B21] px-5 py-3 font-semibold text-white">
            Contact support <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="rounded-[28px] border border-[#E8E4DE] bg-white p-8 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F36B21]/10 text-[#F36B21]">
            <MessageSquareText className="h-5 w-5" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-[#171717]">Need help tracking a parcel?</h2>
          <p className="mt-3 leading-7 text-[#777777]">Use the tracking reference to view shipment status, progress milestones and estimated delivery updates.</p>
          <Link href="/track" className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#E8E4DE] px-5 py-3 font-semibold text-[#171717]">
            Track a shipment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
