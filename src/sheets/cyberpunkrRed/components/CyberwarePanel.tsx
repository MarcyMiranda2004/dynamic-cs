import {useState} from "react";
import {ChevronsDownUp, ChevronsUpDown} from "lucide-react";
import CompactSection from "../../../components/common/CompactSection";
import EntryList from "../../../components/common/EntryList";
import {buttonClass} from "../../../components/common/ui";
import {CYBERWARE_CATEGORY_KEYS, type CyberwareCategoryKey} from "../CyberpunkRedCharacterSheetSchema";
import {useSheet} from "../SheetContext";
import type {BodyZoneId} from "../bodyZones";
import {CYBERWARE_LABELS, toEntry} from "../cyberwareLabels";
import BodySilhouette from "./BodySilhouette";
import CyberwareInspector, {type CyberwareSelection} from "./CyberwareInspector";

const CyberwarePanel = () => {
    const {sheet, editMode, update} = useSheet();
    const [selection, setSelection] = useState<CyberwareSelection | null>(null);
    const [overrides, setOverrides] = useState<Partial<Record<CyberwareCategoryKey, boolean>>>({});

    const isOpen = (key: CyberwareCategoryKey) => overrides[key] ?? sheet.cyberware[key].components.length > 0;
    const allOpen = CYBERWARE_CATEGORY_KEYS.every(isOpen);

    const setAllOpen = (open: boolean) =>setOverrides(
        Object.fromEntries(CYBERWARE_CATEGORY_KEYS.map((key) => [key, open])) as Record<CyberwareCategoryKey, boolean>
    );

    const selectedZone: BodyZoneId | null = selection?.kind === "zone" 
        ? selection.zone 
        : selection?.kind === "item" 
            ? selection.from 
            : null;

    const addCategoryItem = (key: CyberwareCategoryKey) => {
        const index = sheet.cyberware[key].components.length;
        update((s) => ({
            ...s,
            cyberware: {
                ...s.cyberware,
                [key]: {...s.cyberware[key], components: [...s.cyberware[key].components, {name: "", date: "", description: ""}]},
            },
        }));
        setSelection({kind: "item", key, index, from: null});
    };

    const ToggleIcon = allOpen ? ChevronsDownUp : ChevronsUpDown;

    return (
        <div className="grid items-start gap-3 xl:grid-cols-[minmax(260px,340px)_1fr_minmax(260px,340px)]">
            <div className="xl:sticky xl:top-14">
                <BodySilhouette selected={selectedZone} onSelect={(zone: BodyZoneId) => setSelection({kind: "zone", zone})}/>
            </div>

            <CyberwareInspector selection={selection} onChange={setSelection}/>

            {/* Impianti extra sulla destra: sempre visibili, compattabili */}
            <aside className="grid content-start gap-2" aria-label="Impianti extra">
                <div className="flex items-center justify-between gap-2">
                    <h3 className="m-0 text-sm font-bold tracking-widest uppercase text-cpr-red">Impianti extra</h3>
                    <button type="button" onClick={() => setAllOpen(!allOpen)} className={buttonClass}>
                        <ToggleIcon size={16} aria-hidden="true" className="inline-block align-text-bottom"/>{" "}
                        {allOpen ? "Chiudi tutto" : "Apri tutto"}
                    </button>
                </div>

                {CYBERWARE_CATEGORY_KEYS.map((key) => {
                    const items = sheet.cyberware[key].components;
                    return (
                        <CompactSection
                            key={key}
                            title={CYBERWARE_LABELS[key]}
                            meta={String(items.length)}
                            open={isOpen(key)}
                            onToggle={(open) => setOverrides((prev) => ({...prev, [key]: open}))}
                        >
                            <EntryList
                                entries={items.map(toEntry)}
                                onOpen={(index) => setSelection({kind: "item", key, index, from: null})}
                                onAdd={editMode ? () => addCategoryItem(key) : undefined}
                                addLabel="Aggiungi"
                                emptyLabel="Nessun elemento"
                            />
                        </CompactSection>
                    );
                })}
            </aside>
        </div>
    );
};
export default CyberwarePanel;
