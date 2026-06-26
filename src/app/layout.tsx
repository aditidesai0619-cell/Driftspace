import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import StarfieldCanvas from "@/components/StarfieldCanvas";
import GlossaryModal from "@/components/GlossaryModal";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Driftspace — AI-Powered Space Learning",
  description: "From your first question to the edge of spacetime. Explore the cosmos with immersive AI-powered deep dives.",
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "Driftspace — AI-Powered Space Learning",
    description: "From your first question to the edge of spacetime. Explore the cosmos with immersive AI-powered deep dives.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body style={{ background: "#050510", color: "#ffffff", fontFamily: "Inter, sans-serif" }}>
        <StarfieldCanvas />
        <Nav />
        <main style={{ position: "relative", zIndex: 1 }}>
          {children}
        </main>
        <GlossaryModal />
      </body>
    </html>
  );
}
