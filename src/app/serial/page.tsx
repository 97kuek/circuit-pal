"use client";

import Link from "next/link";
import { ArrowLeft, Terminal, Unplug, Plug, Send, RefreshCw, AlertCircle, Cpu, Trash2 } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useSerial } from "@/lib/serial";

export default function SerialPage() {
    const { isSupported, isConnected, connect, disconnect, send, messages, clearMessages, baudRate, setBaud } = useSerial();
    const [input, setInput] = useState("");
    const endOfLogRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfLogRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const [history, setHistory] = useState<Array<{ type: 'received' | 'sent' | 'error', data: string, timestamp: Date }>>([]);
    const [autoScroll, setAutoScroll] = useState(true);
    const terminalRef = useRef<HTMLDivElement>(null);

    // Update history when messages change
    useEffect(() => {
        setHistory(messages.map(msg => ({
            type: msg.direction === 'tx' ? 'sent' : 'received',
            data: msg.text,
            timestamp: new Date(msg.timestamp)
        })));
    }, [messages]);

    // Auto-scroll to bottom of new terminal
    useEffect(() => {
        if (autoScroll && terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [history, autoScroll]);

    const handleNewSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        send(input);
        setInput("");
    };

    const clearHistory = () => {
        clearMessages();
        setHistory([]);
    };

    const setBaudRate = setBaud; // Alias for consistency with new code

    return (
        <div className="min-h-screen bg-zinc-50 bg-grid-pattern font-sans text-zinc-900 selection:bg-blue-100">
            <div className="max-w-7xl mx-auto p-4 md:p-12">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-blue-600 mb-8 transition-colors font-mono text-sm group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    ダッシュボード
                </Link>

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-200">
                            <Terminal className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight text-zinc-900">
                                Webシリアルモニタ <span className="text-zinc-400 font-mono text-xl font-normal">SERIAL</span>
                            </h1>
                            <p className="text-xs text-zinc-400 font-mono mt-1">Arduino / ESP32 と直接通信</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2 bg-white p-2 rounded-xl shadow-sm border border-zinc-200">
                        <select
                            value={baudRate}
                            onChange={(e) => setBaudRate(Number(e.target.value))}
                            disabled={isConnected}
                            className="bg-zinc-50 border border-zinc-200 text-zinc-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 font-mono disabled:opacity-50"
                        >
                            {[9600, 19200, 38400, 57600, 115200].map((rate) => (
                                <option key={rate} value={rate}>{rate} baud</option>
                            ))}
                        </select>

                        <button
                            onClick={isConnected ? disconnect : connect}
                            disabled={!isSupported}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${isConnected
                                ? "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-200"
                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-md shadow-blue-200"
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {isConnected ? (
                                <>
                                    <Unplug className="w-4 h-4" /> 切断
                                </>
                            ) : (
                                <>
                                    <Plug className="w-4 h-4" /> 接続
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {!isSupported && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 mb-8 flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <p className="text-sm font-bold">
                            お使いのブラウザはWeb Serial APIに対応していません。Chrome、Edge、OperaなどのChromium系ブラウザをご利用ください。
                        </p>
                    </div>
                )}

                {/* Terminal Area */}
                <div className="bg-[#1e1e1e] rounded-xl overflow-hidden shadow-2xl border border-zinc-800 flex flex-col h-[60vh]">
                    {/* Terminal Header */}
                    <div className="bg-[#2d2d2d] px-4 py-2 flex items-center justify-between border-b border-zinc-700">
                        <div className="flex items-center gap-2">
                            <div className="flex gap-1.5">
                                <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                                <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                            </div>
                            <span className="ml-3 text-xs text-zinc-400 font-mono">/dev/ttyUSB0 - {baudRate}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="autoScroll"
                                    checked={autoScroll}
                                    onChange={(e) => setAutoScroll(e.target.checked)}
                                    className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-blue-500 focus:ring-blue-500"
                                />
                                <label htmlFor="autoScroll" className="text-xs text-zinc-400 cursor-pointer select-none">自動スクロール</label>
                            </div>
                            <button
                                onClick={clearHistory}
                                className="text-zinc-400 hover:text-white transition-colors"
                                title="ログをクリア"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Output */}
                    <div
                        ref={terminalRef}
                        className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-1 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent"
                    >
                        {history.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-zinc-600 select-none">
                                <Cpu className="w-12 h-12 mb-4 opacity-20" />
                                <p>デバイスに接続して通信を開始...</p>
                            </div>
                        )}
                        {history.map((line, i) => (
                            <div key={i} className={`break-all ${line.type === 'sent' ? 'text-blue-400' :
                                line.type === 'error' ? 'text-red-400' :
                                    'text-emerald-400'
                                }`}>
                                <span className="opacity-30 mr-2 select-none">
                                    {line.timestamp.toLocaleTimeString()}
                                    {line.type === 'sent' ? ' >' : ' <'}
                                </span>
                                {line.data}
                            </div>
                        ))}
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleNewSend} className="bg-[#252526] p-4 border-t border-zinc-700 flex gap-2">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500 font-mono font-bold">{'>'}</span>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="コマンドを入力..."
                                disabled={!isConnected}
                                className="w-full bg-[#1e1e1e] text-white font-mono rounded-lg border border-zinc-700 py-2.5 pl-8 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder-zinc-600 disabled:opacity-50"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!isConnected || !input.trim()}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            送信
                        </button>
                    </form>
                </div>
            </div>
        </div>);
}
