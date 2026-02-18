import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Circuit-Pal | Electronics Toolkit",
  description: "Essential tools for makers & engineers",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen flex flex-col`}>
        <main className="flex-grow">
          {children}
        </main>

        <footer className="py-8 border-t border-zinc-200 bg-zinc-50 mt-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-400">
            <div className="mb-4 md:mb-0">
              <span className="font-mono font-bold text-zinc-900">CIRCUIT-PAL</span> © {new Date().getFullYear()}
            </div>
            <div className="flex gap-6 font-mono">
              <a href="/" className="hover:text-zinc-900 transition-colors">HOME</a>
              <a href="/pinout" className="hover:text-zinc-900 transition-colors">PINOUT</a>
              <a href="/inventory" className="hover:text-zinc-900 transition-colors">INVENTORY</a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
