import {useCallback, useMemo, useState} from "react";
import {SheetContext, type SheetUpdater} from "./SheetContext";
import {createEmptySheet, withDerivedSkills, type Sheet} from "./sheetState";
import SheetHeader from "./components/SheetHeader";
import SkillsPanel from "./components/SkillsPanel";
import InventoryPanel from "./components/InventoryPanel";
import BackgroundPanel from "./components/BackgroundPanel";
import AppearancePanel from "./components/AppearancePanel";
import CyberwarePanel from "./components/CyberwarePanel";
import NetrunnerPanel from "./components/NetrunnerPanel";

type TabKey = "skills" | "inventory" | "background" | "appearance" | "cyberware" | "netrunner";

const TABS: {key: TabKey; label: string}[] = [
    {key: "skills", label: "Abilità"},
    {key: "inventory", label: "Inventario"},
    {key: "background", label: "Background"},
    {key: "appearance", label: "Aspetto"},
    {key: "cyberware", label: "Cyberware"},
    {key: "netrunner", label: "Netrunner"},
];

const CyberpunkRedCharacterSheet = () => {
    const [sheet, setSheet] = useState<Sheet>(createEmptySheet);
    const [tab, setTab] = useState<TabKey>("skills");

    const update = useCallback<SheetUpdater>((change) => {
        setSheet((previous) => withDerivedSkills({...change(previous), lastUpdateAt: new Date().toISOString()}));
    }, []);

    const contextValue = useMemo(() => ({sheet, update}), [sheet, update]);

    return (
        <SheetContext.Provider value={contextValue}>
            <div className="mx-auto grid w-full max-w-450 gap-3 p-2 pb-14 text-left text-(--text-h) max-sm:p-2 max-sm:pb-12">
                <div className="flex items-center justify-between gap-3 border-b-2 border-cpr-red pb-1.5">
                    <h1 className="m-0 text-[1.1rem] font-extrabold tracking-widest uppercase md:text-[1.5rem]">
                        Cyberpunk <span className="text-cpr-red italic">Red</span>
                    </h1>
                </div>

                <SheetHeader/>

                <nav
                    role="tablist"
                    aria-label="Sezioni della scheda"
                    className="sticky top-0 z-10 flex snap-x overflow-x-auto border-b-2 border-cpr-red/35 bg-(--bg) [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                >
                    {TABS.map(({key, label}) => (
                        <button
                            key={key}
                            type="button"
                            role="tab"
                            id={`cpr-tab-${key}`}
                            aria-selected={tab === key}
                            aria-controls="cpr-tabpanel"
                            onClick={() => setTab(key)}
                            className={`min-h-9 shrink-0 snap-start cursor-pointer border-0 border-b-[3px] bg-transparent px-3.5 font-bold tracking-wide uppercase hover:text-cpr-red max-sm:min-h-11 max-sm:px-3 ${
                                tab === key ? "border-cpr-red text-cpr-red" : "border-transparent"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </nav>

                <div
                    key={tab}
                    id="cpr-tabpanel"
                    role="tabpanel"
                    aria-labelledby={`cpr-tab-${tab}`}
                    className="min-w-0 animate-tab-in motion-reduce:animate-none"
                >
                    {tab === "skills" && <SkillsPanel/>}
                    {tab === "inventory" && <InventoryPanel/>}
                    {tab === "background" && <BackgroundPanel/>}
                    {tab === "appearance" && <AppearancePanel/>}
                    {tab === "cyberware" && <CyberwarePanel/>}
                    {tab === "netrunner" && <NetrunnerPanel/>}
                </div>
            </div>
        </SheetContext.Provider>
    );
};
export default CyberpunkRedCharacterSheet;
