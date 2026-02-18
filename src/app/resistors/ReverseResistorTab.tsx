"use client";

import { useState, useMemo } from "react";
import { getColorsFromResistance } from "@/lib/reverse-resistor";
import { RESISTOR_COLORS } from "@/lib/constants";

export default function ReverseResistorTab() {
    const [inputValue, setInputValue] = useState("4700");
    const [bands, setBands] = useState<4 | 5>(4);

    const resistance = parseFloat(inputValue);
    const colorNames = useMemo(() => {
        if (isNaN(resistance) || resistance <= 0) return [];
        return getColorsFromResistance(resistance, bands);
    }, [resistance, bands]);

    const colorData = colorNames.map(name =>
        RESISTOR_COLORS.find(c => c.color === name)
    ).filter(Boolean);

    const formatRes = (r: number) => {
        if (isNaN(r) || r <= 0) return "---";
        if (r >= 1000000) return (r / 1000000) + " MΩ";
        if (r >= 1000) return (r / 1000) + " kΩ";
        return r + " Ω";
    };

    const presets = [
        { label: "100Ω", value: 100 },
        { label: "220Ω", value: 220 },
        { label: "1kΩ", value: 1000 },
        { label: "4.7kΩ", value: 4700 },
        { label: "10kΩ", value: 10000 },
        { label: "47kΩ", value: 47000 },
        { label: "100kΩ", value: 100000 },
        { label: "1MΩ", value: 1000000 },
    ];

    return (
        <div className="space-y-8">
            {/* Band Toggle */}
            <div className="flex justify-center mb-4">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl flex gap-1">
                    <button
                        onClick={() => setBands(4)}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${bands === 4 ? 'bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
                    >
                        4本帯
                    </button>
                    <button
                        onClick={() => setBands(5)}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${bands === 5 ? 'bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600'}`}
                    >
                        5本帯
                    </button>
                </div>
            </div>

            {/* Input Section */}
            <div className="max-w-md mx-auto bg-white dark:bg-zinc-800 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-3 tracking-wider">
                    抵抗値を入力
                </label>
                <div className="relative">
                    <input
                        type="number"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-full bg-zinc-50 dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-600 focus:border-purple-500 rounded-xl px-4 py-4 text-2xl font-bold font-mono text-center outline-none transition-all text-zinc-900 dark:text-white"
                        placeholder="4700"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">Ω</span>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap gap-2 mt-4 justify-center">
                    {presets.map(p => (
                        <button
                            key={p.value}
                            onClick={() => setInputValue(String(p.value))}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${parseFloat(inputValue) === p.value
                                    ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-700'
                                    : 'bg-zinc-50 dark:bg-zinc-800 text-zinc-500 border-zinc-200 dark:border-zinc-600 hover:border-zinc-300'
                                }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Visual Resistor */}
            {colorData.length > 0 && (
                <div className="relative h-40 flex items-center justify-center select-none">
                    <div className="absolute w-[90%] h-2 bg-zinc-300 dark:bg-zinc-600 rounded-full"></div>
                    <div className="absolute w-[60%] h-24 bg-[#e8e4c9] rounded-full border-4 border-[#dcd8bd] shadow-inner flex items-center justify-center gap-4 md:gap-8 overflow-hidden z-10">
                        {colorData.map((c, i) => {
                            const isToleranceBand = i === colorData.length - 1;
                            return (
                                <div key={i} className="flex flex-col items-center">
                                    {isToleranceBand && <div className="w-6"></div>}
                                    <div
                                        className="w-4 md:w-6 h-full min-h-[96px]"
                                        style={{ backgroundColor: c!.hex === 'transparent' ? '#e8e4c9' : c!.hex }}
                                    ></div>
                                </div>
                            );
                        })}
                    </div>
                    <div className="absolute -bottom-16 bg-zinc-900 text-white px-6 py-2 rounded-xl shadow-xl font-mono text-xl font-bold border border-zinc-700">
                        {formatRes(resistance)}
                    </div>
                </div>
            )}

            <div className="h-8"></div>

            {/* Color Band Legend */}
            {colorData.length > 0 && (
                <div className="max-w-md mx-auto bg-white dark:bg-zinc-800 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-700">
                    <h3 className="text-xs font-bold text-zinc-400 uppercase mb-4 tracking-wider">カラーコード</h3>
                    <div className="space-y-2">
                        {colorData.map((c, i) => {
                            const labels = bands === 4
                                ? ["1本目", "2本目", "乗数", "許容差"]
                                : ["1本目", "2本目", "3本目", "乗数", "許容差"];
                            return (
                                <div key={i} className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-6 rounded border border-zinc-300 dark:border-zinc-600"
                                        style={{ backgroundColor: c!.hex === 'transparent' ? '#e8e4c9' : c!.hex }}
                                    ></div>
                                    <span className="text-xs font-bold text-zinc-400 w-12">{labels[i]}</span>
                                    <span className="text-sm font-bold text-zinc-700 dark:text-zinc-300 capitalize">{c!.color}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
