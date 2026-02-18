"use client";

import Link from "next/link";
import { ArrowLeft, Check, Copy, GripHorizontal } from "lucide-react";
import { useState, useMemo } from "react";
import { RESISTOR_COLORS } from "@/lib/constants";
import type { ResistorColor } from "@/lib/constants";
import { calculateResistance, formatResistance } from "@/lib/calculations";
import { getColorsFromResistance } from "@/lib/reverse-resistor";
import * as Tabs from "@radix-ui/react-tabs";

// Helper for Japanese color names
const COLOR_NAMES_JP: Record<string, string> = {
    black: "黒",
    brown: "茶",
    red: "赤",
    orange: "橙",
    yellow: "黄",
    green: "緑",
    blue: "青",
    violet: "紫",
    gray: "灰",
    white: "白",
    gold: "金",
    silver: "銀",
    none: "なし",
};

export default function ResistorPage() {
    // Mode 1: Color -> Value
    const [bandCount, setBandCount] = useState<4 | 5 | 6>(4);
    const [bands, setBands] = useState<ResistorColor[]>([
        "brown",
        "black",
        "red",
        "gold",
        "brown",
        "red",
    ]);
    const [copied, setCopied] = useState(false);

    // Mode 2: Value -> Color
    const [valueStr, setValueStr] = useState("4.7k");
    const [reverseBands, setReverseBands] = useState<string[]>([]);

    // Calculate Mode 1
    const result = useMemo(() => {
        try {
            const activeBands = bands.slice(0, bandCount);
            return calculateResistance(activeBands, bandCount);
        } catch (e) {
            return null;
        }
    }, [bands, bandCount]);

    const handleBandChange = (index: number, color: ResistorColor) => {
        const newBands = [...bands];
        newBands[index] = color;
        setBands(newBands);
    };

    const copyToClipboard = () => {
        if (result) {
            navigator.clipboard.writeText(formatResistance(result.value));
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Calculate Mode 2
    const handleReverseCalculate = () => {
        let val = valueStr.toLowerCase();
        let multiplier = 1;
        if (val.endsWith("k")) multiplier = 1000;
        else if (val.endsWith("m")) multiplier = 1000000;
        else if (val.endsWith("g")) multiplier = 1000000000;

        val = val.replace(/[kmg]/g, "");
        const num = parseFloat(val);

        if (!isNaN(num)) {
            const r = num * multiplier;
            setReverseBands(getColorsFromResistance(r, 4));
        } else {
            setReverseBands([]);
        }
    };

    // Initial reverse calc
    useState(() => {
        handleReverseCalculate();
    });

    return (
        <div className="min-h-screen bg-zinc-50 p-6 md:p-12 font-sans text-zinc-900">
            <div className="max-w-4xl mx-auto space-y-8">
                <Link
                    href="/"
                    className="inline-flex items-center text-zinc-500 hover:text-zinc-900 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    ダッシュボードに戻る
                </Link>

                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">抵抗値計算ツール</h1>
                    <p className="text-zinc-500">カラーコードの読み取りと、抵抗値からの逆引きができます。</p>
                </div>

                <Tabs.Root defaultValue="decoder" className="flex flex-col gap-6">
                    <Tabs.List className="flex border-b border-zinc-200">
                        <Tabs.Trigger
                            value="decoder"
                            className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 transition-all"
                        >
                            カラーコード読取
                        </Tabs.Trigger>
                        <Tabs.Trigger
                            value="reverse"
                            className="px-6 py-3 text-sm font-medium text-zinc-500 hover:text-zinc-900 border-b-2 border-transparent data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 transition-all"
                        >
                            逆引き検索 (値→色)
                        </Tabs.Trigger>
                    </Tabs.List>

                    <Tabs.Content value="decoder" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Band Selector */}
                        <div className="flex justify-center gap-2">
                            {[4, 5, 6].map((count) => (
                                <button
                                    key={count}
                                    onClick={() => setBandCount(count as 4 | 5 | 6)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${bandCount === count
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                            : "bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-300"
                                        }`}
                                >
                                    {count}本帯
                                </button>
                            ))}
                        </div>

                        {/* Resistor Visual */}
                        <div className="bg-white rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 p-12 flex justify-center items-center overflow-hidden">
                            <div className="relative flex items-center filter drop-shadow-2xl">
                                <div className="w-12 h-3 bg-zinc-400 rounded-l-sm"></div>
                                <div className="relative flex items-center h-20 bg-[#f3e3c3] rounded-full px-6 border-t-4 border-b-4 border-black/5 z-10 w-[300px] justify-between">
                                    {Array.from({ length: bandCount }).map((_, i) => {
                                        const colorName = bands[i];
                                        const colorData = RESISTOR_COLORS.find(c => c.color === colorName);
                                        return (
                                            <div
                                                key={i}
                                                className="w-5 h-full transform scale-y-110 shadow-sm"
                                                style={{ backgroundColor: colorData?.hex }}
                                            />
                                        );
                                    })}
                                </div>
                                <div className="w-12 h-3 bg-zinc-400 rounded-r-sm"></div>
                            </div>
                        </div>

                        {/* Result */}
                        <div className="text-center space-y-2">
                            <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">抵抗値</p>
                            <div className="flex items-center justify-center gap-4">
                                <h2 className="text-6xl md:text-7xl font-black text-zinc-900 tracking-tighter">
                                    {result ? formatResistance(result.value) : "Error"}
                                </h2>
                                <button onClick={copyToClipboard} className="p-3 bg-zinc-100 rounded-full hover:bg-zinc-200 transition-colors">
                                    {copied ? <Check className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
                                </button>
                            </div>
                            <p className="text-xl text-zinc-500 font-medium">
                                ±{result?.tolerance}% {result?.tempCoeff && `• ${result.tempCoeff} ppm/K`}
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {Array.from({ length: bandCount }).map((_, i) => (
                                <div key={i} className="space-y-2">
                                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block text-center">
                                        {i === bandCount - 1 ? "許容差" : (bandCount === 6 && i === 5 ? "温度係数" : (i === bandCount - 2 || (bandCount === 4 && i === 2) ? "乗数" : `帯 ${i + 1}`))}
                                    </label>
                                    <div className="relative">
                                        <select
                                            value={bands[i]}
                                            onChange={(e) => handleBandChange(i, e.target.value as ResistorColor)}
                                            className="w-full appearance-none bg-white border border-zinc-200 text-zinc-900 py-3 pl-4 pr-10 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                        >
                                            {RESISTOR_COLORS.map(c => (
                                                <option key={c.color} value={c.color}>
                                                    {COLOR_NAMES_JP[c.color] || c.color}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full pointer-events-none border border-zinc-200" style={{ backgroundColor: RESISTOR_COLORS.find(c => c.color === bands[i])?.hex }} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Tabs.Content>

                    <Tabs.Content value="reverse" className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="max-w-xl mx-auto space-y-8 bg-white p-8 rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100">
                            <div className="space-y-4">
                                <label className="block text-sm font-bold text-zinc-700">抵抗値（例: 4.7k, 100, 1M）</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={valueStr}
                                        onChange={(e) => setValueStr(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleReverseCalculate()}
                                        className="flex-1 bg-zinc-50 border-2 border-zinc-200 rounded-xl px-4 py-3 text-lg font-mono focus:border-blue-500 outline-none transition-colors"
                                    />
                                    <button
                                        onClick={handleReverseCalculate}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-xl font-bold transition-colors"
                                    >
                                        <GripHorizontal className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {reverseBands.length > 0 ? (
                                <div className="space-y-6">
                                    <div className="h-16 bg-[#f3e3c3] rounded-full flex items-center justify-center relative shadow-inner border border-black/10">
                                        <div className="absolute left-0 w-8 h-1 bg-zinc-400"></div>
                                        <div className="absolute right-0 w-8 h-1 bg-zinc-400"></div>
                                        {reverseBands.map((color, i) => {
                                            const data = RESISTOR_COLORS.find(c => c.color === color);
                                            return (
                                                <div
                                                    key={i}
                                                    className={`w-3 h-full ${i === 3 ? 'ml-8' : 'mx-2'}`}
                                                    style={{ backgroundColor: data?.hex }}
                                                />
                                            );
                                        })}
                                    </div>
                                    <div className="flex justify-center gap-3">
                                        {reverseBands.map((color, i) => (
                                            <div key={i} className="flex flex-col items-center">
                                                <div className="w-6 h-6 rounded-full border border-zinc-200 mb-1" style={{ backgroundColor: RESISTOR_COLORS.find(c => c.color === color)?.hex }}></div>
                                                <span className="text-xs font-bold text-zinc-500">{COLOR_NAMES_JP[color]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-zinc-400">
                                    値を入力して変換ボタンを押してください
                                </div>
                            )}
                        </div>
                    </Tabs.Content>
                </Tabs.Root>
            </div>
        </div>
    );
}
