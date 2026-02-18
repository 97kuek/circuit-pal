"use client";

import Link from "next/link";
import { ArrowLeft, Activity, RefreshCw, Zap, Clock, Copy, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { calculateAstable, calculateMonostable, TimerCalculation } from "@/lib/555-timer";
import { formatResistance, formatCapacitance } from "@/lib/calculations";

export default function Timer555Page() {
    const [mode, setMode] = useState<"astable" | "monostable">("astable");

    // Astable Inputs
    const [r1, setR1] = useState("1000");
    const [r2, setR2] = useState("10000");
    const [c, setC] = useState("0.00001");

    // Monostable Inputs
    const [monoR, setMonoR] = useState("10000");
    const [monoC, setMonoC] = useState("0.0001");

    const [result, setResult] = useState<TimerCalculation | null>(null);
    const [copied, setCopied] = useState(false);


    const [cUnit, setCUnit] = useState(0.000001); // µF

    useEffect(() => {
        if (mode === "astable") {
            const r1Val = parseFloat(r1);
            const r2Val = parseFloat(r2);
            const cVal = parseFloat(c) * cUnit; // Convert user input to Farads

            if (!isNaN(r1Val) && !isNaN(r2Val) && !isNaN(cVal) && r1Val > 0 && r2Val > 0 && cVal > 0) {
                setResult(calculateAstable(r1Val, r2Val, cVal));
            } else {
                setResult(null);
            }
        } else {
            const rVal = parseFloat(monoR);
            const cVal = parseFloat(monoC) * cUnit;

            if (!isNaN(rVal) && !isNaN(cVal) && rVal > 0 && cVal > 0) {
                setResult(calculateMonostable(rVal, cVal));
            } else {
                setResult(null);
            }
        }
    }, [mode, r1, r2, c, monoR, monoC, cUnit]);

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 bg-grid-pattern font-sans text-zinc-900 dark:text-zinc-100 selection:bg-orange-100">
            <div className="max-w-6xl mx-auto p-4 md:p-12">
                <Link href="/" className="inline-flex items-center text-zinc-500 dark:text-zinc-400 hover:text-orange-600 mb-8 transition-colors font-mono text-sm group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    ダッシュボード
                </Link>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-zinc-800 rounded-xl text-white shadow-lg shadow-zinc-400">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                                555タイマー <span className="text-zinc-400 font-mono text-xl font-normal">CALCULATOR</span>
                            </h1>
                            <p className="text-xs text-zinc-400 font-mono mt-1">ASTABLE & MONOSTABLE CIRCUITS</p>
                        </div>
                    </div>

                    <div className="bg-zinc-200 dark:bg-zinc-800 p-1 rounded-lg inline-flex">
                        <button
                            onClick={() => setMode("astable")}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === "astable" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700"}`}
                        >
                            非安定 (発振)
                        </button>
                        <button
                            onClick={() => setMode("monostable")}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${mode === "monostable" ? "bg-white shadow-sm text-zinc-900" : "text-zinc-500 hover:text-zinc-700"}`}
                        >
                            単安定 (ワンショット)
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input & Visual Panel */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-3xl border border-zinc-200 dark:border-zinc-700 shadow-sm space-y-8">
                        <div>
                            <h2 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2 mb-6">回路パラメータ</h2>

                            {mode === "astable" ? (
                                <div className="space-y-4">
                                    {/* R1 */}
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 mb-1">R1 (Ω)</label>
                                        <input
                                            type="number"
                                            value={r1}
                                            onChange={(e) => setR1(e.target.value)}
                                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-mono outline-none focus:ring-2 focus:ring-zinc-500 transition-all text-lg"
                                        />
                                    </div>
                                    {/* R2 */}
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 mb-1">R2 (Ω)</label>
                                        <input
                                            type="number"
                                            value={r2}
                                            onChange={(e) => setR2(e.target.value)}
                                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-mono outline-none focus:ring-2 focus:ring-zinc-500 transition-all text-lg"
                                        />
                                    </div>
                                    {/* C */}
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 mb-1">C (µF)</label>
                                        <input
                                            type="number"
                                            value={c}
                                            onChange={(e) => setC(e.target.value)}
                                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-mono outline-none focus:ring-2 focus:ring-zinc-500 transition-all text-lg"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {/* R */}
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 mb-1">R (Ω)</label>
                                        <input
                                            type="number"
                                            value={monoR}
                                            onChange={(e) => setMonoR(e.target.value)}
                                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-mono outline-none focus:ring-2 focus:ring-zinc-500 transition-all text-lg"
                                        />
                                    </div>
                                    {/* C */}
                                    <div>
                                        <label className="block text-xs font-bold text-zinc-500 mb-1">C (µF)</label>
                                        <input
                                            type="number"
                                            value={monoC}
                                            onChange={(e) => setMonoC(e.target.value)}
                                            className="w-full p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-mono outline-none focus:ring-2 focus:ring-zinc-500 transition-all text-lg"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Schematic Diagram */}
                        <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-100 flex items-center justify-center relative overflow-hidden">
                            <div className="absolute top-2 left-3 text-[10px] font-mono text-zinc-300 font-bold">SCHEMATIC</div>
                            {/* Simple visual representation - standard box with labels */}
                            <svg viewBox="0 0 300 200" className="w-full max-w-sm">
                                {/* 555 Chip Body */}
                                <rect x="100" y="50" width="100" height="100" fill="white" stroke="#27272a" strokeWidth="2" rx="4" />
                                <text x="150" y="105" textAnchor="middle" className="text-xl font-black fill-zinc-800" style={{ fontFamily: 'monospace' }}>555</text>

                                {/* Legs */}
                                {/* 8 1 */}
                                <line x1="120" y1="50" x2="120" y2="30" stroke="#27272a" strokeWidth="2" />
                                <line x1="120" y1="150" x2="120" y2="170" stroke="#27272a" strokeWidth="2" />

                                {mode === "astable" ? (
                                    <>
                                        {/* R1 */}
                                        <rect x="115" y="10" width="10" height="20" fill="none" stroke="transparent" />
                                        {/* Just lines for simplicity in this generated SVG */}
                                        <text x="110" y="25" fontSize="10" fill="#52525b">VCC</text>
                                        <text x="110" y="180" fontSize="10" fill="#52525b">GND</text>
                                        <text x="80" y="70" fontSize="10" fill="#52525b" textAnchor="end">DISCH(7)</text>
                                        <text x="80" y="100" fontSize="10" fill="#52525b" textAnchor="end">THRES(6)</text>
                                        <text x="80" y="130" fontSize="10" fill="#52525b" textAnchor="end">TRIG(2)</text>
                                        <text x="220" y="100" fontSize="10" fill="#52525b">OUT(3)</text>
                                    </>
                                ) : (
                                    <>
                                        <text x="110" y="25" fontSize="10" fill="#52525b">VCC</text>
                                        <text x="110" y="180" fontSize="10" fill="#52525b">GND</text>
                                        <text x="80" y="70" fontSize="10" fill="#52525b" textAnchor="end">DISCH(7)</text>
                                        <text x="80" y="130" fontSize="10" fill="#52525b" textAnchor="end">TRIG(2)</text>
                                        <text x="220" y="100" fontSize="10" fill="#52525b">OUT(3)</text>
                                    </>
                                )}
                            </svg>
                        </div>
                    </div>

                    {/* Results Panel */}
                    <div className="space-y-6">
                        <div className="bg-zinc-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden group">
                            {/* Blinking Effect for Astable */}
                            {mode === "astable" && result?.frequency && result.frequency < 20 && (
                                <div className="absolute top-8 right-8 w-4 h-4 rounded-full bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-pulse"
                                    style={{ animationDuration: `${1 / result.frequency}s` }}></div>
                            )}

                            <div className="flex items-center justify-between">
                                <h2 className="text-zinc-500 font-bold text-xs uppercase tracking-widest border-b border-zinc-800 pb-2 mb-6">計算結果</h2>
                                <button
                                    onClick={() => {
                                        if (!result) return;
                                        let text = '';
                                        if (mode === 'astable') {
                                            text = [
                                                `周波数: ${result.frequency?.toFixed(3)} Hz`,
                                                `デューティ比: ${result.dutyCycle?.toFixed(1)}%`,
                                                `周期: ${result.period ? (result.period * 1000).toFixed(2) : '--'} ms`,
                                                `High時間: ${result.highTime ? (result.highTime * 1000).toFixed(2) : '--'} ms`,
                                                `Low時間: ${result.lowTime ? (result.lowTime * 1000).toFixed(2) : '--'} ms`,
                                            ].join('\n');
                                        } else {
                                            text = `パルス幅: ${result.highTime ? (result.highTime >= 1 ? result.highTime.toFixed(3) + ' s' : (result.highTime * 1000).toFixed(2) + ' ms') : '--'}`;
                                        }
                                        navigator.clipboard.writeText(text);
                                        setCopied(true);
                                        setTimeout(() => setCopied(false), 2000);
                                    }}
                                    disabled={!result}
                                    className="text-zinc-500 hover:text-white transition-colors disabled:opacity-30 mb-4"
                                    title="結果をコピー"
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>

                            {mode === "astable" ? (
                                <div className="space-y-8">
                                    <div>
                                        <div className="text-sm text-zinc-400 font-bold mb-1">周波数 (Frequency)</div>
                                        <div className="text-5xl lg:text-6xl font-black font-mono tracking-tighter text-white">
                                            {result ? (
                                                result.frequency && result.frequency > 1000
                                                    ? `${(result.frequency / 1000).toFixed(3)}`
                                                    : result.frequency?.toFixed(3)
                                            ) : "--"}
                                            <span className="text-2xl ml-2 text-zinc-600">
                                                {result && result.frequency && result.frequency > 1000 ? "kHz" : "Hz"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <div className="text-xs text-zinc-500 font-bold uppercase mb-1">Duty Cycle</div>
                                            <div className="text-2xl font-mono font-bold text-orange-400">
                                                {result?.dutyCycle?.toFixed(1) || "--"} %
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-zinc-500 font-bold uppercase mb-1">Period (T)</div>
                                            <div className="text-2xl font-mono font-bold">
                                                {result?.period ? (result.period * 1000).toFixed(2) : "--"} <span className="text-sm text-zinc-600">ms</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-8 pt-4 border-t border-zinc-800">
                                        <div>
                                            <div className="text-xs text-zinc-500 font-bold uppercase mb-1">High Time</div>
                                            <div className="text-lg font-mono text-zinc-300">
                                                {result?.highTime ? (result.highTime * 1000).toFixed(2) : "--"} ms
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-zinc-500 font-bold uppercase mb-1">Low Time</div>
                                            <div className="text-lg font-mono text-zinc-300">
                                                {result?.lowTime ? (result.lowTime * 1000).toFixed(2) : "--"} ms
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    <div>
                                        <div className="text-sm text-zinc-400 font-bold mb-1">パルス幅 (Pulse Width)</div>
                                        <div className="text-5xl lg:text-6xl font-black font-mono tracking-tighter text-white">
                                            {result?.highTime ? (
                                                result.highTime >= 1 ? result.highTime.toFixed(3) : (result.highTime * 1000).toFixed(2)
                                            ) : "--"}
                                            <span className="text-2xl ml-2 text-zinc-600">
                                                {result?.highTime && result.highTime >= 1 ? "s" : "ms"}
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-sm text-zinc-500">
                                        トリガー入力後、出力がHighになる時間です。
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
