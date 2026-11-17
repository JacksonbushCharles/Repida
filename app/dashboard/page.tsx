"use client";

import { ArrowRight, Bell, LayoutDashboard, MapPinned, Package, Settings, ShieldCheck, Truck, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CustomerDashboardView } from "@/components/dashboard-views";
import { authClient } from "@/lib/auth-client";

const navItems = [
  { label: "Overview", icon: LayoutDashboard, current: true },
  { label: "My Shipments", icon: Package },
  { label: "Track Shipment", icon: MapPinned },
  { label: "Addresses", icon: Truck },
  { label: "Payments", icon: ShieldCheck },
  { label: "Support", icon: Bell },
  { label: "Settings", icon: Settings },
  { label: "Log Out", icon: LogOut },
];

export default function DashboardPage() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  async function signOut() {
    setSigningOut(true);
    setSignOutError("");
    try {
      const result = await authClient.signOut();
      if (result.error) {
        setSignOutError("Could not sign out. Please try again.");
        return;
      }
      router.replace("/login");
      router.refresh();
    } catch (error) {
      console.error("Could not sign out:", error);
      setSignOutError("Could not sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-[32px] border border-[#E8E4DE] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F36B21] text-lg font-bold text-white">R</div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#777777]">Customer</p>
              <p className="text-xl font-bold text-[#171717]">Repida</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.label === "Log Out" ? () => void signOut() : undefined}
                disabled={item.label === "Log Out" && signingOut}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition ${
                  item.current ? "bg-[#F4F0EA] text-[#171717]" : "text-[#777777] hover:bg-[#F4F0EA] hover:text-[#171717]"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label === "Log Out" && signingOut ? "Signing out…" : item.label}
              </button>
            ))}
            {signOutError && <p role="alert" className="px-3 text-sm text-red-700">{signOutError}</p>}
          </nav>

          <div className="mt-8 rounded-[24px] bg-[#F4F0EA] p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-[#777777]">Support</p>
            <p className="mt-3 text-lg font-semibold text-[#171717]">Need help with a delivery?</p>
            <Link href="/support" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#F36B21]">
              Get support <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>

        <CustomerDashboardView />
      </div>
    </main>
  );
}
