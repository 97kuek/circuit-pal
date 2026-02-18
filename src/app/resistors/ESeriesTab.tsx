"use client";

import { useState } from "react";
import { findNearest, SeriesType } from "@/lib/e-series";
import { formatResistance } from "@/lib/calculations";
import { Search, ArrowRight } from "lucide-react";

export default function ESeriesTab() {
    const [inputValue, setInputValue] = useState("4700");
    const [resistance, setResistance] = useState(4700);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        const val = parseFloat(e.target.value);
        if (!isNaN(val) && val > 0) {
            setResistance(val);
        }
    };

    const presets = [
        { label: "100Ω", value: 100 },
        { label: "4.7kΩ", value: 4700 },
        { label: "10kΩ", value: 10000 },
        { label: "499Ω", value: 499 }, // E96 example
    ];

    const results = [
        { type: 'E12' as SeriesType, label: "E12系列 (10%)", desc: "一般的なカーボン抵抗" },
        { type: 'E24' as SeriesType, label: "E24系列 (5%)", desc: "最も標準的な抵抗値" },
        { type: 'E96' as SeriesType, label: "E96系列 (1%)", desc: "精密な金属皮膜抵抗" },
    ].map(series => ({
        ...series,
        result: findNearest(resistance, series.type)
    }));

    return (
        <div className="space-y-8">
            {/* Input Section */}
            <div className="max-w-md mx-auto bg-white dark:bg-zinc-800 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-3 tracking-wider">
                    希望する抵抗値
                </label>
                <div className="relative mb-4">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-700 focus:border-blue-500 rounded-xl px-4 py-4 text-2xl font-bold font-mono text-center outline-none transition-all text-zinc-900 dark:text-white"
                        placeholder="例: 4700"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">Ω</span>
                </div>

                <div className="flex flex-wrap gap-2 justify-center">
                    {presets.map(p => (
                        <button
                            key={p.value}
                            onClick={() => {
                                setInputValue(p.value.toString());
                                setResistance(p.value);
                            }}
                            className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-lg text-xs font-bold hover:bg-zinc-100 dark:hover:bg-zinc-700 transition-colors"
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex justify-center text-zinc-300 dark:text-zinc-600">
                <ArrowRight className="w-6 h-6 rotate-90" />
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.map((item) => (
                    <div
                        key={item.type}
                        className={`relative p-6 rounded-2xl border transition-all ${item.result.exact
                            ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 ring-2 ring-green-500 ring-offset-2 dark:ring-offset-zinc-950"
                            : "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700 shadow-sm"
                            }`}
                    >
                        {item.result.exact && (
                            <div className="absolute top-0 right-0 -mt-2 -mr-2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-sm">
                                EXACT
                            </div>
                        )}

                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{item.label}</h3>
                                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{item.desc}</p>
                            </div>
                        </div>

                        <div className="text-center py-4">
                            <div className="text-3xl font-black font-mono text-zinc-900 dark:text-white">
                                {formatResistance(item.result.value)}
                            </div>
                            {!item.result.exact && (
                                <div className="text-xs font-mono font-bold text-zinc-400 mt-2">
                                    誤差: {(item.result.diff / resistance * 100).toFixed(2)}%
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
