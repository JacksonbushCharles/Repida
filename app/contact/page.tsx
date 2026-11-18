import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-[32px] border border-[#E8E4DE] bg-white p-8 shadow-sm">
          <p className="eyebrow text-[#F36B21]">Contact us</p>
          <h1 className="mt-3 text-5xl font-bold tracking-[-0.08em] text-[#171717]">Let’s plan your next delivery.</h1>
          <div className="mt-8 space-y-6 text-[#171717]">
            <div className="flex gap-4">
              <MapPin className="mt-1 h-5 w-5 text-[#F36B21]" />
              <div>
                <p className="font-semibold">Head office</p>
                <p className="text-[#777777]">Texas</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Phone className="mt-1 h-5 w-5 text-[#F36B21]" />
              <div>
                <p className="font-semibold">Call us</p>
                <p className="text-[#777777]">+234 (0) 800 000 1234</p>
              </div>
            </div>
            <div className="flex gap-4">
              <Mail className="mt-1 h-5 w-5 text-[#F36B21]" />
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-[#777777]">hello@repida.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-[#E8E4DE] bg-[#F4F0EA] p-8 shadow-sm">
          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-[#171717]">First name</label>
                <input className="form-input" defaultValue="Amina" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-[#171717]">Last name</label>
                <input className="form-input" defaultValue="Okafor" />
              </div>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#171717]">Email</label>
              <input className="form-input" type="email" defaultValue="hello@repida.com" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-[#171717]">How can we help?</label>
              <textarea className="form-input min-h-32 resize-none" defaultValue="We need support shipping a bulk pallet order to London." />
            </div>
            <button type="button" className="inline-flex items-center gap-2 rounded-full bg-[#F36B21] px-6 py-3 font-semibold text-white">
              Send request <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
