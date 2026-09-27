import { useEffect } from 'react';

/**
 * Custom hook for keyboard shortcuts.
 *
 * @param {string} key - The key to listen for (e.g., 'Escape', 'n')
 * @param {Function} callback - Function to call when the key is pressed
 * @param {Object} options
 * @param {boolean} options.ctrl - Require Ctrl/Cmd key
 * @param {boolean} options.shift - Require Shift key
 * @param {boolean} options.enabled - Whether the shortcut is active (default: true)
 */
export default function useKeyboardShortcut(key, callback, options = {}) {
  const { ctrl = false, shift = false, enabled = true } = options;

  useEffect(() => {
    if (!enabled) return;

    const handler = (e) => {
      const ctrlMatch = ctrl ? (e.ctrlKey || e.metaKey) : true;
      const shiftMatch = shift ? e.shiftKey : true;

      if (e.key === key && ctrlMatch && shiftMatch) {
        // Don't trigger if user is typing in an input/textarea
        const tag = e.target.tagName.toLowerCase();
        if (!ctrl && !shift && (tag === 'input' || tag === 'textarea')) return;

        e.preventDefault();
        callback(e);
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key, callback, ctrl, shift, enabled]);
}
