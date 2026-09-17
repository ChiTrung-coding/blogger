import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

/**
 * ThemeToggle — button to switch between dark and light mode.
 * Shows Moon icon in light mode (click → switch to dark).
 * Shows Sun icon in dark mode (click → switch to light).
 */
export default function ThemeToggle() {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? 'Chuyển sang chế độ sáng' : 'Chuyển sang chế độ tối'}
      className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100
                 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800
                 transition-colors duration-200"
    >
      {isDark ? (
        <Sun size={20} aria-hidden="true" />
      ) : (
        <Moon size={20} aria-hidden="true" />
      )}
    </button>
  );
}
