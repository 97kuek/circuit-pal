"use client";

import { useState, useMemo, useCallback } from "react";
import { Copy, Check } from "lucide-react";
import { RESISTOR_COLORS, VALID_DIGIT_COLORS, VALID_MULTIPLIER_COLORS, VALID_TOLERANCE_COLORS, ColorCode } from "@/lib/constants";
import { formatResistance } from "@/lib/calculations";

export default function ResistorColorTab() {
    const [bands, setBands] = useState<number>(4);
    const [band1, setBand1] = useState(VALID_DIGIT_COLORS[1]); // Brown
    const [band2, setBand2] = useState(VALID_DIGIT_COLORS[0]); // Black
    const [band3, setBand3] = useState(VALID_DIGIT_COLORS[0]); // Black (for 5 band)
    const [multiplier, setMultiplier] = useState(VALID_MULTIPLIER_COLORS[2]); // Red (x100)
    const [tolerance, setTolerance] = useState(VALID_TOLERANCE_COLORS.find(c => c.color === "gold")!); // Gold (5%)
    const [copied, setCopied] = useState(false);

    const resistance = useMemo(() => {
        let base = 0;
        if (bands === 4) {
            base = (band1.value! * 10) + band2.value!;
        } else {
            base = (band1.value! * 100) + (band2.value! * 10) + band3.value!;
        }
        return base * (multiplier.multiplier ?? 1);
    }, [bands, band1, band2, band3, multiplier]);

    const handleCopy = useCallback(async () => {
        const text = `${formatResistance(resistance)} ±${tolerance.tolerance}%`;
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, [resistance, tolerance]);

    const ColorButton = ({ color, selected, onClick }: { color: ColorCode, selected: boolean, onClick: () => void }) => (
        <button
            onClick={onClick}
            className={`w-full h-8 rounded flex items-center justify-center text-[10px] font-bold uppercase transition-transform active:scale-95 ${selected ? 'ring-2 ring-offset-2 ring-zinc-400 dark:ring-offset-zinc-800 z-10 scale-105 rounded-md shadow-sm' : 'rounded-sm opacity-80 hover:opacity-100'}`}
            style={{ backgroundColor: color.hex, color: ['white', 'silver', 'yellow', 'gold'].includes(color.color) ? 'black' : 'white' }}
        >
            {selected && "•"}
        </button>
    );

    return (
        <div className="space-y-8">
            {/* Toggle 4/5 Bands */}
            <div className="flex justify-center mb-8">
                <div className="bg-zinc-100 dark:bg-zinc-800 p-1 rounded-xl flex gap-1">
                    <button
                        onClick={() => setBands(4)}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${bands === 4 ? 'bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                    >
                        4本帯
                    </button>
                    <button
                        onClick={() => setBands(5)}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${bands === 5 ? 'bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white' : 'text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300'}`}
                    >
                        5本帯
                    </button>
                </div>
            </div>

            {/* Visual Resistor */}
            <div className="relative h-40 flex items-center justify-center select-none">
                <div className="absolute w-[90%] h-2 bg-zinc-300 dark:bg-zinc-600 rounded-full"></div>
                <div className="absolute w-[60%] h-24 bg-[#e8e4c9] dark:bg-[#c5c1a8] rounded-full border-4 border-[#dcd8bd] dark:border-[#b5b19a] shadow-inner flex items-center justify-center gap-4 md:gap-8 overflow-hidden z-10">
                    <div className="w-4 md:w-6 h-full" style={{ backgroundColor: band1.hex }}></div>
                    <div className="w-4 md:w-6 h-full" style={{ backgroundColor: band2.hex }}></div>
                    {bands === 5 && (
                        <div className="w-4 md:w-6 h-full" style={{ backgroundColor: band3.hex }}></div>
                    )}
                    <div className="w-4 md:w-6 h-full" style={{ backgroundColor: multiplier.hex }}></div>
                    <div className="w-8"></div>
                    <div className="w-4 md:w-6 h-full" style={{ backgroundColor: tolerance.hex }}></div>
                </div>

                <div className="absolute -bottom-16 flex items-center gap-2">
                    <div className="bg-zinc-900 dark:bg-zinc-800 text-white px-6 py-2 rounded-xl shadow-xl font-mono text-xl font-bold border border-zinc-700">
                        {formatResistance(resistance)} <span className="text-zinc-400 text-sm">±{tolerance.tolerance}%</span>
                    </div>
                    <button
                        onClick={handleCopy}
                        className="p-2 bg-zinc-800 dark:bg-zinc-700 hover:bg-zinc-700 dark:hover:bg-zinc-600 text-zinc-300 rounded-lg transition-colors shadow-md"
                        title="結果をコピー"
                    >
                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                </div>
            </div>

            <div className="h-8"></div>

            {/* Color Pickers Grid */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase block text-center mb-2">1本目</span>
                    {VALID_DIGIT_COLORS.map(c => (
                        <ColorButton key={c.color} color={c} selected={band1.color === c.color} onClick={() => setBand1(c)} />
                    ))}
                </div>

                <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase block text-center mb-2">2本目</span>
                    {VALID_DIGIT_COLORS.map(c => (
                        <ColorButton key={c.color} color={c} selected={band2.color === c.color} onClick={() => setBand2(c)} />
                    ))}
                </div>

                {bands === 5 && (
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-zinc-400 uppercase block text-center mb-2">3本目</span>
                        {VALID_DIGIT_COLORS.map(c => (
                            <ColorButton key={c.color} color={c} selected={band3.color === c.color} onClick={() => setBand3(c)} />
                        ))}
                    </div>
                )}

                <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase block text-center mb-2">乗数</span>
                    {VALID_MULTIPLIER_COLORS.map(c => (
                        <ColorButton key={c.color} color={c} selected={multiplier.color === c.color} onClick={() => setMultiplier(c)} />
                    ))}
                </div>

                <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase block text-center mb-2">許容差</span>
                    {VALID_TOLERANCE_COLORS.map(c => (
                        <ColorButton key={c.color} color={c} selected={tolerance.color === c.color} onClick={() => setTolerance(c)} />
                    ))}
                </div>
            </div>
        </div>
    );
}
