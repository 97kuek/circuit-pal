"use client";

import Link from "next/link";
import { ArrowLeft, Cpu, Zap, Wifi, Activity } from "lucide-react";
import { useState } from "react";
import { ARDUINO_UNO, ESP32_DEVKIT_V1, PinData } from "@/lib/board-data";

const FUNCTION_COLORS: Record<string, string> = {
    power: "bg-red-500 shadow-red-500/50",
    gnd: "bg-zinc-900 shadow-white/10",
    digital: "bg-emerald-400 shadow-emerald-400/50",
    analog: "bg-blue-400 shadow-blue-400/50",
    pwm: "bg-yellow-400 shadow-yellow-400/50",
    i2c: "bg-cyan-400 shadow-cyan-400/50",
    spi: "bg-purple-400 shadow-purple-400/50",
    uart: "bg-orange-400 shadow-orange-400/50",
    none: "bg-zinc-700",
};

export default function PinoutPage() {
    const [selectedBoardId, setSelectedBoardId] = useState("arduino-uno");
    const [filter, setFilter] = useState<string | null>(null);

    const board = selectedBoardId === "esp32" ? ESP32_DEVKIT_V1 : ARDUINO_UNO;

    const leftPins = board.pins.filter((p) => p.side === "left");
    const rightPins = board.pins.filter((p) => p.side === "right");

    const PinComponent = ({ pin, side }: { pin: PinData, side: "left" | "right" }) => {
        const isDimmed = filter && !pin.functions.includes(filter as any) && filter !== "all";

        let colorClass = "bg-zinc-800";
        let glowClass = "";

        // Priority coloring
        const activeFunc = pin.functions.find(f => filter === f) ||
            (pin.functions.includes("power") ? "power" :
                pin.functions.includes("gnd") ? "gnd" :
                    pin.functions[0]);

        if (activeFunc && FUNCTION_COLORS[activeFunc]) {
            colorClass = FUNCTION_COLORS[activeFunc];
            // Stronger glow if filtered
            glowClass = filter === activeFunc ? "shadow-[0_0_15px_rgba(255,255,255,0.8)] scale-110 z-20" : "";
        }

        return (
            <div className={`group relative flex items-center h-8 my-0.5 ${isDimmed ? "opacity-10 blur-[1px]" : "opacity-100"} transition-all duration-300`}>
                {/* Label Left side */}
                {side === "left" && (
                    <div className="mr-3 text-right flex-1 min-w-[80px]">
                        <div className={`font-mono text-xs font-bold transition-colors ${isDimmed ? "text-zinc-600" : "text-zinc-300 group-hover:text-white"}`}>
                            {pin.name}
                        </div>
                        {pin.description && <div className="text-[9px] text-zinc-500 uppercase tracking-tighter truncate max-w-[100px] ml-auto">{pin.description}</div>}
                    </div>
                )}

                {/* Pin Visual */}
                <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full border border-zinc-900/50 ${colorClass} ${glowClass} relative z-10 mx-1 flex-shrink-0 transition-all duration-300`}>
                    {/* Pin metallic core */}
                    <div className="absolute inset-[2px] rounded-full bg-white/20"></div>
                </div>

                {/* Trace Line */}
                <div className={`absolute top-1/2 h-[1px] bg-zinc-800 -z-10 w-8 transition-all duration-500
            ${side === "left" ? "right-[-16px] group-hover:bg-zinc-500 group-hover:w-16" : "left-[-16px] group-hover:bg-zinc-500 group-hover:w-16"}
        `}></div>

                {/* Tooltip on Hover */}
                <div className={`absolute bottom-full mb-2 hidden group-hover:block min-w-[140px] bg-zinc-950/90 text-white text-xs rounded-xl border border-zinc-700/50 p-3 z-50 pointer-events-none backdrop-blur-md shadow-2xl transition-all
             ${side === "left" ? "left-0 origin-bottom-left" : "right-0 origin-bottom-right"}
        `}>
                    <div className="font-bold border-b border-zinc-800 mb-2 pb-1 text-zinc-300 font-mono tracking-widest">{pin.name}</div>
                    <div className="flex flex-wrap gap-1.5">
                        {pin.functions.map(f => (
                            <span key={f} className={`px-1.5 py-0.5 rounded text-[9px] text-zinc-950 font-black uppercase tracking-wider shadow-sm ${FUNCTION_COLORS[f]?.split(' ')[0] || "bg-zinc-600"}`}>
                                {f}
                            </span>
                        ))}
                    </div>
                    {pin.description && <div className="mt-2 text-zinc-400 font-mono text-[9px] border-t border-zinc-800 pt-1">{pin.description}</div>}
                </div>

                {/* Label Right side */}
                {side === "right" && (
                    <div className="ml-3 text-left flex-1 min-w-[80px]">
                        <div className={`font-mono text-xs font-bold transition-colors ${isDimmed ? "text-zinc-600" : "text-zinc-300 group-hover:text-white"}`}>
                            {pin.name}
                        </div>
                        {pin.description && <div className="text-[9px] text-zinc-500 uppercase tracking-tighter truncate max-w-[100px]">{pin.description}</div>}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-zinc-950 font-sans text-zinc-100 selection:bg-purple-500/30">

            {/* Background Grid - Dark Mode Special */}
            <div className="fixed inset-0 pointer-events-none opacity-20"
                style={{ backgroundImage: 'radial-gradient(circle, #333 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            <div className="max-w-7xl mx-auto p-4 md:p-8 relative z-10">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white mb-8 transition-colors font-mono text-sm group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    DASHBOARD
                </Link>

                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400 shadow-lg shadow-purple-900/20">
                            <Cpu className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-white uppercase">
                                Pinout <span className="text-zinc-600 font-mono text-xl font-normal">Viewer.io</span>
                            </h1>
                            <p className="text-zinc-500 text-xs font-mono tracking-widest mt-1">INTERACTIVE HARDWARE REFERENCE</p>
                        </div>
                    </div>

                    {/* Board Selector - Top Right */}
                    <div className="flex bg-zinc-900 rounded-lg p-1 border border-zinc-800">
                        <button
                            onClick={() => setSelectedBoardId("arduino-uno")}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all uppercase tracking-wider ${selectedBoardId === "arduino-uno"
                                    ? "bg-zinc-800 text-white shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            Arduino Uno
                        </button>
                        <button
                            onClick={() => setSelectedBoardId("esp32")}
                            className={`px-4 py-2 rounded-md text-xs font-bold transition-all uppercase tracking-wider ${selectedBoardId === "esp32"
                                    ? "bg-zinc-800 text-white shadow-sm"
                                    : "text-zinc-500 hover:text-zinc-300"
                                }`}
                        >
                            ESP32
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar Controls (Filters) */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-zinc-900/50 backdrop-blur-xl p-4 rounded-2xl border border-zinc-800 shadow-xl">
                            <div className="flex justify-between items-center mb-4">
                                <label className="text-[10px] font-bold text-zinc-500 font-mono uppercase tracking-wider">
                                    Signal Layers
                                </label>
                                {filter && (
                                    <button onClick={() => setFilter(null)} className="text-[10px] font-bold text-red-400 hover:text-red-300 uppercase">Clear</button>
                                )}
                            </div>
                            <div className="space-y-2">
                                {Object.keys(FUNCTION_COLORS).filter(k => k !== 'none').map(f => (
                                    <button
                                        key={f}
                                        onClick={() => setFilter(f === filter ? null : f)}
                                        className={`w-full flex items-center p-2 rounded-lg transition-all border text-[10px] font-mono uppercase tracking-wider ${filter === f
                                                ? "bg-zinc-800 border-zinc-600 text-white"
                                                : "bg-transparent border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                                            }`}
                                    >
                                        <div className={`w-2 h-2 rounded-full mr-3 shadow-[0_0_8px_currentColor] ${FUNCTION_COLORS[f].split(' ')[0]}`}></div>
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/50 text-center">
                            <Activity className="w-8 h-8 text-zinc-700 mx-auto mb-2 opacity-50" />
                            <p className="text-[10px] text-zinc-600 font-mono">
                                Hover over pins to inspect detailed signal capabilities.
                            </p>
                        </div>
                    </div>

                    {/* Board Visual - Main Stage */}
                    <div className="lg:col-span-10">
                        <div className="bg-[#0a0a0a] rounded-3xl border border-zinc-800 shadow-2xl relative flex justify-center items-center py-20 px-8 min-h-[600px] overflow-hidden">

                            {/* Decorative Background Elements */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                            <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-purple-500/20 to-transparent"></div>

                            <div className="relative z-10 transform transition-all duration-700 ease-out">
                                {/* Board PCB Container */}
                                <div className={`relative rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-0 min-w-[340px] lg:min-w-[420px] flex justify-between gap-24 transition-colors duration-500 border-none`}>

                                    {/* The PCB itself */}
                                    <div className={`absolute inset-0 rounded-lg opacity-90 border border-t-[0.5px] border-white/10 ${selectedBoardId === "arduino-uno"
                                            ? "bg-[#004e6b] shadow-[0_0_100px_rgba(0,100,200,0.2)]"
                                            : "bg-[#18181b] shadow-[0_0_100px_rgba(100,0,200,0.1)]"
                                        }`}></div>

                                    {/* Screw Holes */}
                                    <div className="absolute top-2 left-2 w-4 h-4 rounded-full bg-[#0a0a0a] border-2 border-[#333] shadow-inner z-20"></div>
                                    <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-[#0a0a0a] border-2 border-[#333] shadow-inner z-20"></div>
                                    <div className="absolute bottom-2 left-2 w-4 h-4 rounded-full bg-[#0a0a0a] border-2 border-[#333] shadow-inner z-20"></div>

                                    {/* USB Connector */}
                                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-20 h-8 bg-[#b0b0b0] rounded-sm border-t border-white/50 shadow-lg z-0"></div>

                                    {/* Left Pin Headers */}
                                    <div className="relative z-20 flex flex-col justify-center py-10 pl-1">
                                        {leftPins.map((pin, i) => (
                                            <PinComponent key={`${pin.name}-${i}`} pin={pin} side="left" />
                                        ))}
                                    </div>

                                    {/* Center Chip Area */}
                                    <div className="relative z-10 flex-grow flex flex-col items-center justify-center pointer-events-none">
                                        {/* MCU */}
                                        <div className="w-24 h-24 bg-[#111] rounded-sm border border-zinc-700 shadow-xl flex items-center justify-center transform rotate-45 mb-8 group">
                                            <div className="text-[9px] text-zinc-500 font-mono -rotate-45 group-hover:text-purple-400 transition-colors">
                                                {selectedBoardId === "arduino-uno" ? "ATMEGA328P" : "ESP-WROOM-32"}
                                            </div>
                                            {/* Chip Pins */}
                                            <div className="absolute -inset-1 border border-zinc-800/50 rounded-sm"></div>
                                        </div>

                                        {/* Branding */}
                                        <div className="text-center opacity-80 mix-blend-overlay">
                                            <div className="text-white font-black tracking-[0.2em] text-2xl font-mono uppercase truncate max-w-[150px]">
                                                {selectedBoardId === "arduino-uno" ? "ARDUINO" : "ESP32"}
                                            </div>
                                            <div className="text-white/60 font-bold tracking-[0.3em] text-xs font-mono uppercase mt-1">
                                                {selectedBoardId === "arduino-uno" ? "UNO R3" : "DEVKIT V1"}
                                            </div>
                                        </div>

                                        {/* Status LEDs */}
                                        <div className="flex gap-2 mt-8">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_#22c55e] animate-pulse"></div>
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500/20"></div>
                                        </div>
                                    </div>

                                    {/* Right Pin Headers */}
                                    <div className="relative z-20 flex flex-col justify-center py-10 pr-1">
                                        {rightPins.map((pin, i) => (
                                            <PinComponent key={`${pin.name}-${i}`} pin={pin} side="right" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
