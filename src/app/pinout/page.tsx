"use client";

import Link from "next/link";
import { ArrowLeft, Cpu, Zap, Wifi, Activity, Settings, Box, Info } from "lucide-react";
import { useState } from "react";
import { ARDUINO_UNO, ESP32_DEVKIT_V1, PinData } from "@/lib/board-data";

export default function PinoutPage() {
    const [selectedBoardId, setSelectedBoardId] = useState("arduino-uno");
    const [filterType, setFilterType] = useState<string | null>(null);
    const [hoveredPin, setHoveredPin] = useState<PinData | null>(null);

    const board = selectedBoardId === "esp32" ? ESP32_DEVKIT_V1 : ARDUINO_UNO;
    const selectedBoard = board;

    // Standardized Pin Types for filtering and coloring
    const pinTypes = [
        { id: "power", label: "電源", color: "bg-red-500", icon: Zap },
        { id: "gnd", label: "GND", color: "bg-black", icon: Activity },
        { id: "gpio", label: "入出力", color: "bg-green-500", icon: Box },
        { id: "adc", label: "アナログ", color: "bg-blue-500", icon: Activity },
        { id: "communication", label: "通信", color: "bg-purple-500", icon: Wifi },
        { id: "control", label: "制御", color: "bg-orange-500", icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-zinc-50 bg-grid-pattern font-sans text-zinc-900 selection:bg-teal-100">
            <div className="max-w-7xl mx-auto p-4 md:p-12">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-teal-600 mb-8 transition-colors font-mono text-sm group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    ダッシュボード
                </Link>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-teal-600 rounded-xl text-white shadow-lg shadow-teal-200">
                            <Cpu className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-zinc-900">
                                ピン配置リファレンス <span className="text-zinc-400 font-mono text-xl font-normal">PINOUT</span>
                            </h1>
                            <p className="text-xs text-zinc-400 font-mono mt-1">Arduino Uno / ESP32 対応</p>
                        </div>
                    </div>

                    {/* Board Selector */}
                    <div className="flex overflow-x-auto gap-2 pb-2 md:pb-0">
                        {[{ id: "arduino-uno", name: "Arduino Uno" }, { id: "esp32", name: "ESP32 DevKit V1" }].map(b => (
                            <button
                                key={b.id}
                                onClick={() => setSelectedBoardId(b.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${selectedBoardId === b.id
                                    ? "bg-zinc-900 text-white shadow-md"
                                    : "bg-white text-zinc-500 hover:bg-zinc-100 border border-zinc-200"
                                    }`}
                            >
                                {b.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Left Column: Visual & Controls */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Visualizer Card */}
                        <div className="bg-white rounded-3xl shadow-sm border border-zinc-200 p-8 md:p-12 relative overflow-hidden group">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 p-32 bg-teal-500/5 rounded-full blur-3xl pointer-events-none"></div>

                            {/* Board Representation */}
                            <div className="relative max-w-md mx-auto aspect-[3/5] bg-zinc-900 rounded-xl shadow-2xl border-2 border-zinc-800 flex flex-col items-center py-6 px-2">
                                {/* USB Port */}
                                <div className="w-16 h-10 bg-zinc-400 rounded-sm mb-4 border border-zinc-500 relative">
                                    <div className="absolute inset-x-2 top-0 h-4 bg-zinc-300/20"></div>
                                </div>
                                {/* Main Chip */}
                                <div className="w-24 h-24 bg-zinc-800 rounded mb-8 border border-zinc-700 flex items-center justify-center relative">
                                    <Cpu className="w-12 h-12 text-zinc-600" />
                                    <div className="absolute bottom-1 right-1 text-[6px] font-mono text-zinc-500">
                                        {selectedBoardId === "arduino-uno" ? "ATMEGA328P" : "ESP-WROOM-32"}
                                    </div>
                                </div>

                                {/* Pins Container */}
                                <div className="w-full flex justify-between px-1 h-full">
                                    {/* Left Pins */}
                                    <div className="flex flex-col justify-between h-full py-2">
                                        {selectedBoard.pins.slice(0, selectedBoard.pins.length / 2).map((pin) => {
                                            const isDimmed = filterType && !pin.functions.includes(filterType as any);
                                            return (
                                                <div
                                                    key={pin.name}
                                                    onMouseEnter={() => setHoveredPin(pin)}
                                                    onMouseLeave={() => setHoveredPin(null)}
                                                    className={`relative group/pin flex items-center mb-1 ${isDimmed ? 'opacity-20 blur-[0.5px]' : 'opacity-100'}`}
                                                >
                                                    <div className="absolute right-full mr-3 text-[10px] font-mono font-bold text-zinc-400 whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity">
                                                        {pin.name}
                                                    </div>
                                                    <div className={`w-3 h-3 rounded-full border border-zinc-500 bg-zinc-800 ${hoveredPin?.name === pin.name ? 'bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)] border-teal-400' : ''} transition-all cursor-pointer`}></div>
                                                    <div className="w-2 h-[1px] bg-zinc-700"></div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Center Label */}
                                    <div className="flex flex-col justify-center items-center text-zinc-700 font-mono text-xs font-bold opacity-50 space-y-12 pointer-events-none select-none">
                                        <div className="tracking-widest rotate-90 w-4">{selectedBoardId === "arduino-uno" ? "IO" : "WIFI"}</div>
                                        <div className="tracking-widest rotate-90 w-4">{selectedBoardId === "arduino-uno" ? "ADC" : "BT"}</div>
                                    </div>

                                    {/* Right Pins */}
                                    <div className="flex flex-col justify-between h-full py-2">
                                        {selectedBoard.pins.slice(selectedBoard.pins.length / 2).map((pin) => {
                                            const isDimmed = filterType && !pin.functions.includes(filterType as any);
                                            return (
                                                <div
                                                    key={pin.name}
                                                    onMouseEnter={() => setHoveredPin(pin)}
                                                    onMouseLeave={() => setHoveredPin(null)}
                                                    className={`relative group/pin flex items-center justify-end mb-1 ${isDimmed ? 'opacity-20 blur-[0.5px]' : 'opacity-100'}`}
                                                >
                                                    <div className="w-2 h-[1px] bg-zinc-700"></div>
                                                    <div className={`w-3 h-3 rounded-full border border-zinc-500 bg-zinc-800 ${hoveredPin?.name === pin.name ? 'bg-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.5)] border-teal-400' : ''} transition-all cursor-pointer`}></div>
                                                    <div className="absolute left-full ml-3 text-[10px] font-mono font-bold text-zinc-400 whitespace-nowrap opacity-0 group-hover/pin:opacity-100 transition-opacity">
                                                        {pin.name}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm">
                            <h3 className="text-xs font-bold text-zinc-400 uppercase mb-4 tracking-wider">機能でハイライト</h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => setFilterType(null)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${!filterType
                                        ? "bg-zinc-800 text-white border-zinc-800"
                                        : "bg-zinc-50 text-zinc-500 border-zinc-200 hover:border-zinc-300"
                                        }`}
                                >
                                    全て表示
                                </button>
                                {pinTypes.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => setFilterType(filterType === type.id ? null : type.id)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${filterType === type.id
                                            ? "bg-zinc-800 text-white border-zinc-800"
                                            : "bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300"
                                            }`}
                                    >
                                        <span className={`w-2 h-2 rounded-full ${type.color}`}></span>
                                        {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Info Panel */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-200 sticky top-6 min-h-[300px]">
                            {hoveredPin ? (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-xs font-mono text-zinc-400 font-bold">PIN {hoveredPin.pin}</span>
                                        {/* Determine main type for color */}
                                        <span className={`w-2 h-2 rounded-full ${pinTypes.find(t => hoveredPin.functions.includes(t.id as any))?.color || 'bg-zinc-400'
                                            }`}></span>
                                    </div>
                                    <h2 className="text-3xl font-black text-zinc-900 mb-1">{hoveredPin.name}</h2>
                                    <p className="text-sm font-medium text-zinc-500 mb-6">{hoveredPin.description || "詳細情報はありません"}</p>

                                    <div className="space-y-3">
                                        <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-widest border-b border-zinc-100 pb-2">機能リスト</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {hoveredPin.functions.map(t => (
                                                <span key={t} className="px-2 py-1 bg-zinc-100 text-zinc-600 rounded text-[10px] font-bold uppercase border border-zinc-200">
                                                    {pinTypes.find(pt => pt.id === t)?.label || t}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                                    <Box className="w-12 h-12 text-zinc-300 mb-4" />
                                    <h3 className="text-lg font-bold text-zinc-400">ピンを選択</h3>
                                    <p className="text-xs text-zinc-400 mt-2">ボード上のピンにカーソルを合わせると<br />詳細が表示されます。</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
