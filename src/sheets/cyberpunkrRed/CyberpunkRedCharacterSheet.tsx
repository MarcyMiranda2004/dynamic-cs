import {useCallback, useMemo, useState} from "react";
import {buttonClass} from "../../components/common/ui";
import {SheetContext, type SheetUpdater} from "./SheetContext";
import {createEmptySheet, withDerivedSkills, type Sheet} from "./sheetState";
import SheetHeader from "./components/SheetHeader";
import SkillsPanel from "./components/SkillsPanel";
import InventoryPanel from "./components/InventoryPanel";
import BackgroundPanel from "./components/BackgroundPanel";
import CyberwarePanel from "./components/CyberwarePanel";
import NetrunnerPanel from "./components/NetrunnerPanel";

type TabKey = "skills" | "inventory" | "background" | "cyberware" | "netrunner";

const TABS: {key: TabKey; label: string}[] = [
    {key: "skills", label: "Abilità"},
    {key: "inventory", label: "Inventario"},
    {key: "background", label: "Background"},
    {key: "cyberware", label: "Cyberware"},
    {key: "netrunner", label: "Netrunner"},
];

const CyberpunkRedCharacterSheet = () => {
    const [sheet, setSheet] = useState<Sheet>(createEmptySheet);
    const [editMode, setEditMode] = useState(false);
    const [tab, setTab] = useState<TabKey>("skills");

    const update = useCallback<SheetUpdater>((change) => {
        setSheet((previous) => withDerivedSkills({...change(previous), lastUpdateAt: new Date().toISOString()}));
    }, []);

    const contextValue = useMemo(() => ({sheet, editMode, update}), [sheet, editMode, update]);

    return (
        <SheetContext.Provider value={contextValue}>
            <div data-editing={editMode} className="group/sheet mx-auto grid w-full max-w-450 gap-3 p-2 pb-14 text-left text-(--text-h) max-sm:p-2 max-sm:pb-12">
                <div className="flex items-center justify-between gap-3 border-b-2 border-cpr-red pb-1.5">
                    <h1 className="m-0 text-[1.1rem] font-extrabold tracking-widest uppercase md:text-[1.5rem]">
                        Cyberpunk <span className="text-cpr-red italic">Red</span>
                    </h1>
                    <button
                        type="button"
                        aria-pressed={editMode}
                        onClick={() => setEditMode((value) => !value)}
                        className={`${buttonClass} aria-pressed:bg-cpr-red aria-pressed:text-white`}
                    >
                        {editMode ? "Fine modifica" : "Modifica"}
                    </button>
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
                    {tab === "cyberware" && <CyberwarePanel/>}
                    {tab === "netrunner" && <NetrunnerPanel/>}
                </div>
            </div>
        </SheetContext.Provider>
    );
};
export default CyberpunkRedCharacterSheet;
