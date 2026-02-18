"use client";

import { ThemeProvider } from "@/lib/theme";
import DarkModeToggle from "@/components/DarkModeToggle";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <div className="min-h-screen flex flex-col">
                <main className="flex-grow">
                    {children}
                </main>

                <footer className="py-8 border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 mt-auto">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-400">
                        <div className="mb-4 md:mb-0 flex items-center gap-3">
                            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">CIRCUIT-PAL</span> © {new Date().getFullYear()}
                            <DarkModeToggle />
                        </div>
                        <div className="flex gap-6 font-mono">
                            <a href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">ホーム</a>
                            <a href="/pinout" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">ピン配置</a>
                            <a href="/inventory" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">在庫管理</a>
                        </div>
                    </div>
                </footer>
            </div>
        </ThemeProvider>
    );
}
