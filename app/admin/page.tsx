import { Download, LayoutDashboard, Search, Settings, ShieldCheck, Truck } from "lucide-react";
import { redirect } from "next/navigation";
import { AdminDashboardView } from "@/components/dashboard-views";
import { SignOutButton } from "@/components/admin-controls";
import { getAdminAccess } from "@/lib/admin-auth";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Shipments", icon: Truck },
  { label: "Routes", icon: Search },
  { label: "Drivers", icon: ShieldCheck },
  { label: "Settings", icon: Settings },
  { label: "Reports", icon: Download },
];

export default async function AdminPage() {
  const access = await getAdminAccess();
  if (!access.authorized) {
    if (access.reason === "unconfigured") {
      return (
        <main className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold">Admin access unavailable</h1>
          <p className="mt-3 text-[#777777]">
            Configure the database, authentication secret, and admin email before signing in.
          </p>
        </main>
      );
    }

    redirect(access.reason === "unauthenticated" ? "/admin-login" : "/dashboard");
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="rounded-[32px] border border-[#E8E4DE] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F36B21] text-lg font-bold text-white">R</div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-[#777777]">Super admin</p>
              <p className="text-xl font-bold text-[#171717]">Repida</p>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium transition ${
                  item.active ? "bg-[#F4F0EA] text-[#171717]" : "text-[#777777] hover:bg-[#F4F0EA] hover:text-[#171717]"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}
          </nav>
          <div className="mt-8 border-t border-[#E8E4DE] pt-4">
            <SignOutButton redirectTo="/admin-login" />
          </div>
        </aside>

        <AdminDashboardView />
      </div>
    </main>
  );
}
