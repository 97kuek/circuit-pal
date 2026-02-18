"use client";

import { useState, useMemo } from "react";
// Assuming we need to recreate the logic briefly as it was inside the page component.

// Re-defining for self-containment or import if available.
// Ideally we should extract to lib, but for speed in this refactor, I will include logic here or import from lib if I made one.
// Checking previous steps, I made a `resistor-colors.ts`? No, I might have kept it in page.
// Let's check `src/lib` content? No, I'll just rewrite clean logic here.

const colors = [
    { name: "black", value: 0, mult: 1, tol: null, hex: "#000000", text: "text-white" },
    { name: "brown", value: 1, mult: 10, tol: 1, hex: "#8B4513", text: "text-white" },
    { name: "red", value: 2, mult: 100, tol: 2, hex: "#FF0000", text: "text-white" },
    { name: "orange", value: 3, mult: 1000, tol: null, hex: "#FF8C00", text: "text-black" },
    { name: "yellow", value: 4, mult: 10000, tol: null, hex: "#FFD700", text: "text-black" },
    { name: "green", value: 5, mult: 100000, tol: 0.5, hex: "#008000", text: "text-white" },
    { name: "blue", value: 6, mult: 1000000, tol: 0.25, hex: "#0000FF", text: "text-white" },
    { name: "violet", value: 7, mult: 10000000, tol: 0.1, hex: "#8A2BE2", text: "text-white" },
    { name: "grey", value: 8, mult: 100000000, tol: 0.05, hex: "#808080", text: "text-white" },
    { name: "white", value: 9, mult: 1000000000, tol: null, hex: "#FFFFFF", text: "text-black" },
    { name: "gold", value: null, mult: 0.1, tol: 5, hex: "#D4AF37", text: "text-black" },
    { name: "silver", value: null, mult: 0.01, tol: 10, hex: "#C0C0C0", text: "text-black" },
];

export default function ResistorColorTab() {
    const [bands, setBands] = useState<number>(4);
    const [band1, setBand1] = useState(colors[1]); // Brown
    const [band2, setBand2] = useState(colors[0]); // Black
    const [band3, setBand3] = useState(colors[0]); // Black (for 5 band)
    const [multiplier, setMultiplier] = useState(colors[2]); // Red (x100) -> 1k
    const [tolerance, setTolerance] = useState(colors[10]); // Gold (5%)

    const resistance = useMemo(() => {
        let base = 0;
        if (bands === 4) {
            base = (band1.value! * 10) + band2.value!;
        } else {
            base = (band1.value! * 100) + (band2.value! * 10) + band3.value!;
        }
        return base * multiplier.mult;
    }, [bands, band1, band2, band3, multiplier]);

    const formatRes = (r: number) => {
        if (r >= 1000000) return (r / 1000000) + " MΩ";
        if (r >= 1000) return (r / 1000) + " kΩ";
        return r.toFixed(2).replace(/\.00$/, '') + " Ω";
    };

    const ColorButton = ({ color, selected, onClick }: { color: any, selected: boolean, onClick: () => void }) => (
        <button
            onClick={onClick}
            className={`w-full h-8rounded flex items-center justify-center text-[10px] font-bold uppercase transition-transform active:scale-95 ${selected ? 'ring-2 ring-offset-2 ring-zinc-400 z-10 scale-105 rounded-md shadow-sm' : 'rounded-sm opacity-80 hover:opacity-100'}`}
            style={{ backgroundColor: color.hex, color: ['white', 'silver', 'yellow'].includes(color.name) ? 'black' : 'white' }}
        >
            {selected && "•"}
        </button>
    );

    return (
        <div className="space-y-8">
            {/* Toggle 4/5 Bands */}
            <div className="flex justify-center mb-8">
                <div className="bg-zinc-100 p-1 rounded-xl flex gap-1">
                    <button
                        onClick={() => setBands(4)}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${bands === 4 ? 'bg-white shadow-sm text-black' : 'text-zinc-400 hover:text-zinc-600'}`}
                    >
                        4本帯
                    </button>
                    <button
                        onClick={() => setBands(5)}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${bands === 5 ? 'bg-white shadow-sm text-black' : 'text-zinc-400 hover:text-zinc-600'}`}
                    >
                        5本帯
                    </button>
                </div>
            </div>

            {/* Visual Resistor */}
            <div className="relative h-40 flex items-center justify-center select-none">
                {/* Wire */}
                <div className="absolute w-[90%] h-2 bg-zinc-300 rounded-full"></div>
                {/* Body */}
                <div className="absolute w-[60%] h-24 bg-[#e8e4c9] rounded-full border-4 border-[#dcd8bd] shadow-inner flex items-center justify-center gap-4 md:gap-8 overflow-hidden z-10">

                    {/* Band 1 */}
                    <div className="w-4 md:w-6 h-full" style={{ backgroundColor: band1.hex }}></div>

                    {/* Band 2 */}
                    <div className="w-4 md:w-6 h-full" style={{ backgroundColor: band2.hex }}></div>

                    {/* Band 3 (5-band only) */}
                    {bands === 5 && (
                        <div className="w-4 md:w-6 h-full" style={{ backgroundColor: band3.hex }}></div>
                    )}

                    {/* Multiplier */}
                    <div className="w-4 md:w-6 h-full" style={{ backgroundColor: multiplier.hex }}></div>

                    {/* Gap for Tolerance */}
                    <div className="w-8"></div>

                    {/* Tolerance */}
                    <div className="w-4 md:w-6 h-full" style={{ backgroundColor: tolerance.hex }}></div>
                </div>

                {/* Value Display Overlay */}
                <div className="absolute -bottom-16 bg-zinc-900 text-white px-6 py-2 rounded-xl shadow-xl font-mono text-xl font-bold border border-zinc-700">
                    {formatRes(resistance)} <span className="text-zinc-400 text-sm">±{tolerance.tol}%</span>
                </div>
            </div>

            <div className="h-8"></div>

            {/* Color Pickers Grid */}
            <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                {/* Column 1 */}
                <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase block text-center mb-2">1本目</span>
                    {colors.filter(c => c.value !== null).map(c => (
                        <ColorButton key={c.name} color={c} selected={band1.name === c.name} onClick={() => setBand1(c)} />
                    ))}
                </div>

                {/* Column 2 */}
                <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase block text-center mb-2">2本目</span>
                    {colors.filter(c => c.value !== null).map(c => (
                        <ColorButton key={c.name} color={c} selected={band2.name === c.name} onClick={() => setBand2(c)} />
                    ))}
                </div>

                {/* Column 3 (Conditional) */}
                {bands === 5 && (
                    <div className="space-y-2">
                        <span className="text-xs font-bold text-zinc-400 uppercase block text-center mb-2">3本目</span>
                        {colors.filter(c => c.value !== null).map(c => (
                            <ColorButton key={c.name} color={c} selected={band3.name === c.name} onClick={() => setBand3(c)} />
                        ))}
                    </div>
                )}

                {/* Multiplier */}
                <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase block text-center mb-2">乗数</span>
                    {colors.map(c => (
                        <ColorButton key={c.name} color={c} selected={multiplier.name === c.name} onClick={() => setMultiplier(c)} />
                    ))}
                </div>

                {/* Tolerance */}
                <div className="space-y-2">
                    <span className="text-xs font-bold text-zinc-400 uppercase block text-center mb-2">許容差</span>
                    {colors.filter(c => c.tol !== null).map(c => (
                        <ColorButton key={c.name} color={c} selected={tolerance.name === c.name} onClick={() => setTolerance(c)} />
                    ))}
                </div>
            </div>
        </div>
    );
}
