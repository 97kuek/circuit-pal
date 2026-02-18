"use client";

import Link from "next/link";
import { ArrowLeft, Box } from "lucide-react";
import { useState } from "react";
import { decodeCapacitorCode, CapacitorResult } from "@/lib/capacitor";

export default function CapacitorPage() {
    const [code, setCode] = useState("104");
    const [result, setResult] = useState<CapacitorResult | null>(decodeCapacitorCode("104"));

    const handleInput = (val: string) => {
        // Only allow numbers, max 3 chars
        const cleaned = val.replace(/[^0-9]/g, "").slice(0, 3);
        setCode(cleaned);

        if (cleaned.length === 3) {
            setResult(decodeCapacitorCode(cleaned));
        } else {
            setResult(null);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 bg-grid-pattern font-sans text-zinc-900 selection:bg-blue-100">
            <div className="max-w-3xl mx-auto p-6 md:p-12">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-indigo-600 mb-8 transition-colors font-mono text-sm group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    ダッシュボード
                </Link>

                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-200">
                        <Box className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900">
                        コンデンサ容量 <span className="text-zinc-400 font-mono text-xl font-normal">CAPACITOR</span>
                    </h1>
                </div>
                <p className="text-zinc-500 mb-12 ml-16 max-w-lg">
                    セラミックコンデンサの3桁コード（例: 104）を、実際の静電容量（pF, nF, µF）に変換します。
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

                    {/* Input Section */}
                    <div className="bg-white p-8 rounded-2xl border border-zinc-200 shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-5">
                            <Box className="w-32 h-32" />
                        </div>

                        <label className="block text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider mb-3">
                            コードを入力 (例: 104)
                        </label>

                        <div className="relative">
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => handleInput(e.target.value)}
                                className="w-full bg-zinc-50 border-2 border-zinc-200 focus:border-indigo-500 rounded-xl px-6 py-6 text-5xl font-black text-center tracking-widest outline-none transition-all font-mono text-zinc-800"
                                placeholder="104"
                                maxLength={3}
                            />
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-zinc-400 font-medium">
                                本体に記載されている3桁の数値を入力
                            </p>
                        </div>
                    </div>

                    {/* Visual & Result Section */}
                    <div className="space-y-8">
                        {/* Visual */}
                        <div className="flex justify-center py-8 relative">
                            {/* Ceramic Capacitor Graphic */}
                            <div className="relative w-32 h-32">
                                <div className="absolute inset-x-10 bottom-0 top-16 bg-zinc-400 w-1 ml-[46px] -z-10 h-24"></div>
                                <div className="absolute inset-x-10 bottom-0 top-16 bg-zinc-400 w-1 ml-[74px] -z-10 h-24"></div>

                                <div className="w-32 h-32 bg-[#e8a668] rounded-full border-4 border-[#d68b4d] shadow-xl flex items-center justify-center relative z-10">
                                    <span className="font-mono font-bold text-2xl text-[#8b5a2b] tracking-widest opacity-80">
                                        {code || "---"}
                                    </span>
                                    <div className="absolute top-2 w-full text-center text-[8px] font-bold text-[#8b5a2b] opacity-50 underline decoration-1">
                                        __
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Result Display */}
                        <div className={`text-center transition-all duration-500 ${result ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
                            <p className="text-xs font-bold text-zinc-400 font-mono uppercase tracking-wider mb-2">計算結果</p>
                            <div className="bg-zinc-900 text-white p-6 rounded-2xl shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                                <h2 className="text-3xl md:text-4xl font-mono font-bold text-white">
                                    {result?.fullString || "---"}
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cheat Sheet */}
                <div className="mt-16 pt-8 border-t border-zinc-200">
                    <h3 className="text-sm font-bold text-zinc-900 mb-6 font-mono uppercase flex items-center">
                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                        早見表
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { c: "102", v: "1nF" },
                            { c: "103", v: "10nF" },
                            { c: "104", v: "0.1µF" },
                            { c: "473", v: "47nF" },
                        ].map((item) => (
                            <button
                                key={item.c}
                                onClick={() => handleInput(item.c)}
                                className="p-3 rounded-lg border border-zinc-100 bg-white hover:border-indigo-200 hover:bg-indigo-50 transition-colors text-center"
                            >
                                <div className="font-mono font-bold text-zinc-900">{item.c}</div>
                                <div className="text-xs text-zinc-500">{item.v}</div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
