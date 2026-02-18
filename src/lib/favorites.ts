import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'circuit-pal-favorites-v1';

export function useFavorites() {
    const [favorites, setFavorites] = useState<string[]>([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem(FAVORITES_KEY);
            if (stored) {
                setFavorites(JSON.parse(stored));
            }
        } catch (e) {
            console.error("Failed to load favorites", e);
        }
    }, []);

    const toggleFavorite = (id: string) => {
        setFavorites(prev => {
            let updated;
            if (prev.includes(id)) {
                updated = prev.filter(f => f !== id);
            } else {
                updated = [...prev, id];
            }
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
            return updated;
        });
    };

    const isFavorite = (id: string) => {
        return favorites.includes(id);
    };

    return { favorites, toggleFavorite, isFavorite };
}
