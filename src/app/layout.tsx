import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/common/navbar";
import { Footer } from "@/components/common/footer";
import { AuthProvider } from "@/components/common/AuthProvider";
import { ChatProvider } from "@/components/chat/ChatManager";
import { BottomNav } from "@/components/common/BottomNav";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ከሰው እጅ | Ethio Used Product Marketplace",
  description: "The professional standard for quality used products in Ethiopia. Buy and sell with trust on our premium SaaS platform.",
  keywords: ["Used Market Ethiopia", "Ethio Used Products", "Addis Ababa Marketplace", "Used Electronics Ethiopia", "Used Furniture Addis"],
  authors: [{ name: "Ethio Used Market Team" }],
  openGraph: {
    title: "ከሰው እጅ | Ethio Used Product Marketplace",
    description: "Professional SaaS implementation for used item trading in Ethiopia.",
    url: "https://usedmarket.et",
    siteName: "Ethio Used Market",
    locale: "am_ET",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ከሰው እጅ | Used Product Marketplace",
    description: "The premium standard for used product trading in Ethiopia.",
  },
  icons: {
    icon: "/ethiopian-mascot.png",
    apple: "/ethiopian-mascot.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <AuthProvider>
          <ChatProvider>
            <Navbar />
            <main className="min-h-screen">
              {children}
            </main>
            <Footer />
            <BottomNav />
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
