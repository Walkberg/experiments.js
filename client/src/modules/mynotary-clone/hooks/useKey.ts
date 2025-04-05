import { useEffect } from "react";

export function useKey(keys: string[], callback: () => void) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = false;

      const isShortcutPressed = isMac
        ? e.metaKey && keys.every((key) => e.key === key)
        : e.ctrlKey && keys.every((key) => e.key === key);

      if (isShortcutPressed) {
        e.preventDefault();
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
}
