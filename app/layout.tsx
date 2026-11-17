import type { Metadata } from "next";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";

export const metadata: Metadata = {
  title: {
    default: "Repida",
    template: "%s | Repida",
  },
  description: "Repida is a premium logistics and delivery platform for global shipping, tracking and business freight solutions.",
  openGraph: {
    title: "Repida",
    description: "Premium international logistics and delivery platform.",
    siteName: "Repida",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Repida",
    description: "Premium international logistics and delivery platform.",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="min-h-full bg-background text-foreground">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
