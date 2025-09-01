import { useEffect } from "react";

/**
 * Global keyboard shortcuts.
 * Ctrl+N   – open quick-actions FAB menu
 * /        – focus search input (elements tagged with [data-hotkey-search])
 */
export function useHotkeys() {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore when user is typing in input/textarea/select
      const tag = (e.target as HTMLElement).tagName;
      const editable = ["INPUT", "TEXTAREA", "SELECT"].includes(tag) || (e.target as HTMLElement).isContentEditable;
      if (editable) return;

      // Ctrl+N → quick actions
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        window.dispatchEvent(new Event("open-quick-actions"));
        return;
      }

      // / → focus search
      if (e.key === "/") {
        const el = document.querySelector<HTMLInputElement>("input[data-hotkey-search]");
        if (el) {
          e.preventDefault();
          el.focus();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
