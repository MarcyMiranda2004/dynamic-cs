import {ArrowLeft, ScanLine, X} from "lucide-react";
import DeleteButton from "../../../components/common/DeleteButton";
import EntryList from "../../../components/common/EntryList";
import {TextField} from "../../../components/common/EditableField";
import {buttonClass} from "../../../components/common/ui";
import {
    CYBERWARE_CATEGORY_KEYS,
    CYBERWARE_SLOT_KEYS,
    type CyberwareItem,
    type CyberwareSlotKey,
} from "../CyberpunkRedCharacterSheetSchema";
import {useSheet} from "../SheetContext";
import {removeAt, replaceAt} from "../sheetState";
import {BODY_ZONES, type BodyZoneId} from "../bodyZones";
import {CYBERWARE_LABELS, toEntry, type CyberwareKey} from "../cyberwareLabels";

// La selezione è una zona del corpo (elenco) oppure un singolo componente (dettaglio)
export type CyberwareSelection =
    | {kind: "zone"; zone: BodyZoneId}
    | {kind: "item"; key: CyberwareKey; index: number; from: BodyZoneId | null};

const BLANK_ITEM: CyberwareItem = {name: "", date: "", description: ""};

// Pannello HUD affiancato alla silhouette: resta accanto al corpo, senza sfondo oscurato né finestra centrata
const shell = "relative grid min-h-64 content-start gap-4 border border-cpr-red bg-cpr-ink p-4 font-mono text-cpr-ink-fg";

interface CyberwareInspectorProps {
    selection: CyberwareSelection | null;
    onChange: (selection: CyberwareSelection | null) => void;
}

const CyberwareInspector = ({selection, onChange}: CyberwareInspectorProps) => {
    const {sheet, editMode, update} = useSheet();

    const componentsOf = (key: CyberwareKey) => sheet.cyberware[key].components;

    const setComponents = (key: CyberwareKey, components: CyberwareItem[]) =>
        update((s) => ({...s, cyberware: {...s.cyberware, [key]: {...s.cyberware[key], components}}}));

    const setInstalled = (key: CyberwareSlotKey, installed: boolean) =>
        update((s) => ({...s, cyberware: {...s.cyberware, [key]: {...s.cyberware[key], installed}}}));

    const addComponent = (key: CyberwareKey, from: BodyZoneId | null) => {
        const list = componentsOf(key);
        setComponents(key, [...list, {...BLANK_ITEM}]);
        onChange({kind: "item", key, index: list.length, from});
    };

    // Nessuna parte del corpo selezionata: elenco di tutti gli impianti installati
    if (!selection) {
        return <Overview onOpen={(key, index) => onChange({kind: "item", key, index, from: null})}/>;
    }

    if (selection.kind === "zone") {
        const zone = BODY_ZONES.find((z) => z.id === selection.zone);
        if (!zone) return null;

        return (
            <div key={`zone-${zone.id}`} className={`${shell} animate-tab-in motion-reduce:animate-none`}>
                <Header label={`Zona · ${zone.label}`} onClose={() => onChange(null)}/>

                {zone.slots.map((key) => (
                    <div key={key} className="grid gap-2 border-t border-[#5a1116] pt-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h4 className="m-0 text-[0.95rem] tracking-wider text-cpr-glow uppercase">{CYBERWARE_LABELS[key]}</h4>
                            <label className="inline-flex min-h-11 cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="size-5 accent-cpr-red"
                                    checked={sheet.cyberware[key].installed}
                                    disabled={!editMode}
                                    onChange={(event) => setInstalled(key, event.target.checked)}
                                />
                                <span>{sheet.cyberware[key].installed ? "Installato" : "Non installato"}</span>
                            </label>
                        </div>

                        <EntryList
                            entries={componentsOf(key).map(toEntry)}
                            onOpen={(index) => onChange({kind: "item", key, index, from: zone.id})}
                            onAdd={editMode ? () => addComponent(key, zone.id) : undefined}
                            addLabel="Aggiungi componente"
                            emptyLabel="Nessun componente"
                        />
                    </div>
                ))}
            </div>
        );
    }

    const {key, index, from} = selection;
    const list = componentsOf(key);
    const item = list[index];
    if (!item) return null;

    const patch = (values: Partial<CyberwareItem>) =>
        setComponents(key, replaceAt(list, index, {...item, ...values}));

    const remove = () => {
        setComponents(key, removeAt(list, index));
        onChange(from ? {kind: "zone", zone: from} : null);
    };

    return (
        <div key={`item-${key}-${index}`} className={`${shell} animate-tab-in motion-reduce:animate-none`}>
            <Header label={item.name || CYBERWARE_LABELS[key]} onClose={() => onChange(null)}/>

            <p className="m-0 text-[0.8em] tracking-widest uppercase opacity-70">{CYBERWARE_LABELS[key]}</p>
            <TextField label="Nome" value={item.name} editMode={editMode} onChange={(name) => patch({name})}/>
            <TextField label="Data" value={item.date} editMode={editMode} onChange={(date) => patch({date})}/>
            <TextField label="Descrizione" value={item.description} multiline editMode={editMode}
                       onChange={(description) => patch({description})}/>

            <div className="flex flex-wrap justify-between gap-2 border-t border-[#5a1116] pt-3">
                {from && (
                    <button type="button" onClick={() => onChange({kind: "zone", zone: from})} className={buttonClass}>
                        <ArrowLeft size={16} aria-hidden="true" className="inline-block align-text-bottom"/> Elenco
                    </button>
                )}
                {editMode && <DeleteButton label="Elimina" onClick={remove}/>}
            </div>
        </div>
    );
};
export default CyberwareInspector;

