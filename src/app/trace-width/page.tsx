"use client";

import Link from "next/link";
import { ArrowLeft, Ruler, Zap, Layers, Thermometer, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { calculateTraceWidth, TraceCalculation } from "@/lib/trace-width";

export default function TraceWidthPage() {
    const [current, setCurrent] = useState(1.0);
    const [thickness, setThickness] = useState(1.0);
    const [tempRise, setTempRise] = useState(10);
    const [layer, setLayer] = useState<'external' | 'internal'>('external');
    const [result, setResult] = useState<TraceCalculation | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const res = calculateTraceWidth(current, tempRise, thickness, layer === 'internal');
        setResult(res);
    }, [current, thickness, tempRise, layer]);

    return (
        <div className="min-h-screen bg-zinc-50 bg-grid-pattern font-sans text-zinc-900 selection:bg-orange-100">
            <div className="max-w-7xl mx-auto p-4 md:p-12">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-orange-600 mb-8 transition-colors font-mono text-sm group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    ダッシュボード
                </Link>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-orange-600 rounded-xl text-white shadow-lg shadow-orange-200">
                            <Ruler className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-zinc-900">
                                パターン幅計算 <span className="text-zinc-400 font-mono text-xl font-normal">TRACE WIDTH</span>
                            </h1>
                            <p className="text-xs text-zinc-400 font-mono mt-1">IPC-2221 準拠 プリント基板設計ツール</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Inputs Panel */}
                    <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm space-y-6">
                        <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2">パラメータ設定</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-zinc-500 mb-1">電流 (Amps)</label>
                                <div className="relative">
                                    <Zap className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                    <input
                                        type="number"
                                        value={current}
                                        onChange={(e) => setCurrent(Number(e.target.value))}
                                        className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 mb-1">銅箔厚 (oz/ft²)</label>
                                    <div className="relative">
                                        <Layers className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                        <input
                                            type="number"
                                            value={thickness}
                                            onChange={(e) => setThickness(Number(e.target.value))}
                                            step="0.5"
                                            className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 mb-1">温度上昇 (°C)</label>
                                    <div className="relative">
                                        <Thermometer className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                                        <input
                                            type="number"
                                            value={tempRise}
                                            onChange={(e) => setTempRise(Number(e.target.value))}
                                            className="w-full pl-10 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl font-mono focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Optional Layout */}
                        <div className="pt-4 border-t border-zinc-100">
                            <label className="block text-xs font-bold text-zinc-500 mb-2">層のタイプ</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => setLayer('external')}
                                    className={`py-2 rounded-lg text-sm font-bold border transition-all ${layer === 'external'
                                        ? "bg-orange-50 text-orange-600 border-orange-200"
                                        : "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50"
                                        }`}
                                >
                                    外層 (空気中)
                                </button>
                                <button
                                    onClick={() => setLayer('internal')}
                                    className={`py-2 rounded-lg text-sm font-bold border transition-all ${layer === 'internal'
                                        ? "bg-orange-50 text-orange-600 border-orange-200"
                                        : "bg-white text-zinc-500 border-zinc-200 hover:bg-zinc-50"
                                        }`}
                                >
                                    内層
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div className="flex flex-col gap-4">
                        {/* Main Result */}
                        <div className="bg-zinc-900 rounded-3xl p-8 text-white shadow-xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
                            {/* Dynamic Visual Trace */}
                            <div
                                className="absolute bg-orange-500/20 left-0 right-0 top-1/2 -translate-y-1/2 group-hover:bg-orange-500/30 transition-colors"
                                style={{ height: `${Math.min((result?.widthInMils || 0) * 2, 200)}px`, maxHeight: '100%' }}
                            ></div>

                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest">推奨パターン幅</div>
                                    <button
                                        onClick={() => {
                                            if (!result) return;
                                            const text = `パターン幅: ${result.widthInMm.toFixed(2)}mm (${result.widthInMils.toFixed(2)} mil)\n電流: ${current}A, 銅厚: ${thickness}oz, 温度上昇: ${tempRise}°C`;
                                            navigator.clipboard.writeText(text);
                                            setCopied(true);
                                            setTimeout(() => setCopied(false), 2000);
                                        }}
                                        disabled={!result}
                                        className="text-zinc-500 hover:text-white transition-colors disabled:opacity-30"
                                        title="結果をコピー"
                                    >
                                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className="text-6xl font-black font-mono mb-2">
                                    {result ? result.widthInMm.toFixed(2) : "--"}<span className="text-2xl text-zinc-500">mm</span>
                                </div>
                                <div className="text-zinc-400 font-mono text-sm">
                                    {result ? result.widthInMils.toFixed(2) : "--"} mil
                                </div>
                            </div>
                        </div>

                        {/* Sub Results */}
                        <div className="grid grid-cols-2 gap-4 flex-1">
                            <div className="bg-white p-6 rounded-2xl border border-zinc-200 flex flex-col justify-center items-center text-center">
                                <div className="text-zinc-400 text-[10px] font-bold uppercase mb-1">許容電流密度</div>
                                <div className="text-xl font-bold text-zinc-900 font-mono">
                                    {result ? (current / (result.areaSqMils * 0.00064516)).toFixed(1) : "--"} <span className="text-xs text-zinc-400">A/mm²</span>
                                </div>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-zinc-200 flex flex-col justify-center items-center text-center">
                                <div className="text-zinc-400 text-[10px] font-bold uppercase mb-1">断面積</div>
                                <div className="text-xl font-bold text-zinc-900 font-mono">
                                    {result ? result.areaSqMils.toFixed(1) : "--"} <span className="text-xs text-zinc-400">mils²</span>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
