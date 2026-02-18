"use client";

import { useState } from "react";
import { ArrowLeft, Activity, Info, Save } from "lucide-react";
import Link from "next/link";
import { calculateRC, formatTime, formatFrequency } from "@/lib/rc-calculator";
import { useHistory } from "@/lib/history";
import HistoryPanel from "@/components/HistoryPanel";

export default function RCCalculatorPage() {
    const [rValue, setRValue] = useState("10");
    const [rUnit, setRUnit] = useState(1000); // kΩ default
    const [cValue, setCValue] = useState("100");
    const [cUnit, setCUnit] = useState(1e-9); // nF default

    const { history, addHistory, clearHistory } = useHistory('rc-calculator');

    const r = parseFloat(rValue) * rUnit;
    const c = parseFloat(cValue) * cUnit;

    const { timeConstant, cutoffFrequency } = calculateRC(r, c);

    const getUnitLabel = (val: number, type: 'r' | 'c') => {
        if (type === 'r') {
            if (val === 1) return 'Ω';
            if (val === 1000) return 'kΩ';
            if (val === 1000000) return 'MΩ';
        } else {
            if (val === 1e-12) return 'pF';
            if (val === 1e-9) return 'nF';
            if (val === 1e-6) return 'µF';
            if (val === 1e-3) return 'mF';
        }
        return '';
    };

    const handleSave = () => {
        const summary = `R: ${rValue}${getUnitLabel(rUnit, 'r')} / C: ${cValue}${getUnitLabel(cUnit, 'c')} → fc: ${formatFrequency(cutoffFrequency)}`;
        addHistory(summary, { rValue, rUnit, cValue, cUnit });
    };

    const handleRestore = (item: any) => {
        setRValue(item.data.rValue);
        setRUnit(item.data.rUnit);
        setCValue(item.data.cValue);
        setCUnit(item.data.cUnit);
    };

    const handleClear = () => {
        setRValue("10");
        setRUnit(1000);
        setCValue("100");
        setCUnit(1e-9);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            handleClear();
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 bg-grid-pattern font-sans text-zinc-900 dark:text-zinc-100 selection:bg-rose-100">
            <div className="max-w-4xl mx-auto p-4 md:p-12">
                <Link href="/" className="inline-flex items-center text-zinc-500 dark:text-zinc-400 hover:text-rose-600 mb-8 transition-colors font-mono text-sm group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    ダッシュボード
                </Link>

                <div className="flex items-center gap-4 mb-8 justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-200 dark:shadow-rose-900/30">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                                RC時定数 / フィルタ <span className="text-zinc-400 font-mono text-xl font-normal">RC FILTER</span>
                            </h1>
                            <p className="text-xs text-zinc-400 font-mono mt-1">ローパス/ハイパスフィルタのカットオフ周波数と時定数</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Inputs */}
                    <div className="space-y-6">
                        <section className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                            <h2 className="text-xs font-bold text-zinc-400 uppercase mb-4 tracking-wider">パラメータ設定</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">抵抗 (R)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={rValue}
                                            onChange={(e) => setRValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="flex-1 p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold font-mono text-lg outline-none focus:border-rose-500 transition-colors dark:text-white"
                                            placeholder="10"
                                        />
                                        <select
                                            value={rUnit}
                                            onChange={(e) => setRUnit(Number(e.target.value))}
                                            className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 font-bold text-sm outline-none focus:border-rose-500 dark:text-zinc-300"
                                        >
                                            <option value={1}>Ω</option>
                                            <option value={1000}>kΩ</option>
                                            <option value={1000000}>MΩ</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-zinc-500 dark:text-zinc-400 mb-1">コンデンサ (C)</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="number"
                                            value={cValue}
                                            onChange={(e) => setCValue(e.target.value)}
                                            onKeyDown={handleKeyDown}
                                            className="flex-1 p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold font-mono text-lg outline-none focus:border-rose-500 transition-colors dark:text-white"
                                            placeholder="100"
                                        />
                                        <select
                                            value={cUnit}
                                            onChange={(e) => setCUnit(Number(e.target.value))}
                                            className="bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-3 font-bold text-sm outline-none focus:border-rose-500 dark:text-zinc-300"
                                        >
                                            <option value={1e-12}>pF</option>
                                            <option value={1e-9}>nF</option>
                                            <option value={1e-6}>µF</option>
                                            <option value={1e-3}>mF</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-rose-50 dark:bg-rose-900/10 p-6 rounded-2xl border border-rose-100 dark:border-rose-900/30">
                            <div className="flex gap-3 items-start">
                                <Info className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                <div className="text-sm text-rose-800 dark:text-rose-200 leading-relaxed">
                                    <p className="font-bold mb-1">計算式</p>
                                    <ul className="list-disc list-inside space-y-1 opacity-80 text-xs font-mono">
                                        <li>τ = R × C</li>
                                        <li>fc = 1 / (2π × R × C)</li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Results */}
                    <div className="space-y-6">
                        <section className="bg-zinc-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-center items-center text-center h-full min-h-[300px]">
                            <div className="mb-8 w-full">
                                <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">カットオフ周波数 (fc)</div>
                                <div className="text-5xl font-black font-mono tracking-tight text-white break-all">
                                    {formatFrequency(cutoffFrequency)}
                                </div>
                                <div className="text-xs text-zinc-500 mt-2 font-mono">
                                    -3dB Point
                                </div>
                            </div>

                            <div className="w-full pt-8 border-t border-zinc-800">
                                <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">時定数 (τ)</div>
                                <div className="text-3xl font-bold font-mono text-rose-400">
                                    {formatTime(timeConstant)}
                                </div>
                                <div className="text-xs text-zinc-500 mt-2 font-mono">
                                    63.2% Charge Time
                                </div>
                            </div>
                        </section>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={handleClear}
                                className="px-6 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl font-bold transition-colors"
                            >
                                クリア
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-xl font-bold text-zinc-700 dark:text-zinc-300 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shadow-sm"
                            >
                                <Save className="w-5 h-5" />
                                結果を保存
                            </button>
                        </div>

                        <HistoryPanel history={history} onClear={clearHistory} onRestore={handleRestore} />
                    </div>

                </div>
            </div>
        </div>
    );
}
