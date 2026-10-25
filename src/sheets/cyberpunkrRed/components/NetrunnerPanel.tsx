import {useState} from "react";
import {Check, Eraser, Plus} from "lucide-react";
import DeleteButton from "../../../components/common/DeleteButton";
import Modal from "../../../components/common/Modal";
import {NumberField, TextField} from "../../../components/common/EditableField";
import {buttonClass, inputClass} from "../../../components/common/ui";
import {
    OFFENSIVE_TARGET_LABELS,
    PROGRAM_CLASS_LABELS,
    type DeckSlot,
    type OffensiveTarget,
    type Program,
    type ProgramClass,
} from "../program";
import {useSheet} from "../SheetContext";
import {removeAt, replaceAt} from "../sheetState";

const BLANK_PROGRAM: Program = {name: "", att: 0, def: 0, rez: 0, damage: "", effect: "", class: "boost"};

// Cambia la classe mantenendo i dati comuni; il bersaglio esiste solo per le offensive
const withClass = (program: Program, cls: ProgramClass): Program => {
    const {name, att, def, rez, damage, effect} = program;
    if (cls === "offensive") {
        const target: OffensiveTarget = "target" in program ? program.target : "anti-operator";
        return {name, att, def, rez, damage, effect, class: "offensive", target};
    }
    return {name, att, def, rez, damage, effect, class: cls};
};

// Numera gli slot in ordine dopo un'aggiunta o una rimozione
const renumber = (deck: DeckSlot[]): DeckSlot[] => deck.map((slot, index) => ({...slot, slot: index + 1}));

const NetrunnerPanel = () => {
    const {sheet, editMode, update} = useSheet();
    const deck = sheet.netrunner.deck;
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const setDeck = (next: DeckSlot[]) =>
        update((s) => ({...s, netrunner: {...s.netrunner, deck: next}}));

    const addSlot = () => {
        setDeck([...deck, {slot: deck.length + 1, program: null}]);
        setOpenIndex(deck.length);
    };

    return (
        <section aria-label="Deck netrunner" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {deck.map((slot, index) => (
                <SlotCard key={index} slot={slot} onOpen={() => setOpenIndex(index)}/>
            ))}

            {editMode && (
                <button
                    type="button"
                    onClick={addSlot}
                    className="grid min-h-40 cursor-pointer place-items-center content-center gap-2 border border-dashed border-cpr-red/60 bg-transparent p-4 hover:border-cpr-glow focus-visible:border-cpr-glow focus-visible:outline-none"
                >
                    <Plus size={24} aria-hidden="true" className="justify-self-center text-cpr-red"/>
                    <span className="font-bold tracking-wide uppercase">Aggiungi slot</span>
                </button>
            )}

            {openIndex !== null && deck[openIndex] && (
                <ProgramModal
                    index={openIndex}
                    onClose={() => setOpenIndex(null)}
                    onRemoveSlot={() => {
                        setDeck(renumber(removeAt(deck, openIndex)));
                        setOpenIndex(null);
                    }}
                />
            )}
        </section>
    );
};
export default NetrunnerPanel;

