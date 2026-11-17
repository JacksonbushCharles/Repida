import Link from "next/link";
import { AccountNavigation } from "@/components/account-navigation";

const publicLinks = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/business", label: "Business" },
  { href: "/pricing", label: "Pricing" },
  { href: "/support", label: "Support" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F4F0EA] text-[#171717] antialiased">
      <header className="sticky top-0 z-40 border-b border-[#E8E4DE] bg-[#F4F0EA]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="rounded-full border border-[#E8E4DE] bg-white/80 px-4 py-3 shadow-[0_10px_30px_rgba(23,23,23,0.04)]">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F36B21] text-lg font-bold text-white">
                  R
                </div>
                <div>
                  <div className="text-xl font-bold tracking-[-0.04em] text-[#171717]">Repida</div>
                </div>
              </Link>

              <nav aria-label="Main navigation" className="hidden items-center gap-8 md:flex">
                {publicLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="text-sm font-medium text-[#171717]/75 transition hover:text-[#F36B21]">
                    {link.label}
                  </Link>
                ))}
              </nav>

              <div className="flex items-center gap-3">
                <Link href="/track" className="hidden text-sm font-medium text-[#171717]/75 transition hover:text-[#F36B21] sm:inline-flex">
                  Track
                </Link>
                <AccountNavigation />
                <Link href="/business" className="inline-flex items-center gap-2 rounded-full bg-[#F36B21] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#d85a1d]">
                  Ship Now
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      {children}

      <footer className="border-t border-[#E8E4DE] bg-[#171717] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-5 lg:px-8">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-2xl font-bold tracking-[-0.05em]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F36B21] text-lg font-bold text-white">
                R
              </span>
              Repida
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/70">
              Global delivery and logistics support for businesses, e-commerce teams and households moving goods across markets.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Company</p>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/services">Services</Link></li>
              <li><Link href="/business">Business</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Shipping</p>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li><Link href="/pricing">Pricing</Link></li>
              <li><Link href="/track">Track shipment</Link></li>
              <li><Link href="/faqs">FAQs</Link></li>
              <li><Link href="/policies">Policies</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">Popular routes</p>
            <ul className="mt-4 space-y-3 text-sm text-white/75">
              <li>Lagos → London</li>
              <li>Abuja → Dubai</li>
              <li>Accra → Paris</li>
              <li>Johannesburg → Frankfurt</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-white/55 sm:px-6 lg:px-8">
          © {new Date().getFullYear()} Repida. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
