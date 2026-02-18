"use client";

import { useState } from "react";
import { ArrowLeft, ArrowLeftRight, Copy, Check } from "lucide-react";
import Link from "next/link";

type UnitGroup = {
    name: string;
    label: string;
    units: { name: string; factor: number }[];
    icon: string;
};

const UNIT_GROUPS: UnitGroup[] = [
    {
        name: "resistance",
        label: "抵抗",
        icon: "Ω",
        units: [
            { name: "mΩ", factor: 0.001 },
            { name: "Ω", factor: 1 },
            { name: "kΩ", factor: 1000 },
            { name: "MΩ", factor: 1000000 },
        ],
    },
    {
        name: "capacitance",
        label: "静電容量",
        icon: "F",
        units: [
            { name: "pF", factor: 1e-12 },
            { name: "nF", factor: 1e-9 },
            { name: "µF", factor: 1e-6 },
            { name: "mF", factor: 1e-3 },
        ],
    },
    {
        name: "current",
        label: "電流",
        icon: "A",
        units: [
            { name: "µA", factor: 1e-6 },
            { name: "mA", factor: 0.001 },
            { name: "A", factor: 1 },
        ],
    },
    {
        name: "voltage",
        label: "電圧",
        icon: "V",
        units: [
            { name: "µV", factor: 1e-6 },
            { name: "mV", factor: 0.001 },
            { name: "V", factor: 1 },
            { name: "kV", factor: 1000 },
        ],
    },
    {
        name: "power",
        label: "電力",
        icon: "W",
        units: [
            { name: "µW", factor: 1e-6 },
            { name: "mW", factor: 0.001 },
            { name: "W", factor: 1 },
            { name: "kW", factor: 1000 },
        ],
    },
    {
        name: "frequency",
        label: "周波数",
        icon: "Hz",
        units: [
            { name: "Hz", factor: 1 },
            { name: "kHz", factor: 1000 },
            { name: "MHz", factor: 1e6 },
            { name: "GHz", factor: 1e9 },
        ],
    },
];

function formatValue(value: number): string {
    if (value === 0) return "0";
    if (Math.abs(value) >= 1e9) return value.toExponential(4);
    if (Math.abs(value) < 1e-9) return value.toExponential(4);
    // Use at most 6 significant digits
    const formatted = Number(value.toPrecision(6));
    return formatted.toLocaleString(undefined, { maximumFractionDigits: 10 });
}

export default function UnitConverterPage() {
    const [activeGroup, setActiveGroup] = useState(0);
    const [inputValue, setInputValue] = useState("1");
    const [inputUnit, setInputUnit] = useState(1); // index into units array
    const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

    const group = UNIT_GROUPS[activeGroup];
    const baseValue = parseFloat(inputValue) * group.units[inputUnit].factor;

    const handleCopy = async (text: string, idx: number) => {
        await navigator.clipboard.writeText(text);
        setCopiedIdx(idx);
        setTimeout(() => setCopiedIdx(null), 1500);
    };

    const handleGroupChange = (idx: number) => {
        setActiveGroup(idx);
        setInputUnit(1); // reset to base unit
        setInputValue("1");
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 bg-grid-pattern font-sans text-zinc-900 dark:text-zinc-100">
            <div className="max-w-4xl mx-auto p-4 md:p-12">
                <Link href="/" className="inline-flex items-center text-zinc-500 dark:text-zinc-400 hover:text-blue-600 mb-8 transition-colors font-mono text-sm group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    ダッシュボード
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl shadow-lg">
                        <ArrowLeftRight className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                            単位変換 <span className="text-zinc-400 font-mono text-xl font-normal">CONVERTER</span>
                        </h1>
                        <p className="text-xs text-zinc-400 font-mono mt-1">電子工作で使う単位を即座に変換</p>
                    </div>
                </div>

                {/* Category Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {UNIT_GROUPS.map((g, i) => (
                        <button
                            key={g.name}
                            onClick={() => handleGroupChange(i)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeGroup === i
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/30"
                                : "bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 hover:border-blue-300"
                                }`}
                        >
                            <span className="font-mono mr-1">{g.icon}</span> {g.label}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm p-6 mb-6">
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-3 tracking-wider">入力値</label>
                    <div className="flex gap-3">
                        <input
                            type="number"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="flex-1 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 focus:border-blue-500 rounded-xl px-4 py-4 text-2xl font-bold font-mono outline-none transition-all dark:text-white"
                            placeholder="1"
                        />
                        <select
                            value={inputUnit}
                            onChange={(e) => setInputUnit(Number(e.target.value))}
                            className="bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-4 text-lg font-bold font-mono outline-none focus:border-blue-500 transition-all dark:text-white min-w-[5rem]"
                        >
                            {group.units.map((u, i) => (
                                <option key={u.name} value={i}>{u.name}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden">
                    <div className="p-4 bg-zinc-50 dark:bg-zinc-800 border-b border-zinc-200 dark:border-zinc-700">
                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">変換結果</h3>
                    </div>
                    <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                        {group.units.map((u, i) => {
                            const converted = isNaN(baseValue) ? 0 : baseValue / u.factor;
                            const display = formatValue(converted);
                            const isInput = i === inputUnit;
                            return (
                                <div
                                    key={u.name}
                                    className={`flex items-center justify-between px-6 py-4 transition-colors ${isInput ? "bg-blue-50/50 dark:bg-blue-900/20" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-14 text-sm font-mono font-bold text-zinc-400">{u.name}</span>
                                        <span className={`text-xl font-bold font-mono ${isInput ? "text-blue-600 dark:text-blue-400" : "text-zinc-900 dark:text-white"}`}>
                                            {display}
                                        </span>
                                    </div>
                                    <button
                                        onClick={() => handleCopy(`${display} ${u.name}`, i)}
                                        className="p-2 text-zinc-300 hover:text-blue-500 dark:text-zinc-600 dark:hover:text-blue-400 transition-colors"
                                        title="コピー"
                                    >
                                        {copiedIdx === i ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
