import {MoonIcon, SunIcon} from 'lucide-react'
import {setThemePreference, useThemePreference} from '@/components/common/theme/themePreference'

const ThemeToggle = () => {
    useThemePreference();

    const theme = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    const next = theme === 'dark' ? 'light' : 'dark';
    const Icon = next === 'dark' ? MoonIcon : SunIcon;

    return (
        <button
            type="button"
            onClick={() => setThemePreference(next)}
            className="fixed right-4 bottom-4 z-50 flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-gray-50 px-3 py-1 text-sm text-gray-800"
        >
            <Icon size={16} aria-hidden="true"/>
            {next === 'dark' ? 'Tema scuro' : 'Tema chiaro'}
        </button>
    );
};
export default ThemeToggle;
