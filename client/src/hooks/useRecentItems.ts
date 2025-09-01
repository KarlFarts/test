import { useEffect, useState, useCallback } from "react";

export interface RecentItem {
  label: string;
  href: string;
  type?: string; // e.g., "person", "event"
}

const STORAGE_KEY = "recent-items";
const MAX_ITEMS = 10;

export function useRecentItems() {
  const [items, setItems] = useState<RecentItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as RecentItem[]) : [];
    } catch {
      return [];
    }
  });

  // persist when items change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback(
    (item: RecentItem) => {
      setItems((prev) => {
        const filtered = prev.filter((i) => i.href !== item.href);
        return [item, ...filtered].slice(0, MAX_ITEMS);
      });
    },
    [setItems]
  );

  const clearItems = useCallback(() => setItems([]), []);

  return { items, addItem, clearItems };
}
