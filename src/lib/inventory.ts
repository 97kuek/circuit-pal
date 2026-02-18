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

    return { items, addItem, updateItem, deleteItem, isLoaded };
}

export const CATEGORY_LABELS: Record<InventoryCategory, string> = {
    resistors: "Resistors",
    capacitors: "Capacitors",
    leds: "LEDs",
    ics: "ICs / Chips",
    sensors: "Sensors",
    boards: "Boards",
    misc: "Misc / Other"
};
