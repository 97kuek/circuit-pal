"use client";

import { useState } from "react";

export default function LEDCalculatorTab() {
    const [sourceVoltage, setSourceVoltage] = useState(5);
    const [ledVoltage, setLedVoltage] = useState(2);
    const [ledCurrent, setLedCurrent] = useState(20);

    const resistance = Math.max(0, (sourceVoltage - ledVoltage) / (ledCurrent / 1000));
    const wattage = Math.pow(ledCurrent / 1000, 2) * resistance;

    const presets = [
        { name: "赤", v: 2.0, i: 20, color: "bg-red-500" },
        { name: "緑", v: 3.0, i: 20, color: "bg-green-500" },
        { name: "青", v: 3.3, i: 20, color: "bg-blue-500" },
        { name: "白", v: 3.3, i: 20, color: "bg-white border border-zinc-200" },
        { name: "黄", v: 2.1, i: 20, color: "bg-yellow-400" },
    ];

    return (
        <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 py-8">

            {/* Inputs */}
            <div className="space-y-6 bg-white p-6 rounded-2xl border border-zinc-200">
                <h3 className="text-xs font-bold text-zinc-400 uppercase mb-4">パラメータ設定</h3>

                <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-1">電源電圧 (Vs)</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={sourceVoltage}
                            onChange={(e) => setSourceVoltage(Number(e.target.value))}
                            className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded font-bold"
                        />
                        <span className="p-2 text-zinc-400 text-sm font-bold flex items-center">V</span>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-bold text-zinc-500 mb-2">LED色プリセット</label>
                    <div className="flex gap-2">
                        {presets.map(p => (
                            <button
                                key={p.name}
                                onClick={() => { setLedVoltage(p.v); setLedCurrent(p.i); }}
                                className={`w-8 h-8 rounded-full ${p.color} hover:scale-110 transition-transform shadow-sm`}
                                title={`${p.name} (${p.v}V)`}
                            />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-1">順方向電圧 (Vf)</label>
                        <input
                            type="number"
                            value={ledVoltage}
                            onChange={(e) => setLedVoltage(Number(e.target.value))}
                            step="0.1"
                            className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded font-bold"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-zinc-500 mb-1">電流 (mA)</label>
                        <input
                            type="number"
                            value={ledCurrent}
                            onChange={(e) => setLedCurrent(Number(e.target.value))}
                            className="w-full p-2 bg-zinc-50 border border-zinc-200 rounded font-bold"
                        />
                    </div>
                </div>
            </div>

            {/* Result */}
            <div className="bg-zinc-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-center items-center text-center">
                <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">推奨抵抗値</div>
                <div className="text-5xl font-black font-mono mb-1 text-purple-400">
                    {Math.ceil(resistance)} <span className="text-2xl text-zinc-500">Ω</span>
                </div>
                <div className="text-xs text-zinc-400 font-mono mb-8">
                    (計算値: {resistance.toFixed(1)} Ω)
                </div>

                <div className="w-full pt-6 border-t border-zinc-800 grid grid-cols-2 gap-4">
                    <div>
                        <div className="text-xs text-zinc-600 uppercase font-bold text-center">消費電力</div>
                        <div className="text-xl font-bold font-mono text-center">{wattage.toFixed(3)} W</div>
                    </div>
                    <div>
                        <div className="text-xs text-zinc-600 uppercase font-bold text-center">推奨定格</div>
                        <div className="text-xl font-bold font-mono text-center text-yellow-500">
                            {wattage < 0.25 ? "1/4 W" : wattage < 0.5 ? "1/2 W" : "1 W+"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
