import {useEffect, useState} from 'react'
import {MoonIcon, SunIcon} from 'lucide-react'

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

const ThemeToggle = () => {
    const [theme, setTheme] = useState<Theme>(() =>
        document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
    )

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        try {
            localStorage.setItem(STORAGE_KEY, theme);
        } catch {
            // storage non disponibile: il tema resta valido per la sessione
        }
    }, [theme]);

    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    const Icon = next === 'dark' ? MoonIcon : SunIcon;

    return (
        <button
            type="button"
            onClick={() => setTheme(next)}
            className="fixed right-4 bottom-4 z-50 flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-3 py-1 text-sm text-gray-800"
        >
            <Icon size={16} aria-hidden="true"/>
            {next === 'dark' ? 'Tema scuro' : 'Tema chiaro'}
        </button>
    );
};
export default ThemeToggle;
