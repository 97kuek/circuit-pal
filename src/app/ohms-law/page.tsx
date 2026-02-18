"use client";

import Link from "next/link";
import { ArrowLeft, RefreshCw, Trash2, Zap } from "lucide-react";
import { useState } from "react";
import { calculateOhmsLaw } from "@/lib/calculations";

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
    };

    const handleClear = () => {
        setValues({ v: "", i: "", r: "", p: "" });
        setError(null);
    };

    const handleChange = (key: keyof typeof values, val: string) => {
        setValues(prev => ({ ...prev, [key]: val }));
    };

    return (
        <div className="min-h-screen bg-zinc-50 p-6 md:p-12 font-sans text-zinc-900">
            <div className="max-w-4xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-zinc-900 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    ダッシュボードに戻る
                </Link>

                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold flex items-center">
                        <Zap className="w-8 h-8 mr-3 text-amber-500" />
                        オームの法則 計算機
                    </h1>
                    <button
                        onClick={handleClear}
                        className="flex items-center px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        クリア
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100">

                    <InputGroup
                        label="電圧 (Voltage)"
                        unit="V"
                        value={values.v}
                        onChange={(v) => handleChange('v', v)}
                        color="text-blue-600"
                        placeholder="例: 5"
                    />
                    <InputGroup
                        label="電流 (Current)"
                        unit="A"
                        value={values.i}
                        onChange={(v) => handleChange('i', v)}
                        color="text-green-600"
                        placeholder="例: 0.02 (20mA)"
                    />
                    <InputGroup
                        label="抵抗 (Resistance)"
                        unit="Ω"
                        value={values.r}
                        onChange={(v) => handleChange('r', v)}
                        color="text-amber-600"
                        placeholder="例: 220"
                    />
                    <InputGroup
                        label="電力 (Power)"
                        unit="W"
                        value={values.p}
                        onChange={(v) => handleChange('p', v)}
                        color="text-rose-600"
                        placeholder=""
                    />
                </div>

                {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100">
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

                <div className="bg-zinc-100 p-6 rounded-xl text-zinc-500 text-sm">
                    <h3 className="font-bold mb-2 text-zinc-700">使い方</h3>
                    <p>
                        上記の4つの項目のうち、<span className="font-bold text-zinc-900">分かっている2つ</span>を入力して「計算する」ボタンを押してください。残りの2つの値が自動的に計算されます。
                    </p>
                </div>
            </div>
        </div>
    );
}

function InputGroup({ label, unit, value, onChange, color, placeholder }: {
    label: string;
    unit: string;
    value: string;
    onChange: (val: string) => void;
    color: string;
    placeholder: string;
}) {
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
                    className="w-full p-4 pr-12 bg-zinc-50 border-2 border-zinc-200 rounded-xl focus:border-blue-500 outline-none text-xl font-mono text-zinc-900 transition-colors placeholder-zinc-300"
                    placeholder={placeholder}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold group-hover:text-zinc-600 transition-colors">
                    {unit}
                </span>
            </div>
        </div>
    );
}
