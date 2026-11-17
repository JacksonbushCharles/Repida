import { AuthDemo } from "@/components/auth-demo";

export default function AdminLoginPage() {
  return (
    <main className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <p className="eyebrow text-[#F36B21]">Administrator access</p>
      <h1 className="mt-3 text-4xl font-bold tracking-[-0.06em] text-[#171717]">
        Admin sign-in
      </h1>
      <p className="mt-4 text-[#777777]">
        Sign in using the administrator credentials provisioned for this system.
      </p>
      <div className="mt-8">
        <AuthDemo
          googleEnabled={false}
          redirectTo="/admin"
          allowRegistration={false}
        />
      </div>
    </main>
  );
}
