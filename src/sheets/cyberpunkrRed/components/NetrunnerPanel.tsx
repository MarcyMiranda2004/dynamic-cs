import {useState} from "react";
import {Check, Eraser, Plus} from "lucide-react";
import DeleteButton from "../../../components/common/DeleteButton";
import Modal from "../../../components/common/Modal";
import {NumberField, TextField} from "../../../components/common/EditableField";
import {buttonClass, fieldLabelClass, inputClass} from "../../../components/common/ui";
import {
    OFFENSIVE_TARGET_LABELS,
    PROGRAM_CLASS_LABELS,
    type DeckSlot,
    type OffensiveTarget,
    type Program,
    type ProgramClass,
} from "../program";
import {useSheet} from "../SheetContext";
import "./netrunner.css";
import {removeAt, replaceAt} from "../../../utils/list";

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
    const {sheet, update} = useSheet();
    const deck = sheet.netrunner.deck;
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const setDeck = (next: DeckSlot[]) =>
        update((s) => ({...s, netrunner: {...s.netrunner, deck: next}}));

    const addSlot = () => {
        setDeck([...deck, {slot: deck.length + 1, program: null}]);
        setOpenIndex(deck.length);
    };

    return (
        <section aria-label="Deck netrunner" className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {deck.map((slot, index) => (
                <SlotCard key={index} slot={slot} onOpen={() => setOpenIndex(index)}/>
            ))}

            <button type="button" onClick={addSlot} className="chip chip--empty">
                <span className="chip-inner">
                    <span className="chip-body">
                        <span className="chip-plate">
                            <span className="chip-serial"><i className="chip-led"/>Nuovo slot</span>
                        </span>
                        <span className="chip-empty-label">
                            <Plus size={22} aria-hidden="true" className="justify-self-center text-cpr-red"/>
                            <span className="font-bold tracking-wide uppercase">Aggiungi slot</span>
                        </span>
                    </span>
                    <span className="chip-pins" aria-hidden="true"/>
                </span>
            </button>

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

// Slot del deck come chip di memoria: riepilogo di slot, classe, bersaglio e statistiche del programma
const SlotCard = ({slot, onOpen}: {slot: DeckSlot; onOpen: () => void}) => {
    const program = slot.program;
    const slotNumber = `Slot ${String(slot.slot).padStart(2, "0")}`;

    if (!program) {
        return (
            <button type="button" onClick={onOpen} className="chip chip--empty">
                <span className="chip-inner">
                    <span className="chip-body">
                        <span className="chip-plate">
                            <span className="chip-serial"><i className="chip-led"/>{slotNumber}</span>
                        </span>
                        <span className="chip-empty-label">
                            <span>Slot libero</span>
                            <span className="text-[0.8em] font-bold tracking-wide text-cpr-red uppercase">Installa programma</span>
                        </span>
                    </span>
                    <span className="chip-pins" aria-hidden="true"/>
                </span>
            </button>
        );
    }

    return (
        <button type="button" onClick={onOpen} className="chip chip--on">
            <span className="chip-inner">
                <span className="chip-body">
                    <span className="chip-plate">
                        <span className="chip-serial"><i className="chip-led"/>{slotNumber}</span>
                        <span className="chip-class">{PROGRAM_CLASS_LABELS[program.class]}</span>
                    </span>

                    <h4 className="m-0 mt-1 text-lg font-bold [overflow-wrap:anywhere]">{program.name || "Senza nome"}</h4>

                    {"target" in program && (
                        <span className="text-[0.8em] tracking-wide text-cpr-glow uppercase">
                            Bersaglio · {OFFENSIVE_TARGET_LABELS[program.target]}
                        </span>
                    )}

                    <span className="grid grid-cols-4 gap-1.5 text-center">
                        <Cell label="ATT" value={String(program.att)}/>
                        <Cell label="DIF" value={String(program.def)}/>
                        <Cell label="REZ" value={String(program.rez)}/>
                        <Cell label="DAN" value={program.damage || "—"}/>
                    </span>

                    {program.effect && <span className="line-clamp-2 text-[0.9em] opacity-75">{program.effect}</span>}
                </span>
                <span className="chip-pins" aria-hidden="true"/>
            </span>
        </button>
    );
};

const Cell = ({label, value}: {label: string; value: string}) => (
    <span className="grid gap-0.5 border border-white/15 bg-black/25 px-1 py-1.5">
        <span className="text-[0.65em] font-extrabold tracking-widest uppercase opacity-70">{label}</span>
        <strong className="font-mono text-[1.1rem]">{value}</strong>
    </span>
);

interface ProgramModalProps {
    index: number;
    onClose: () => void;
    onRemoveSlot: () => void;
}

// Slot libero: bozza da installare con "Installa". Slot occupato: dettaglio modificabile, ogni cambio è subito salvato
const ProgramModal = ({index, onClose, onRemoveSlot}: ProgramModalProps) => {
    const {sheet, update} = useSheet();
    const slot = sheet.netrunner.deck[index];
    const [draft, setDraft] = useState<Program>(BLANK_PROGRAM);

    const writeSlot = (program: Program | null) =>
        update((s) => ({
            ...s,
            netrunner: {
                ...s.netrunner,
                deck: replaceAt(s.netrunner.deck, index, {...s.netrunner.deck[index], program}),
            },
        }));

    const installed = slot.program;
    const slotLabel = `Slot ${String(slot.slot).padStart(2, "0")}`;

    if (!installed) {
        const install = () => {
            writeSlot(draft);
            onClose();
        };

        return (
            <Modal
                title={`${slotLabel} · Installa programma`}
                onClose={onClose}
                footer={
                    <>
                        <DeleteButton label="Rimuovi slot" onClick={onRemoveSlot}/>
                        <button type="button" onClick={install} className={buttonClass}>
                            <Check size={16} aria-hidden="true" className="inline-block align-text-bottom"/> Installa
                        </button>
                    </>
                }
            >
                <ProgramForm program={draft} onChange={setDraft}/>
            </Modal>
        );
    }

    return (
        <Modal
            title={installed.name || slotLabel}
            onClose={onClose}
            footer={
                <>
                    <DeleteButton label="Rimuovi slot" onClick={onRemoveSlot}/>
                    <button
                        type="button"
                        onClick={() => {
                            writeSlot(null);
                            onClose();
                        }}
                        className={buttonClass}
                    >
                        <Eraser size={16} aria-hidden="true" className="inline-block align-text-bottom"/> Svuota
                    </button>
                </>
            }
        >
            <ProgramForm program={installed} onChange={writeSlot}/>
        </Modal>
    );
};

// Campi del programma: gli stessi per l'installazione e per la modifica
const ProgramForm = ({program, onChange}: {program: Program; onChange: (program: Program) => void}) => {
    const patch = (values: Partial<Pick<Program, "name" | "att" | "def" | "rez" | "damage" | "effect">>) =>
        onChange({...program, ...values});

    return (
        <>
            <TextField label="Nome" value={program.name} onChange={(name) => patch({name})}/>

            <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid min-w-0 gap-1">
                    <span className={fieldLabelClass}>Classe</span>
                    <select
                        className={`${inputClass} [&_option]:bg-cpr-ink [&_option]:text-cpr-ink-fg`}
                        value={program.class}
                        onChange={(event) => onChange(withClass(program, event.target.value as ProgramClass))}
                    >
                        {(Object.keys(PROGRAM_CLASS_LABELS) as ProgramClass[]).map((cls) => (
                            <option key={cls} value={cls}>{PROGRAM_CLASS_LABELS[cls]}</option>
                        ))}
                    </select>
                </label>

                {"target" in program && (
                    <label className="grid min-w-0 gap-1">
                        <span className={fieldLabelClass}>Bersaglio</span>
                        <select
                            className={`${inputClass} [&_option]:bg-cpr-ink [&_option]:text-cpr-ink-fg`}
                            value={program.target}
                            onChange={(event) => onChange({...program, target: event.target.value as OffensiveTarget})}
                        >
                            {(Object.keys(OFFENSIVE_TARGET_LABELS) as OffensiveTarget[]).map((target) => (
                                <option key={target} value={target}>{OFFENSIVE_TARGET_LABELS[target]}</option>
                            ))}
                        </select>
                    </label>
                )}
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <NumberField label="ATT" value={program.att} onChange={(att) => patch({att})}/>
                <NumberField label="DIF" value={program.def} onChange={(def) => patch({def})}/>
                <NumberField label="REZ" value={program.rez} onChange={(rez) => patch({rez})}/>
                <TextField label="Danno (DAN)" value={program.damage} placeholder="es. 2d6"
                           onChange={(damage) => patch({damage})}/>
            </div>

            <TextField label="Effetto" value={program.effect} multiline onChange={(effect) => patch({effect})}/>
        </>
    );
};
