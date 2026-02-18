import { useState, useEffect } from 'react';

export type InventoryCategory = 'resistors' | 'capacitors' | 'leds' | 'ics' | 'sensors' | 'boards' | 'misc';

export interface InventoryItem {
    id: string;
    name: string;
    category: InventoryCategory;
    quantity: number;
    value?: string; // e.g. "10k", "100nF"
    location?: string; // e.g. "Box A", "Drawer 2"
    notes?: string;
    lastUpdated: number;
}

const STORAGE_KEY = 'circuit-pal-inventory-v1';

export function useInventory() {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from local storage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setItems(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load inventory:", e);
        }
        setIsLoaded(true);
    }, []);

    // Save to local storage whenever items change
    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        }
    }, [items, isLoaded]);

    const addItem = (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
        const newItem: InventoryItem = {
            ...item,
            id: crypto.randomUUID(),
            lastUpdated: Date.now(),
        };
        setItems(prev => [newItem, ...prev]);
    };

    const updateItem = (id: string, updates: Partial<Omit<InventoryItem, 'id'>>) => {
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates, lastUpdated: Date.now() } : item
        ));
    };

    const deleteItem = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const exportItems = () => {
        const data = JSON.stringify(items, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `circuit-pal-inventory-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const importItems = (file: File): Promise<number> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target?.result as string);
                    if (!Array.isArray(data)) {
                        reject(new Error('無効なファイル形式です'));
                        return;
                    }
                    const validItems: InventoryItem[] = data.filter(
                        (item: any) => item.name && item.category && typeof item.quantity === 'number'
                    ).map((item: any) => ({
                        ...item,
                        id: item.id || crypto.randomUUID(),
                        lastUpdated: item.lastUpdated || Date.now(),
                    }));
                    setItems(prev => [...validItems, ...prev]);
                    resolve(validItems.length);
                } catch {
                    reject(new Error('JSONの解析に失敗しました'));
                }
            };
            reader.readAsText(file);
        });
    };

    const clearAll = () => {
        setItems([]);
    };

    return { items, addItem, updateItem, deleteItem, exportItems, importItems, clearAll, isLoaded };
}

export const CATEGORY_LABELS: Record<InventoryCategory, string> = {
    resistors: "抵抗器",
    capacitors: "コンデンサ",
    leds: "LED",
    ics: "IC / チップ",
    sensors: "センサー",
    boards: "基板 / モジュール",
    misc: "その他"
};
