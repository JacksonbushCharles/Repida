import { AuthDemo } from "@/components/auth-demo";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <p className="eyebrow text-[#F36B21]">Customer access</p>
          <h1 className="mt-3 text-5xl font-bold tracking-[-0.08em] text-[#171717]">Track, manage and ship with ease.</h1>
          <p className="mt-5 max-w-lg text-lg leading-8 text-[#777777]">
            Sign in to manage shipments, review payment status, check support requests and access delivery details in one place.
          </p>
          <div className="mt-8 rounded-[28px] border border-[#E8E4DE] bg-[#F4F0EA] p-5 text-[#171717]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#777777]">Included</p>
            <ul className="mt-4 space-y-3">
              <li>• Shipment tracking and history</li>
              <li>• Address and delivery preferences</li>
              <li>• Support, invoices and notifications</li>
            </ul>
          </div>
        </div>

        <div>
          <AuthDemo
            googleEnabled={Boolean(
              process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET,
            )}
          />
          <p className="mt-4 text-center text-sm text-[#777777]">
            Administrator?{" "}
            <Link href="/admin-login" className="font-semibold text-[#F36B21] hover:underline">
              Admin sign-in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