// Riepilogo di tutto il cyberware installato, raggruppato per slot o categoria
const Overview = ({onOpen}: {onOpen: (key: CyberwareKey, index: number) => void}) => {
    const {sheet} = useSheet();

    const installed = [...CYBERWARE_SLOT_KEYS, ...CYBERWARE_CATEGORY_KEYS].filter((key) => {
        const entry = sheet.cyberware[key];
        return ("installed" in entry && entry.installed) || entry.components.length > 0;
    });

    if (installed.length === 0) {
        return (
            <div className={`${shell} place-items-center text-center`}>
                <ScanLine size={32} aria-hidden="true" className="text-cpr-red"/>
                <p className="m-0 opacity-80">Nessun cyberware installato. Tocca una parte del corpo per aggiungerne uno.</p>
            </div>
        );
    }

    return (
        <div className={`${shell} animate-tab-in motion-reduce:animate-none`}>
            <Header label="Cyberware installato"/>

            {installed.map((key) => {
                const components = sheet.cyberware[key].components;
                return (
                    <div key={key} className="grid gap-2 border-t border-[#5a1116] pt-3">
                        <div className="flex items-center justify-between gap-2">
                            <h4 className="m-0 text-[0.95rem] tracking-wider text-cpr-glow uppercase">{CYBERWARE_LABELS[key]}</h4>
                            <span className="font-mono text-[0.8em] opacity-70">{components.length}</span>
                        </div>
                        <EntryList
                            entries={components.map(toEntry)}
                            onOpen={(index) => onOpen(key, index)}
                            emptyLabel="Installato, nessun componente"
                        />
                    </div>
                );
            })}
        </div>
    );
};

// Intestazione in stile terminale: etichetta in rosso e, se previsto, chiusura
const Header = ({label, onClose}: {label: string; onClose?: () => void}) => (
    <div className="flex items-start justify-between gap-3">
        <h3 className="m-0 text-base font-bold tracking-widest text-cpr-glow uppercase [overflow-wrap:anywhere] [text-shadow:0_0_8px_rgb(255_90_96/0.6)]">
            &gt; {label}
        </h3>
        {onClose && (
            <button
                type="button"
                onClick={onClose}
                aria-label="Chiudi pannello"
                className="grid min-h-11 min-w-11 shrink-0 cursor-pointer place-items-center border border-[#5a1116] hover:border-cpr-glow hover:text-cpr-glow focus-visible:border-cpr-glow focus-visible:outline-none"
            >
                <X size={16} aria-hidden="true"/>
            </button>
        )}
    </div>
);
