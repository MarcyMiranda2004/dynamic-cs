import SegmentControl, {type SegmentOption} from "@/components/common/elements/SegmentControl";
import {setThemePreference, useThemePreference, type ThemePreference} from "@/components/common/theme/themePreference";
import {MonitorIcon, MoonIcon, SunIcon} from "lucide-react";

const THEME_OPTIONS: SegmentOption<ThemePreference>[] = [
    {value: "light", label: "Chiaro", icon: <SunIcon size={16} />},
    {value: "dark", label: "Scuro", icon: <MoonIcon size={16} />},
    {value: "system", label: "Sistema", icon: <MonitorIcon size={16} />},
];

const SettingsPage = () => {
    const theme = useThemePreference();

    return (
        <div className="dcs-container text-left">
            <h1 className="text-2xl font-semibold">Impostazioni</h1>

            <section className="mt-8 flex flex-col gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-(--text)/60">Aspetto</h2>

                <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-(--text)/10 p-4">
                    <div className="flex flex-col">
                        <span className="font-semibold">Tema</span>
                        <span className="text-sm text-(--text)/60">Scegli se usare il tema chiaro, quello scuro o quello del sistema</span>
                    </div>

                    <SegmentControl label="Tema" options={THEME_OPTIONS} value={theme} onChange={setThemePreference} />
                </div>
            </section>
        </div>
    );
};
export default SettingsPage;
