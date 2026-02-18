"use client";

import Link from "next/link";
import { ArrowLeft, Lightbulb } from "lucide-react";
import { useState } from "react";
import { calculateLedResistor, formatResistance } from "@/lib/calculations";

export default function LedPage() {
    const [vs, setVs] = useState("5");
    const [vf, setVf] = useState("2");
    const [ifwd, setIfwd] = useState("20");

    const [result, setResult] = useState<{ r: number, p: number, nearest: number } | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCalculate = () => {
        setError(null);
        const v_s = parseFloat(vs);
        const v_f = parseFloat(vf);
        const i_f = parseFloat(ifwd);

        if (isNaN(v_s) || isNaN(v_f) || isNaN(i_f)) {
            setError("有効な数値を入力してください。");
            return;
        }

        const i_f_amps = i_f / 1000;
        const res = calculateLedResistor(v_s, v_f, i_f_amps);

        if ('error' in res && res.error) {
            setError("電源電圧はLEDの順方向電圧より大きい必要があります。");
            setResult(null);
        } else if ('r' in res) {
            setResult(res as { r: number, p: number, nearest: number });
        }
    };

    return (
        <div className="min-h-screen bg-zinc-50 p-6 md:p-12 font-sans text-zinc-900">
            <div className="max-w-4xl mx-auto space-y-8">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-zinc-900 transition-colors">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    ダッシュボードに戻る
                </Link>
                <h1 className="text-3xl font-bold flex items-center">
                    <Lightbulb className="w-8 h-8 mr-3 text-rose-500" />
                    LED抵抗計算機
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Inputs */}
                    <div className="bg-white p-8 rounded-2xl shadow-xl shadow-zinc-200/50 border border-zinc-100 space-y-8">
                        <h2 className="text-xl font-bold text-zinc-900 flex items-center">
                            パラメータ入力
                        </h2>

                        <div className="space-y-6">
                            <InputGroup label="電源電圧 (Vs)" value={vs} onChange={setVs} unit="V" placeholder="例: 5, 3.3" />
                            <InputGroup label="LED 順方向電圧 (Vf)" value={vf} onChange={setVf} unit="V" placeholder="例: 2.0 (赤), 3.0 (青/白)" />
                            <InputGroup label="LED 電流 (If)" value={ifwd} onChange={setIfwd} unit="mA" placeholder="例: 20 (一般的)" />
                        </div>

                        <button
                            onClick={handleCalculate}
                            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow-lg active:scale-95"
                        >
                            抵抗値を計算
                        </button>

                        {error && (
                            <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-100 text-sm">
                                {error}
                            </div>
                        )}
                    </div>

                    {/* Results */}
                    <div className="bg-zinc-100 p-8 rounded-2xl border-2 border-dashed border-zinc-300 flex flex-col justify-center items-center text-center">
                        {!result ? (
                            <div className="text-zinc-400 space-y-2">
                                <p>パラメータを入力して</p>
                                <p>計算ボタンを押してください</p>
                            </div>
                        ) : (
                            <div className="space-y-10 w-full animate-in fade-in zoom-in duration-300">
                                <div>
                                    <p className="text-sm font-bold uppercase tracking-wider text-zinc-500 mb-2">推奨抵抗値 (E24系列)</p>
                                    <p className="text-6xl font-black text-blue-600">
                                        {formatResistance(result.nearest)}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-6 border-t border-zinc-200 pt-8">
                                    <div>
                                        <p className="text-xs font-bold text-zinc-500 uppercase mb-1">計算上の正確な値</p>
                                        <p className="text-2xl font-mono text-zinc-700">{result.r.toFixed(2)} Ω</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-500 uppercase mb-1">消費電力</p>
                                        <p className="text-2xl font-mono text-rose-500 font-bold">{(result.p * 1000).toFixed(0)} mW</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function InputGroup({ label, value, onChange, unit, placeholder }: { label: string, value: string, onChange: (v: string) => void, unit: string, placeholder: string }) {
    return (
        <div>
            <label className="block text-sm font-bold text-zinc-700 mb-2">{label}</label>
            <div className="relative">
                <input
                    type="number"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full p-4 pr-12 bg-zinc-50 border border-zinc-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-shadow font-mono"
                    placeholder={placeholder}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">{unit}</span>
            </div>
        </div>
    );
}
