import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "DigiVibe - All-in-One Enterprise Digital Services Platform 🇧🇩",
  description: "Buy VPNs, SIM Offers, Premium Subscriptions (YouTube, Netflix, ChatGPT), IP Proxies, SMM & Verified Emails instantly with bKash, CellFin, Rocket & Crypto!",
  icons: {
    icon: [
      { url: "/logo.png" },
      { url: "/favicon.ico" }
    ],
    shortcut: "/logo.png",
    apple: "/logo.png"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-cyan-500 selection:text-slate-950`}>
        {children}
      </body>
    </html>
  );
}
