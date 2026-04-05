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
  title: "ከሰው እጅ | KesewEj Market",
  description: "The professional standard for quality used products in Ethiopia. Buy and sell with trust on KesewEj, the premium SaaS platform.",
  keywords: ["KesewEj Ethiopia", "Ethio Used Products", "Addis Ababa Marketplace", "Used Electronics Ethiopia", "Used Furniture Addis"],
  authors: [{ name: "KesewEj Team" }],
  openGraph: {
    title: "ከሰው እጅ | KesewEj Product Marketplace",
    description: "Professional SaaS implementation for used item trading in Ethiopia via KesewEj.",
    url: "https://kesewej.et",
    siteName: "KesewEj Market",
    locale: "am_ET",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ከሰው እጅ | KesewEj Marketplace",
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
