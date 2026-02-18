"use client";

import Link from "next/link";
import { Zap, Settings, Lightbulb, Box, Ruler, Layers, CircuitBoard, Clock, ArrowLeftRight, Activity, Star } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { useState, useEffect } from "react";

export default function Home() {
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const tools = [
    {
      name: "抵抗ツールキット (Resistors)",
      description: "カラーコード / SMD / LED計算",
      href: "/resistors",
      icon: Zap,
      color: "bg-purple-500",
    },
    {
      name: "単位変換 (Unit Converter)",
      description: "抵抗・容量・周波数などの単位変換",
      href: "/unit-converter",
      icon: ArrowLeftRight,
      color: "bg-cyan-500",
    },
    {
      name: "RCフィルタ (RC Filter)",
      description: "時定数とカットオフ周波数",
      href: "/rc-calculator",
      icon: Activity,
      color: "bg-rose-500",
    },
    {
      name: "分圧回路 (Voltage Divider)",
      description: "抵抗分圧の計算と設計",
      href: "/voltage-divider",
      icon: CircuitBoard,
      color: "bg-indigo-500",
    },
    {
      name: "オームの法則 (Ohm's Law)",
      description: "電圧・電流・抵抗・電力の計算",
      href: "/ohms-law",
      icon: Lightbulb,
      color: "bg-amber-500",
    },
    {
      name: "コンデンサ容量 (Capacitor)",
      description: "コード読み取り / 容量変換",
      href: "/capacitor",
      icon: Box,
      color: "bg-indigo-600",
    },
    {
      name: "555タイマー (555 Timer)",
      description: "発振周波数 / パルス幅計算",
      href: "/555-timer",
      icon: Clock,
      color: "bg-zinc-700",
    },
    {
      name: "パターン幅計算 (Trace Width)",
      description: "IPC-2221準拠の基板設計",
      href: "/trace-width",
      icon: Ruler,
      color: "bg-orange-600",
    },
    {
      name: "在庫管理 (Inventory)",
      description: "パーツの在庫をローカル管理",
      href: "/inventory",
      icon: Box,
      color: "bg-zinc-600",
    },
  ];

  const sortedTools = [...tools].sort((a, b) => {
    const aFav = isFavorite(a.href);
    const bFav = isFavorite(b.href);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  const displayTools = mounted ? sortedTools : tools;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 bg-grid-pattern font-sans text-zinc-900 dark:text-zinc-100 selection:bg-blue-100">
      <main className="max-w-6xl mx-auto p-6 md:p-12 space-y-16">

        {/* Header Section */}
        <div className="text-center space-y-6 pt-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            システム稼働中 // V2.0.0
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[0.9]">
            CIRCUIT<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">PAL.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 max-w-xl mx-auto font-medium leading-relaxed">
            メイカーのための究極のツールキット<br />
            <span className="text-zinc-400 text-sm font-mono mt-2 block">精密な電子工作ツール</span>
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayTools.map((tool) => (
            <div
              key={tool.href}
              className="group relative flex flex-col bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              {/* Background Icon */}
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                <tool.icon className="w-24 h-24 text-zinc-900 dark:text-zinc-100" />
              </div>

              {/* Favorite Button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite(tool.href);
                }}
                className="absolute top-4 right-4 p-2 text-zinc-300 hover:text-yellow-400 transition-colors z-20 focus:outline-none"
                aria-label="Toggle favorite"
              >
                <Star
                  className={`w-5 h-5 transition-all ${mounted && isFavorite(tool.href) ? "fill-yellow-400 text-yellow-400 scale-110" : ""
                    }`}
                />
              </button>

              <Link href={tool.href} className="flex-1 p-6 flex flex-col z-10">
                <div
                  className={`w-12 h-12 rounded-xl ${tool.color} text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}
                >
                  <tool.icon className="w-6 h-6" />
                </div>

                <div className="relative z-10 block">
                  <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {tool.name}
                  </h2>
                  <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                    {tool.description}
                  </p>
                </div>

                <div className="mt-auto pt-6 flex items-center text-xs font-mono font-bold text-zinc-400 group-hover:text-blue-600 transition-colors">
                  ツールを開く <span className="ml-2">→</span>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
