import { HistoryItem } from "@/lib/history";
import { Clock, Trash2, History } from "lucide-react";

interface HistoryPanelProps {
    history: HistoryItem[];
    onClear: () => void;
    onRestore: (item: HistoryItem) => void;
}

export default function HistoryPanel({ history, onClear, onRestore }: HistoryPanelProps) {
    if (history.length === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 shadow-sm overflow-hidden h-fit">
            <div className="px-6 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
                    <History className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">計算履歴</h3>
                </div>
                <button
                    onClick={onClear}
                    className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="履歴を削除"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800 max-h-[300px] overflow-y-auto">
                {history.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onRestore(item)}
                        className="w-full text-left px-6 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors group"
                    >
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-mono text-zinc-400">
                                {new Date(item.timestamp).toLocaleTimeString()}
                            </span>
                        </div>
                        <p className="text-sm font-bold text-zinc-700 dark:text-zinc-300 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.summary}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    );
}
