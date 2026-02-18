"use client";

import Link from "next/link";
import { ArrowLeft, Activity, RefreshCw, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { calculateVoltageDivider, calculateRequiredR2, findNearestE24 } from "@/lib/voltage-divider";
import { formatResistance } from "@/lib/calculations";

export default function VoltageDividerPage() {
    const [mode, setMode] = useState<"vout" | "r2">("vout");

    const [vin, setVin] = useState("5");
    const [r1, setR1] = useState("10000"); // 10k
    const [r2, setR2] = useState("10000"); // 10k
    const [vout, setVout] = useState("2.5"); // Target for R2 mode

    const [result, setResult] = useState<number | null>(null);
    const [nearestR, setNearestR] = useState<number | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const v_in = parseFloat(vin);
        const r_1 = parseFloat(r1);

        if (mode === "vout") {
            const r_2 = parseFloat(r2);
            if (!isNaN(v_in) && !isNaN(r_1) && !isNaN(r_2)) {
                setResult(calculateVoltageDivider(v_in, r_1, r_2));
                setNearestR(null);
            }
        } else {
            const v_out = parseFloat(vout);
            if (!isNaN(v_in) && !isNaN(r_1) && !isNaN(v_out)) {
                const calculatedR2 = calculateRequiredR2(v_in, v_out, r_1);
                setResult(calculatedR2);
                setNearestR(findNearestE24(calculatedR2));
            }
        }
    }, [vin, r1, r2, vout, mode]);

    return (
        <div className="min-h-screen bg-zinc-50 bg-grid-pattern font-sans text-zinc-900 selection:bg-blue-100">
            <div className="max-w-4xl mx-auto p-6 md:p-12">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-teal-600 mb-8 transition-colors font-mono text-sm group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    ダッシュボード
                </Link>

                <div className="flex items-center gap-4 mb-2">
                    <div className="p-3 bg-teal-600 rounded-xl text-white shadow-lg shadow-teal-200">
                        <Activity className="w-6 h-6" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight text-zinc-900">
                        分圧回路 <span className="text-zinc-400 font-mono text-xl font-normal">VOLTAGE DIVIDER</span>
                    </h1>
                </div>
                <p className="text-zinc-500 mb-8 ml-16 max-w-lg">
                    分圧回路の計算ツール。出力電圧の確認や、欲しい電圧を作るための抵抗値選定に。
                </p>

                {/* Mode Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="bg-zinc-200 p-1 rounded-lg inline-flex">
                        <button
                            onClick={() => setMode("vout")}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === "vout" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700"}`}
                        >
                            Vout を計算
                        </button>
                        <button
                            onClick={() => setMode("r2")}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === "r2" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700"}`}
                        >
                            R2 (抵抗値) を選定
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Visual Circuit Diagram with Inputs */}
                    <div className="bg-white p-4 rounded-3xl border border-zinc-200 shadow-sm relative flex justify-center items-center select-none overflow-hidden min-h-[400px]">
                        <div className="absolute top-4 left-4 text-xs font-mono text-zinc-300 font-bold">SCHEMATIC.001</div>

                        {/* 
                    Responsive Container 
                    We use a fixed aspect ratio container relative to the SVG viewBox 
                */}
                        <div className="relative w-full max-w-sm aspect-[3/4]">

                            {/* Circuit SVG Layer */}
                            <svg viewBox="0 0 300 400" className="w-full h-full drop-shadow-sm">
                                {/* Styles */}
                                <defs>
                                    <marker id="arrow" markerWidth="10" markerHeight="10" refX="5" refY="2.5" orient="auto">
                                        <path d="M0,0 L5,2.5 L0,5" fill="#52525b" />
                                    </marker>
                                </defs>

                                {/* Main Vertical Line */}
                                <line x1="150" y1="50" x2="150" y2="350" stroke="#27272a" strokeWidth="2" />

                                {/* Vin Horizontal Line (Top) */}
                                <line x1="50" y1="50" x2="150" y2="50" stroke="#27272a" strokeWidth="2" />

                                {/* Vout Horizontal Line (Middle) */}
                                <line x1="150" y1="200" x2="250" y2="200" stroke="#27272a" strokeWidth="2" />

                                {/* R1 Box (White fill to cover line) */}
                                <rect x="130" y="100" width="40" height="60" fill="white" stroke="#27272a" strokeWidth="2" rx="4" />
                                {/* R1 Zigzag symbol */}
                                <path d="M150 110 L140 115 L160 125 L140 135 L160 145 L150 150" fill="none" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

                                {/* R2 Box */}
                                <rect x="130" y="250" width="40" height="60" fill="white" stroke="#27272a" strokeWidth="2" rx="4" />
                                {/* R2 Zigzag symbol */}
                                <path d="M150 260 L140 265 L160 275 L140 285 L160 295 L150 300" fill="none" stroke="#52525b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />

                                {/* GND Symbol */}
                                <line x1="130" y1="350" x2="170" y2="350" stroke="#27272a" strokeWidth="2" />
                                <line x1="135" y1="355" x2="165" y2="355" stroke="#27272a" strokeWidth="2" />
                                <line x1="142" y1="360" x2="158" y2="360" stroke="#27272a" strokeWidth="2" />

                                {/* Node Dots */}
                                <circle cx="150" cy="50" r="3" fill="#27272a" />
                                <circle cx="150" cy="200" r="4" fill="white" stroke="#27272a" strokeWidth="2" />
                            </svg>

                            {/* Inputs Overlay Layer (Positioned roughly matching SVG coordinates) */}

                            {/* VIN Input (Top Left) */}
                            <div className="absolute top-[12%] left-[10%] -translate-y-1/2 -translate-x-1/2">
                                <label className="text-[10px] font-bold text-zinc-400 block mb-1 text-center bg-white/90 px-1 rounded">VIN (V)</label>
                                <input
                                    type="number"
                                    value={vin}
                                    onChange={(e) => setVin(e.target.value)}
                                    className="w-16 md:w-20 p-2 bg-zinc-50 border border-zinc-300 rounded-lg font-mono text-sm text-center focus:border-teal-500 outline-none shadow-sm"
                                />
                            </div>

                            {/* R1 Input (Right of R1) */}
                            <div className="absolute top-[32%] left-[75%] -translate-y-1/2">
                                <label className="text-[10px] font-bold text-zinc-400 block mb-1">R1 (Ω)</label>
                                <input
                                    type="number"
                                    value={r1}
                                    onChange={(e) => setR1(e.target.value)}
                                    className="w-20 md:w-24 p-2 bg-zinc-50 border border-zinc-300 rounded-lg font-mono text-sm focus:border-teal-500 outline-none shadow-sm"
                                />
                            </div>

                            {/* VOUT Input/Display (Right Middle) */}
                            <div className="absolute top-[50%] left-[85%] -translate-y-1/2 -translate-x-1/2 z-20">
                                <div className="bg-white/80 backdrop-blur-sm p-1 rounded-xl">
                                    <label className="text-[10px] font-bold text-teal-600 block mb-1 text-center">VOUT</label>
                                    {mode === "vout" ? (
                                        <div className="w-20 md:w-24 py-2 bg-teal-50 border-2 border-teal-500 rounded-lg font-mono text-lg font-bold text-teal-700 text-center shadow-md">
                                            {result ? result.toFixed(2) : "--"}
                                        </div>
                                    ) : (
                                        <input
                                            type="number"
                                            value={vout}
                                            onChange={(e) => setVout(e.target.value)}
                                            className="w-20 md:w-24 p-2 bg-white border-2 border-teal-500 rounded-lg font-mono text-sm focus:ring-2 focus:ring-teal-200 outline-none text-center font-bold shadow-md"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* R2 Input (Right of R2) */}
                            <div className="absolute top-[70%] left-[75%] -translate-y-1/2">
                                <label className="text-[10px] font-bold text-zinc-400 block mb-1">R2 (Ω)</label>
                                {mode === "vout" ? (
                                    <input
                                        type="number"
                                        value={r2}
                                        onChange={(e) => setR2(e.target.value)}
                                        className="w-20 md:w-24 p-2 bg-zinc-50 border border-zinc-300 rounded-lg font-mono text-sm focus:border-teal-500 outline-none shadow-sm"
                                    />
                                ) : (
                                    <div className="w-20 md:w-24 p-2 bg-teal-50 border border-teal-200 rounded-lg font-mono text-sm font-bold text-teal-700 text-center shadow-sm">
                                        {result ? formatResistance(result) : "--"}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Results & Info Panel */}
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-2xl shadow-xl shadow-zinc-200 border border-zinc-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-zinc-900 dark:text-zinc-100 font-bold flex items-center">
                                    <Activity className="w-5 h-5 mr-2 text-teal-500" />
                                    計算結果
                                </h3>
                                <button
                                    onClick={() => {
                                        if (!result) return;
                                        const text = mode === 'vout'
                                            ? `Vout: ${result.toFixed(2)}V (Vin: ${vin}V, R1: ${r1}Ω, R2: ${r2}Ω)`
                                            : `R2: ${formatResistance(result)}${nearestR ? ` (E24近似: ${formatResistance(nearestR)})` : ''}`;
                                        navigator.clipboard.writeText(text);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    disabled={!result}
                                    className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors disabled:opacity-30"
                                    title="結果をコピー"
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>

                            {mode === "vout" ? (
                                <div>
                                    <p className="text-sm text-zinc-500 mb-2">出力電圧 (Vout)</p>
                                    <p className="text-5xl font-black text-teal-600 font-mono tracking-tighter">
                                        {result ? `${result.toFixed(2)}V` : "---"}
                                    </p>
                                    <p className="mt-4 text-xs text-zinc-400">
                                        Vin: {vin}V, R1: {r1}Ω, R2: {r2}Ω
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <p className="text-sm text-zinc-500 mb-2">必要な抵抗値 (R2)</p>
                                    <p className="text-5xl font-black text-teal-600 font-mono tracking-tighter">
                                        {result ? formatResistance(result) : "---"}
                                    </p>

                                    {nearestR && (
                                        <div className="mt-6 pt-6 border-t border-zinc-100">
                                            <p className="text-xs font-bold text-zinc-400 uppercase mb-2">E24系列 近似値</p>
                                            <div className="text-2xl font-bold text-zinc-800 font-mono">
                                                {formatResistance(nearestR)}
                                            </div>
                                            <p className="text-xs text-zinc-400 mt-1">
                                                誤差: {result ? Math.abs((nearestR - result) / result * 100).toFixed(1) : 0}%
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
