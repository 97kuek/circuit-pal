"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Zap, CircuitBoard, Lightbulb, Box, Ruler, Clock, Archive, ChevronDown, ArrowLeftRight, Activity } from "lucide-react";
import DarkModeToggle from "./DarkModeToggle";
import { useState, useRef, useEffect } from "react";

const tools = [
    { name: "抵抗ツールキット", href: "/resistors", icon: Zap },
    { name: "分圧回路", href: "/voltage-divider", icon: CircuitBoard },
    { name: "オームの法則", href: "/ohms-law", icon: Lightbulb },
    { name: "単位変換", href: "/unit-converter", icon: ArrowLeftRight },
    { name: "RCフィルタ", href: "/rc-calculator", icon: Activity },
    { name: "コンデンサ", href: "/capacitor", icon: Box },
    { name: "555タイマー", href: "/555-timer", icon: Clock },
    { name: "パターン幅", href: "/trace-width", icon: Ruler },
    { name: "在庫管理", href: "/inventory", icon: Archive },
];

export default function NavHeader() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (pathname === "/") return null;

    const currentTool = tools.find(t => pathname.startsWith(t.href));

    return (
        <header className="sticky top-0 z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200 dark:border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 flex items-center justify-between">
                {/* Left: Logo + Navigation */}
                <div className="flex items-center gap-4">
                    <Link href="/" className="font-black text-lg tracking-tighter text-zinc-900 dark:text-white hover:opacity-70 transition-opacity">
                        C<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">P</span>
                    </Link>

                    <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-700"></div>

                    {/* Tool Selector Dropdown */}
                    <div ref={menuRef} className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                        >
                            {currentTool && <currentTool.icon className="w-4 h-4" />}
                            <span className="hidden sm:inline">{currentTool?.name || "ツール選択"}</span>
                            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isOpen && (
                            <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-zinc-900 rounded-xl shadow-2xl border border-zinc-200 dark:border-zinc-700 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                                {tools.map(tool => (
                                    <Link
                                        key={tool.href}
                                        href={tool.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${pathname.startsWith(tool.href)
                                            ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-bold"
                                            : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium"
                                            }`}
                                    >
                                        <tool.icon className="w-4 h-4" />
                                        {tool.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Dark Mode Toggle */}
                <DarkModeToggle />
            </div>
        </header>
    );
}
