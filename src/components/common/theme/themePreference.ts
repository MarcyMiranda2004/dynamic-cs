import {useSyncExternalStore} from "react";

export type ThemePreference = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme';
const systemQuery = window.matchMedia('(prefers-color-scheme: dark)');
const listeners = new Set<() => void>();

const readPreference = (): ThemePreference => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        return stored === 'light' || stored === 'dark' ? stored : 'system';
    } catch {
        return 'system';
    }
};

const writePreference = (preference: ThemePreference) => {
    try {
        if (preference === 'system') localStorage.removeItem(STORAGE_KEY);
        else localStorage.setItem(STORAGE_KEY, preference);
    } catch {
        return;
    }
};

const applyPreference = (preference: ThemePreference) => {
    const resolved = preference === 'system' ? (systemQuery.matches ? 'dark' : 'light') : preference;
    document.documentElement.dataset.theme = resolved;
};

systemQuery.addEventListener('change', () => {
    if (readPreference() !== 'system') return;
    applyPreference('system');
    listeners.forEach((listener) => listener());
});

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

export const setThemePreference = (preference: ThemePreference) => {
    writePreference(preference);
    applyPreference(preference);
    listeners.forEach((listener) => listener());
};

export const useThemePreference = (): ThemePreference =>
    useSyncExternalStore(subscribe, readPreference, (): ThemePreference => 'system');
