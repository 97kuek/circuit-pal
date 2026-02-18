"use client";

import Link from "next/link";
import { ArrowLeft, Battery } from "lucide-react";
import { useState } from "react";

export default function BatteryPage() {
    const [capacity, setCapacity] = useState("2000"); // mAh
    const [current, setCurrent] = useState("100"); // mA

    const capacityNum = parseFloat(capacity);
    const currentNum = parseFloat(current);

    let theoreticalHours = 0;
    let safeHours = 0;

    if (!isNaN(capacityNum) && !isNaN(currentNum) && currentNum > 0) {
        theoreticalHours = capacityNum / currentNum;
        safeHours = theoreticalHours * 0.8;
    }

    const formatTime = (hours: number) => {
        if (hours < 1) return `${(hours * 60).toFixed(0)}分`;
        if (hours < 24) return `${hours.toFixed(1)}時間`;
        const days = hours / 24;
        return `${days.toFixed(1)}日`;
    };

    return (
        <div className="min-h-screen bg-zinc-50 p-6 md:p-12 font-sans text-zinc-900">
            <div className="max-w-3xl mx-auto">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    ダッシュボードに戻る
                </Link>
                <h1 className="text-3xl font-bold mb-8 flex items-center">
                    <Battery className="w-8 h-8 mr-3 text-emerald-500" />
                    バッテリー寿命 計算機
                </h1>

                <div className="bg-white p-8 rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 space-y-8">
                    {/* Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-2">バッテリー容量</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    value={capacity}
                                    onChange={e => setCapacity(e.target.value)}
                                    className="w-full p-4 pr-12 bg-zinc-50 border-2 border-zinc-200 rounded-xl outline-none focus:border-emerald-500 text-lg transition-colors"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold group-hover:text-zinc-600 transition-colors">mAh</span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-zinc-700 mb-2">消費電流</label>
                            <div className="relative group">
                                <input
                                    type="number"
                                    value={current}
                                    onChange={e => setCurrent(e.target.value)}
                                    className="w-full p-4 pr-12 bg-zinc-50 border-2 border-zinc-200 rounded-xl outline-none focus:border-emerald-500 text-lg transition-colors"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold group-hover:text-zinc-600 transition-colors">mA</span>
                            </div>
                        </div>
                    </div>

                    {/* Result */}
                    <div className="pt-8 border-t border-zinc-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-emerald-50 p-6 rounded-2xl text-center border-2 border-emerald-100">
                                <p className="text-sm text-emerald-700 font-bold uppercase mb-2">安全な見積もり (80%)</p>
                                <p className="text-4xl font-black text-zinc-900 tracking-tight">
                                    {formatTime(safeHours)}
                                </p>
                                <p className="text-xs text-emerald-600/70 mt-1 font-medium">推奨</p>
                            </div>
                            <div className="bg-zinc-50 p-6 rounded-2xl text-center border-2 border-dashed border-zinc-200">
                                <p className="text-sm text-zinc-500 font-bold uppercase mb-2">理論上の最大値 (100%)</p>
                                <p className="text-3xl font-bold text-zinc-600 tracking-tight">
                                    {formatTime(theoreticalHours)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="text-xs text-zinc-400 text-center mt-2 leading-relaxed">
                        ※定電流放電を仮定した簡略計算です。「安全な見積もり」では、電圧降下やバッテリー劣化を考慮し、理論値の80%として算出しています。
                    </p>
                </div>
            </div>
        </div>
    );
}
