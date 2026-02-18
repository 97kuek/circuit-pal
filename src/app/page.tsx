"use client";

import Link from "next/link";
import { Calculator, Zap, Lightbulb, Cpu, Battery, Box, Activity, Archive } from "lucide-react";

export default function Home() {
  const tools = [
    {
      name: "抵抗値計算 (Resistor)",
      description: "カラーコード読取 & 逆引き検索",
      href: "/resistor",
      icon: Calculator,
      color: "bg-blue-600",
    },
    {
      name: "オームの法則 (Ohm's Law)",
      description: "電圧・電流・抵抗・電力の計算",
      href: "/ohms-law",
      icon: Zap,
      color: "bg-amber-500",
    },
    {
      name: "LED抵抗計算 (LED)",
      description: "LEDに必要な抵抗値を算出",
      href: "/led",
      icon: Lightbulb,
      color: "bg-rose-500",
    },
    {
      name: "ピン配置図 (Pin-Pal)",
      description: "Arduino / ESP32 ピンアサイン",
      href: "/pinout",
      icon: Cpu,
      color: "bg-purple-600",
    },
    {
      name: "バッテリー寿命計算",
      description: "プロジェクトの稼働時間を予測",
      href: "/battery",
      icon: Battery,
      color: "bg-emerald-500",
    },
    {
      name: "コンデンサ容量 (Capacitor)",
      description: "コード(104)を容量に変換",
      href: "/capacitor",
      icon: Box, // Needs import
      color: "bg-indigo-600",
    },
    {
      name: "分圧回路 (Voltage Divider)",
      description: "Vout / 抵抗値を計算",
      href: "/voltage-divider",
      icon: Activity, // Needs import
      color: "bg-teal-600",
    },
    {
      name: "在庫管理 (Inventory)",
      description: "部品の在庫をローカルで管理",
      href: "/inventory",
      icon: Archive, // Needs import
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-50 bg-grid-pattern font-sans text-zinc-900 selection:bg-blue-100">
      <main className="max-w-6xl mx-auto p-6 md:p-12 space-y-16">

        {/* Header Section */}
        <div className="text-center space-y-6 pt-12">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-xs font-mono text-zinc-500 mb-4">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            SYSTEM ONLINE // V2.0.0
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-zinc-900 leading-[0.9]">
            CIRCUIT<br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">PAL.</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 max-w-xl mx-auto font-medium leading-relaxed">
            The Ultimate Toolkit for Makers.<br />
            <span className="text-zinc-400 text-sm font-mono mt-2 block">PRECISION TOOLS FOR ELECTRONICS</span>
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.name}
              href={tool.href}
              className="group relative flex flex-col p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <tool.icon className="w-24 h-24 text-zinc-900" />
              </div>

              <div
                className={`w-12 h-12 rounded-xl ${tool.color} text-white flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform duration-300`}
              >
                <tool.icon className="w-6 h-6" />
              </div>

              <div className="relative z-10">
                <h2 className="text-lg font-bold text-zinc-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {tool.name}
                </h2>
                <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                  {tool.description}
                </p>
              </div>

              <div className="mt-6 flex items-center text-xs font-mono font-bold text-zinc-400 group-hover:text-blue-600 transition-colors">
                ACCESS TOOL <span className="ml-2">-&gt;</span>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <footer className="py-12 text-center text-zinc-400 font-mono text-xs border-t border-zinc-100 mt-20 bg-white/50 backdrop-blur-sm">
        <p>ENGINEERED FOR MAKERS • 2026 CIRCUIT-PAL</p>
      </footer>
    </div>
  );
}
