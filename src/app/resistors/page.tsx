"use client";

import Link from "next/link";
import { ArrowLeft, Zap, Layers, Calculator, Lightbulb } from "lucide-react";
import { useState } from "react";
import ResistorColorTab from "./ResistorColorTab";
import SMDDecoderTab from "./SMDDecoderTab";
import LEDCalculatorTab from "./LEDCalculatorTab";

export default function ResistorsPage() {
    const [activeTab, setActiveTab] = useState<'color' | 'smd' | 'led'>('color');

    return (
        <div className="min-h-screen bg-zinc-50 bg-grid-pattern font-sans text-zinc-900 selection:bg-purple-100">
            <div className="max-w-7xl mx-auto p-4 md:p-12">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-purple-600 mb-8 transition-colors font-mono text-sm group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    ダッシュボード
                </Link>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-200">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-zinc-900">
                                抵抗ツールキット <span className="text-zinc-400 font-mono text-xl font-normal">RESISTORS</span>
                            </h1>
                            <p className="text-xs text-zinc-400 font-mono mt-1">カラーコード / SMD / LED計算 を統合</p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex p-1 bg-white border border-zinc-200 rounded-xl w-full md:w-fit mb-8 shadow-sm overflow-x-auto">
                    <button
                        onClick={() => setActiveTab('color')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'color'
                            ? "bg-zinc-900 text-white shadow-md"
                            : "text-zinc-500 hover:bg-zinc-50"
                            }`}
                    >
                        <Layers className="w-4 h-4" /> カラーコード
                    </button>
                    <button
                        onClick={() => setActiveTab('smd')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'smd'
                            ? "bg-zinc-900 text-white shadow-md"
                            : "text-zinc-500 hover:bg-zinc-50"
                            }`}
                    >
                        <Calculator className="w-4 h-4" /> SMDコード
                    </button>
                    <button
                        onClick={() => setActiveTab('led')}
                        className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap transition-all ${activeTab === 'led'
                            ? "bg-zinc-900 text-white shadow-md"
                            : "text-zinc-500 hover:bg-zinc-50"
                            }`}
                    >
                        <Lightbulb className="w-4 h-4" /> LED抵抗計算
                    </button>
                </div>

                {/* Tab Content */}
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                    {activeTab === 'color' && <ResistorColorTab />}
                    {activeTab === 'smd' && <SMDDecoderTab />}
                    {activeTab === 'led' && <LEDCalculatorTab />}
                </div>

            </div>
        </div>
    );
}
