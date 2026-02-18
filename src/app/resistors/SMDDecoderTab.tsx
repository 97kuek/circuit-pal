"use client";

import { useState } from "react";

export default function SMDDecoderTab() {
    const [smdCode, setSmdCode] = useState("");

    const calculateSMD = (code: string) => {
        if (!code) return null;
        const c = code.toUpperCase();

        // 3-digit: 102 = 10 * 10^2 = 1000
        if (/^\d{3}$/.test(c)) {
            const val = parseInt(c.substring(0, 2));
            const mult = parseInt(c.substring(2));
            return val * Math.pow(10, mult);
        }
        // 4-digit: 1002 = 100 * 10^2 = 10000
        if (/^\d{4}$/.test(c)) {
            const val = parseInt(c.substring(0, 3));
            const mult = parseInt(c.substring(3));
            return val * Math.pow(10, mult);
        }
        // R notation: 4R7 = 4.7
        if (c.includes('R')) {
            return parseFloat(c.replace('R', '.'));
        }
        return null;
    };

    const formatRes = (r: number | null) => {
        if (r === null) return "Invalid Code";
        if (r >= 1000000) return (r / 1000000) + " MΩ";
        if (r >= 1000) return (r / 1000) + " kΩ";
        return r + " Ω";
    };

    const result = calculateSMD(smdCode);

    return (
        <div className="max-w-md mx-auto py-12">
            <div className="bg-zinc-900 p-8 rounded-3xl shadow-xl text-center space-y-6">
                <h2 className="text-zinc-500 font-bold uppercase tracking-widest text-xs">SMDコードを入力</h2>

                <div className="flex justify-center">
                    <div className="bg-black border-2 border-zinc-700 p-4 rounded-lg w-40">
                        <input
                            className="bg-transparent text-white text-3xl font-mono text-center w-full outline-none uppercase placeholder-zinc-700"
                            placeholder="103"
                            maxLength={4}
                            value={smdCode}
                            onChange={(e) => setSmdCode(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pt-6 border-t border-zinc-800">
                    <div className="text-xs text-zinc-500 mb-2 font-bold uppercase">抵抗値</div>
                    <div className={`text-4xl font-black ${result !== null ? 'text-green-400' : 'text-zinc-700'}`}>
                        {smdCode ? formatRes(result) : "---"}
                    </div>
                </div>

                <p className="text-xs text-zinc-500 pt-4">
                    3桁, 4桁, および 'R' 表記に対応しています。
                </p>
            </div>
        </div>
    );
}