// Card del deck: riepilogo di slot, classe, bersaglio e statistiche del programma
const SlotCard = ({slot, onOpen}: {slot: DeckSlot; onOpen: () => void}) => {
    const program = slot.program;
    const slotNumber = `Slot ${String(slot.slot).padStart(2, "0")}`;

    if (!program) {
        return (
            <button
                type="button"
                onClick={onOpen}
                className="grid min-h-40 cursor-pointer content-center gap-2 border border-dashed border-cpr-red/40 bg-cpr-panel p-4 text-center opacity-80 hover:border-cpr-glow hover:opacity-100 focus-visible:border-cpr-glow focus-visible:outline-none"
            >
                <span className="font-mono text-[0.75em] tracking-widest opacity-70">{slotNumber}</span>
                <span>Slot libero</span>
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={onOpen}
            className="grid cursor-pointer content-start gap-3 border border-cpr-red bg-cpr-panel p-3.5 text-left hover:border-cpr-glow hover:shadow-[0_0_14px_rgb(255_90_96/0.4)] focus-visible:border-cpr-glow focus-visible:outline-none"
        >
            <header className="flex items-center justify-between gap-2">
                <span className="font-mono text-[0.75em] tracking-widest opacity-70">{slotNumber}</span>
                <span className="border border-cpr-red/60 px-2 py-0.5 text-[0.7em] font-bold tracking-wider uppercase">
                    {PROGRAM_CLASS_LABELS[program.class]}
                </span>
            </header>

            <h4 className="m-0 text-lg font-bold [overflow-wrap:anywhere]">{program.name || "Senza nome"}</h4>

            {"target" in program && (
                <span className="text-[0.8em] tracking-wide text-cpr-glow uppercase">
                    Bersaglio · {OFFENSIVE_TARGET_LABELS[program.target]}
                </span>
            )}

            <div className="grid grid-cols-4 gap-1.5 text-center">
                <Cell label="ATT" value={String(program.att)}/>
                <Cell label="DIF" value={String(program.def)}/>
                <Cell label="REZ" value={String(program.rez)}/>
                <Cell label="DAN" value={program.damage || "—"}/>
            </div>

            {program.effect && <p className="m-0 line-clamp-2 text-[0.9em] opacity-75">{program.effect}</p>}
        </button>
    );
};

const Cell = ({label, value}: {label: string; value: string}) => (
    <div className="grid gap-0.5 border border-cpr-red/30 px-1 py-1.5">
        <span className="text-[0.65em] font-extrabold tracking-widest uppercase opacity-70">{label}</span>
        <strong className="font-mono text-[1.1rem]">{value}</strong>
    </div>
);

interface ProgramModalProps {
    index: number;
    onClose: () => void;
    onRemoveSlot: () => void;
}

const ProgramModal = ({index, onClose, onRemoveSlot}: ProgramModalProps) => {
    const {sheet, editMode, update} = useSheet();
    const slot = sheet.netrunner.deck[index];
    // In modifica lavoriamo su una bozza, salvata solo con "Salva"
    const [draft, setDraft] = useState<Program>(slot.program ?? BLANK_PROGRAM);

    const writeSlot = (program: Program | null) =>
        update((s) => ({
            ...s,
            netrunner: {
                ...s.netrunner,
                deck: replaceAt(s.netrunner.deck, index, {...s.netrunner.deck[index], program}),
            },
        }));

    const save = () => {
        writeSlot(draft);
        onClose();
    };

    const clear = () => {
        writeSlot(null);
        onClose();
    };

    const title = slot.program?.name || `Slot ${slot.slot}`;

    if (!editMode) {
        const program = slot.program;
        return (
            <Modal title={title} onClose={onClose}>
                {!program ? (
                    <p className="m-0">Slot libero: attiva la modifica per installare un programma.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2">
                            <Stat label="Classe" value={PROGRAM_CLASS_LABELS[program.class]}/>
                            {"target" in program && <Stat label="Bersaglio" value={OFFENSIVE_TARGET_LABELS[program.target]}/>}
                            <Stat label="ATT" value={String(program.att)}/>
                            <Stat label="DIF" value={String(program.def)}/>
                            <Stat label="REZ" value={String(program.rez)}/>
                            <Stat label="DAN" value={program.damage || "—"}/>
                        </div>
                        <p className="m-0 border-l-2 border-cpr-red pl-3 leading-normal whitespace-pre-wrap">
                            {program.effect || "Nessun effetto descritto."}
                        </p>
                    </>
                )}
            </Modal>
        );
    }

    const patch = (values: Partial<Pick<Program, "name" | "att" | "def" | "rez" | "damage" | "effect">>) =>
        setDraft((current) => ({...current, ...values}));

    return (
        <Modal
            title={title}
            onClose={onClose}
            footer={
                <>
                    <DeleteButton label="Rimuovi slot" onClick={onRemoveSlot}/>
                    {slot.program && (
                        <button type="button" onClick={clear} className={buttonClass}>
                            <Eraser size={16} aria-hidden="true" className="inline-block align-text-bottom"/> Svuota
                        </button>
                    )}
                    <button type="button" onClick={save} className={buttonClass}>
                        <Check size={16} aria-hidden="true" className="inline-block align-text-bottom"/> Salva
                    </button>
                </>
            }
        >
            <TextField label="Nome" value={draft.name} editMode onChange={(name) => patch({name})}/>

            <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid min-w-0 gap-1">
                    <span className="text-[0.75em] font-bold tracking-widest uppercase opacity-70">Classe</span>
                    <select
                        className={`${inputClass} [&_option]:bg-cpr-ink [&_option]:text-cpr-ink-fg`}
                        value={draft.class}
                        onChange={(event) => setDraft((current) => withClass(current, event.target.value as ProgramClass))}
                    >
                        {(Object.keys(PROGRAM_CLASS_LABELS) as ProgramClass[]).map((cls) => (
                            <option key={cls} value={cls}>{PROGRAM_CLASS_LABELS[cls]}</option>
                        ))}
                    </select>
                </label>

                {"target" in draft && (
                    <label className="grid min-w-0 gap-1">
                        <span className="text-[0.75em] font-bold tracking-widest uppercase opacity-70">Bersaglio</span>
                        <select
                            className={`${inputClass} [&_option]:bg-cpr-ink [&_option]:text-cpr-ink-fg`}
                            value={draft.target}
                            onChange={(event) =>
                                setDraft((current) =>
                                    "target" in current
                                        ? {...current, target: event.target.value as OffensiveTarget}
                                        : current
                                )
                            }
                        >
                            {(Object.keys(OFFENSIVE_TARGET_LABELS) as OffensiveTarget[]).map((target) => (
                                <option key={target} value={target}>{OFFENSIVE_TARGET_LABELS[target]}</option>
                            ))}
                        </select>
                    </label>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <NumberField label="ATT" value={draft.att} editMode onChange={(att) => patch({att})}/>
                <NumberField label="DIF" value={draft.def} editMode onChange={(def) => patch({def})}/>
                <NumberField label="REZ" value={draft.rez} editMode onChange={(rez) => patch({rez})}/>
                <TextField label="Danno (DAN)" value={draft.damage} editMode placeholder="es. 2d6"
                           onChange={(damage) => patch({damage})}/>
            </div>

            <TextField label="Effetto" value={draft.effect} multiline editMode onChange={(effect) => patch({effect})}/>
        </Modal>
    );
};

const Stat = ({label, value}: {label: string; value: string}) => (
    <div className="grid gap-0.5 border border-[#5a1116] p-2 text-center">
        <span className="text-[0.7em] tracking-widest uppercase opacity-70">{label}</span>
        <strong className="text-lg break-words text-cpr-glow [overflow-wrap:anywhere]">{value}</strong>
    </div>
);
