import { useState, useEffect } from 'react';

export interface HistoryItem {
    id: string;
    timestamp: number;
    tool: string;
    data: any; // specific to each tool
    summary: string; // readable summary
}

const HISTORY_KEY = 'circuit-pal-history-v1';
const MAX_HISTORY = 20;

export function useHistory(toolName: string) {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(HISTORY_KEY);
            if (stored) {
                const allHistory: HistoryItem[] = JSON.parse(stored);
                // Filter for this tool? Or show all? Usually we show all or filter.
                // Let's filter for this tool instance, but maybe we want a global history viewer later.
                // For now, let's just manage the global list in state but provide filtered access if needed.
                setHistory(allHistory);
            }
        } catch (e) {
            console.error("Failed to load history", e);
        }
    }, []);

    const addHistory = (summary: string, data: any) => {
        const newItem: HistoryItem = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            tool: toolName,
            summary,
            data
        };

        setHistory(prev => {
            const updated = [newItem, ...prev].slice(0, MAX_HISTORY);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const clearHistory = () => {
        setHistory(prev => {
            const remaining = prev.filter(h => h.tool !== toolName);
            localStorage.setItem(HISTORY_KEY, JSON.stringify(remaining));
            return remaining;
        });
    };

    // Return history filtered by tool, but we might want to see mixed history?
    // Let's return just this tool's history for the tool page context.
    const toolHistory = history.filter(h => h.tool === toolName);

    return { history: toolHistory, addHistory, clearHistory };
}
