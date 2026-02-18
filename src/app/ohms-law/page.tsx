"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw, Trash2, Zap, Copy, Check } from "lucide-react";
import { useState } from "react";
import { calculateOhmsLaw } from "@/lib/calculations";
import { useHistory } from "@/lib/history";
import HistoryPanel from "@/components/HistoryPanel";

export default function OhmsLawPage() {
    const [values, setValues] = useState<{
        v: string;
        i: string;
        r: string;
        p: string;
    }>({
        v: "",
        i: "",
        r: "",
        p: "",
    });

    const [error, setError] = useState<string | null>(null);
    const { history, addHistory, clearHistory } = useHistory('ohms-law');

    const handleCalculate = () => {
        setError(null);
        const v = parseFloat(values.v);
        const i = parseFloat(values.i);
        const r = parseFloat(values.r);
        const p = parseFloat(values.p);

        const inputs = [
            { key: 'v', val: v },
            { key: 'i', val: i },
            { key: 'r', val: r },
            { key: 'p', val: p }
        ].filter(item => !isNaN(item.val));

        if (inputs.length < 2) {
            setError("少なくとも2つの値を入力してください。");
            return;
        }

        const result = calculateOhmsLaw(
            isNaN(v) ? null : v,
            isNaN(i) ? null : i,
            isNaN(r) ? null : r,
            isNaN(p) ? null : p
        );

        if (result.voltage === null) {
            setError("計算できませんでした。値が矛盾している可能性があります。");
            return;
        }

        setValues({
            v: result.voltage?.toFixed(4) ?? "",
            i: result.current?.toFixed(4) ?? "",
            r: result.resistance?.toFixed(4) ?? "",
            p: result.power?.toFixed(4) ?? "",
        });

        // Add to history
        const summary = [
            result.voltage && `V:${result.voltage.toFixed(2)}V`,
            result.resistance && `R:${result.resistance.toFixed(2)}Ω`,
            result.current && `I:${result.current.toFixed(4)}A`,
            result.power && `P:${result.power.toFixed(2)}W`
        ].filter(Boolean).join(' / ');

        addHistory(summary, {
            v: result.voltage?.toFixed(4) ?? "",
            i: result.current?.toFixed(4) ?? "",
            r: result.resistance?.toFixed(4) ?? "",
            p: result.power?.toFixed(4) ?? "",
        });
    };

    const handleRestore = (item: any) => {
        setValues(item.data);
        setError(null);
    };

    const handleClear = () => {
        setValues({ v: "", i: "", r: "", p: "" });
        setError(null);
    };

    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        const lines = [
            values.v && `電圧: ${values.v} V`,
            values.i && `電流: ${values.i} A`,
            values.r && `抵抗: ${values.r} Ω`,
            values.p && `電力: ${values.p} W`,
        ].filter(Boolean).join('\n');
        if (!lines) return;
        navigator.clipboard.writeText(lines);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleChange = (key: keyof typeof values, val: string) => {
        setValues(prev => ({ ...prev, [key]: val }));
    };

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6 md:p-12 font-sans text-zinc-900 dark:text-zinc-100">
            <div className="max-w-4xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center text-zinc-500 dark:text-zinc-400 hover:text-amber-600 mb-8 transition-colors font-mono text-sm group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    ダッシュボード
                </Link>

                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-500 rounded-xl text-white shadow-lg shadow-amber-200">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                                オームの法則 <span className="text-zinc-400 font-mono text-xl font-normal">OHM'S LAW</span>
                            </h1>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCopy}
                            disabled={!values.v && !values.i && !values.r && !values.p}
                            className="flex items-center px-4 py-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                            {copied ? 'コピー済み' : '結果をコピー'}
                        </button>
                        <button
                            onClick={handleClear}
                            className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-lg transition-colors"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            クリア
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white dark:bg-zinc-900 p-8 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-900/50 border border-zinc-100 dark:border-zinc-800">

                    <InputGroup
                        label="電圧 (Voltage)"
                        unit="V"
                        value={values.v}
                        onChange={(v) => handleChange('v', v)}
                        color="text-blue-600"
                        placeholder="例: 5"
                        onEnter={handleCalculate}
                        onEscape={handleClear}
                    />
                    <InputGroup
                        label="電流 (Current)"
                        unit="A"
                        value={values.i}
                        onChange={(v) => handleChange('i', v)}
                        color="text-green-600"
                        placeholder="例: 0.02 (20mA)"
                        onEnter={handleCalculate}
                        onEscape={handleClear}
                    />
                    <InputGroup
                        label="抵抗 (Resistance)"
                        unit="Ω"
                        value={values.r}
                        onChange={(v) => handleChange('r', v)}
                        color="text-amber-600"
                        placeholder="例: 220"
                        onEnter={handleCalculate}
                        onEscape={handleClear}
                    />
                    <InputGroup
                        label="電力 (Power)"
                        unit="W"
                        value={values.p}
                        onChange={(v) => handleChange('p', v)}
                        color="text-rose-600"
                        placeholder=""
                        onEnter={handleCalculate}
                        onEscape={handleClear}
                    />
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-800">
                        {error}
                    </div>
                )}

                <div className="flex justify-center">
                    <button
                        onClick={handleCalculate}
                        className="flex items-center px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 w-full md:w-auto justify-center"
                    >
                        <RefreshCw className="w-5 h-5 mr-2" />
                        計算する
                    </button>
                </div>

                <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-xl text-zinc-500 text-sm">
                    <h3 className="font-bold mb-2 text-zinc-700 dark:text-zinc-300">使い方</h3>
                    <p>
                        上記の4つの項目のうち、<span className="font-bold text-zinc-900">分かっている2つ</span>を入力して「計算する」ボタンを押してください。残りの2つの値が自動的に計算されます。
                    </p>
                </div>

                <HistoryPanel history={history} onClear={clearHistory} onRestore={handleRestore} />
            </div>
        </div>
    );
}

function InputGroup({ label, unit, value, onChange, color, placeholder, onEnter, onEscape }: {
    label: string;
    unit: string;
    value: string;
    onChange: (val: string) => void;
    color: string;
    placeholder: string;
    onEnter?: () => void;
    onEscape?: () => void;
}) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && onEnter) {
            e.preventDefault();
            onEnter();
        }
        if (e.key === 'Escape' && onEscape) {
            e.preventDefault();
            onEscape();
        }
    };

    return (
        <div className="space-y-2">
            <label className={`block text-sm font-bold tracking-wide uppercase ${color}`}>
                {label}
            </label>
            <div className="relative group">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-4 pr-12 bg-zinc-50 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-xl focus:border-blue-500 outline-none text-xl font-mono text-zinc-900 dark:text-white transition-colors placeholder-zinc-300 dark:placeholder-zinc-600"
                    placeholder={placeholder}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold group-hover:text-zinc-600 transition-colors">
                    {unit}
                </span>
            </div>
        </div>
    );
}
