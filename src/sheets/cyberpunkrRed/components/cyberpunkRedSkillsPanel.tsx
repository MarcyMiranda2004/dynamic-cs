import {useEffect, useState, type ReactNode} from "react";
import {PlusIcon, SearchIcon, XIcon} from "lucide-react";
import {InlineNumber} from "../../../components/common/EditableField";
import {SKILL_DEFS, STAT_LABELS, type SkillKey, type SkillValue} from "../utils/CyberpunkRedCharacterSheetSchema";
import {useSheet} from "../utils/cyberpunkRedSheetContext";
import {removeAt, replaceAt} from "../../../utils/list";

type SkillGroup = (typeof SKILL_DEFS)[SkillKey]["group"];

const GROUPS: {key: SkillGroup | "all"; label: string}[] = [
    {key: "all", label: "Tutte (A–Z)"},
    {key: "artistic", label: "Artistiche"},
    {key: "attention", label: "Attenzione"},
    {key: "ranged", label: "Combattimento a distanza"},
    {key: "melee", label: "Combattimento ravvicinato"},
    {key: "control", label: "Controllo"},
    {key: "physical", label: "Fisiche"},
    {key: "education", label: "Istruzione"},
    {key: "social", label: "Sociali"},
    {key: "technical", label: "Tecniche"},
];

const SKILL_KEYS = Object.keys(SKILL_DEFS) as SkillKey[];
const groupLabel = (group: SkillGroup) => GROUPS.find((g) => g.key === group)?.label ?? group;

// Confronto senza maiuscole e senza accenti: "musica" trova anche "Musicà"
const normalize = (text: string) =>
    text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim();

const SkillsPanel = () => {
    const {update} = useSheet();
    const [group, setGroup] = useState<SkillGroup | "all">("all");
    const [query, setQuery] = useState("");
    const [activeKey, setActiveKey] = useState<SkillKey | null>(null);
    const [editingKey, setEditingKey] = useState<SkillKey | null>(null);

    useEffect(() => {
        if (!editingKey) return;

        const onPointerDown = (event: PointerEvent) => {
            if (!(event.target as Element).closest("[data-skill-editing]")) setEditingKey(null);
        };

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setEditingKey(null);
        };

        document.addEventListener("pointerdown", onPointerDown);
        document.addEventListener("keydown", onKeyDown);
        return () => {
            document.removeEventListener("pointerdown", onPointerDown);
            document.removeEventListener("keydown", onKeyDown);
        };
    }, [editingKey]);

    const matches = query.trim()
        ? SKILL_KEYS.filter((key) => normalize(SKILL_DEFS[key].label).includes(normalize(query)))
        : [];

    // Il risultato evidenziato viene portato in vista dopo che il gruppo corretto è stato mostrato
    useEffect(() => {
        if (activeKey) {
            document.getElementById(`skill-${activeKey}`)?.scrollIntoView({behavior: "smooth", block: "center"});
        }
    }, [activeKey]);

    const pick = (key: SkillKey) => {
        setGroup(SKILL_DEFS[key].group);
        setActiveKey(key);
    };

    const handleQuery = (value: string) => {
        setQuery(value);
        const found = SKILL_KEYS.filter((key) => normalize(SKILL_DEFS[key].label).includes(normalize(value)));
        if (found.length > 0) pick(found[0]);
        else setActiveKey(null);
    };

    const setSkill = (key: SkillKey, patch: Partial<SkillValue>) => update(
        (s) => ({...s, skills: {...s.skills, [key]: {...s.skills[key], ...patch}}})
    );

    const keysInGroup = group === "all"
        ? [...SKILL_KEYS].sort((a, b) => SKILL_DEFS[a].label.localeCompare(SKILL_DEFS[b].label, "it"))
        : SKILL_KEYS.filter((key) => SKILL_DEFS[key].group === group);

    return (
        <div className="grid gap-3 lg:grid-cols-[13.3333rem_1fr] xl:grid-cols-[14.4444rem_1fr]">
            {/* Sidebar: su mobile diventa una riga scorrevole di gruppi */}
            <aside className="grid content-start gap-2 lg:sticky lg:top-14 lg:self-start">
                <div className="relative">
                    <SearchIcon size={16} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 opacity-60"/>
                    <input
                        type="search"
                        value={query}
                        onChange={(event) => handleQuery(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter" && matches.length > 0) pick(matches[0]);
                            if (event.key === "Escape") handleQuery("");
                        }}
                        placeholder="Cerca un'abilità…"
                        aria-label="Cerca un'abilità"
                        className="inputClass border border-cpr-red/50 px-9 [&::-webkit-search-cancel-button]:appearance-none"
                    />

                    {query && (
                        <button
                            type="button"
                            aria-label="Cancella ricerca"
                            onClick={() => handleQuery("")}
                            className="absolute top-1/2 right-1 grid size-11 -translate-y-1/2 place-items-center cursor-pointer"
                        >
                            <XIcon size={16} aria-hidden="true"/>
                        </button>
                    )}
                </div>

                {matches.length > 0 && (
                    <ul className="m-0 grid list-none gap-1.5 p-0" aria-label="Risultati della ricerca">
                        {matches.map((key) => (
                            <li key={key}>
                                <button
                                    type="button"
                                    onClick={() => pick(key)}
                                    className={`flex w-full min-h-9 max-sm:min-h-[44px] cursor-pointer items-center justify-between gap-2 border px-3 text-left ${
                                        activeKey === key ? "border-cpr-glow bg-cpr-red/20" : "border-cpr-red/35"
                                    }`}
                                >
                                    <span className="font-bold">{SKILL_DEFS[key].label}</span>
                                    <span className="text-[0.75em] uppercase opacity-70">{groupLabel(SKILL_DEFS[key].group)}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}

                <nav aria-label="Gruppi di abilità" className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-cpr lg:grid lg:overflow-visible">
                    {GROUPS.map((item) => {
                        const count = item.key === "all" ? SKILL_KEYS.length : SKILL_KEYS.filter((key) => SKILL_DEFS[key].group === item.key).length;
                        const selected = group === item.key;

                        return (
                            <button
                                key={item.key}
                                type="button"
                                aria-current={selected}
                                onClick={() => {
                                    setGroup(item.key);
                                    setActiveKey(null);
                                }}
                                className={`flex min-h-9 max-sm:min-h-[44px] shrink-0 cursor-pointer items-center justify-between gap-3 border px-3 text-left font-bold tracking-wide uppercase ${
                                    selected
                                        ? "border-cpr-red bg-cpr-red text-white"
                                        : "border-cpr-red/35 bg-cpr-panel hover:border-cpr-red"
                                }`}
                            >
                                <span>{item.label}</span>
                                <span className="font-mono text-[0.8em] opacity-80">{count}</span>
                            </button>
                        );
                    })}
                </nav>
            </aside>

            {/* Griglia delle abilità del gruppo selezionato, come le colonne della scheda */}
            <div key={group} className="grid animate-tab-in content-start gap-2 motion-reduce:animate-none sm:grid-cols-2 2xl:grid-cols-3">
                {keysInGroup.map((key) => (
                    <SkillCard
                        key={key}
                        skillKey={key}
                        highlighted={activeKey === key}
                        editing={editingKey === key}
                        onEdit={() => setEditingKey(key)}
                        onDone={() => setEditingKey(null)}
                        onChange={(patch) => setSkill(key, patch)}
                    />
                ))}
            </div>
        </div>
    );
};
export default SkillsPanel;

interface SkillCardProps {
    skillKey: SkillKey;
    highlighted: boolean;
    editing: boolean;
    onEdit: () => void;
    onDone: () => void;
    onChange: (patch: Partial<SkillValue>) => void;
}

// Card di un'abilità: un click la porta in modifica direttamente a schermo, senza modale.
// Perdendo il focus la modifica si chiude (i valori sono già salvati). Lettura e modifica occupano lo stesso spazio.
const SkillCard = ({skillKey, highlighted, editing, onEdit, onDone, onChange}: SkillCardProps) => {
    const {sheet} = useSheet();
    const def = SKILL_DEFS[skillKey];
    const skill = sheet.skills[skillKey];
    const specializations = skill.specializations ?? [];
    const hasSlots = "slots" in def;

    const frameClass = `grid content-start gap-2 border bg-cpr-panel p-2.5 text-left text-inherit transition-shadow duration-300 ${
        highlighted ? "border-cpr-glow shadow-[0_0_16px_rgb(255_90_96/0.55)]" : "border-cpr-red/35"
    }`;

    const header = (
        <span className="flex items-start justify-between gap-2">
            <h4 className="m-0 font-bold">
                {def.label}
                {"multiplier" in def && <span className="ml-1 text-[0.8em] opacity-70">×2</span>}
            </h4>
            <span className="shrink-0 font-mono text-[0.75em] opacity-70">{STAT_LABELS[def.stat]}</span>
        </span>
    );

    const statCells = (levelCell: ReactNode) => (
        <div className="grid grid-cols-3 gap-2 text-center">
            <Mini label="Liv">{levelCell}</Mini>
            <Mini label="Stat"><span className="font-mono text-[1.2rem]">{skill.stat}</span></Mini>
            <Mini label="Base" accent>
                <strong className="font-mono text-[1.4rem] text-cpr-red">{skill.base}</strong>
            </Mini>
        </div>
    );

    if (!editing) {
        return (
            <button
                type="button"
                id={`skill-${skillKey}`}
                onClick={onEdit}
                aria-label={`${def.label}: modifica`}
                className={`${frameClass} w-full cursor-pointer hover:border-cpr-red focus-visible:border-cpr-glow focus-visible:outline-none`}
            >
                {header}
                {statCells(<span className="font-mono text-[1.2rem]">{skill.level}</span>)}

                {hasSlots && (
                    <span className="grid gap-1.5 border-t border-cpr-red/25 pt-2">
                        {specializations.map((spec, index) => (
                            <span key={index} className="flex min-h-9 items-center text-[0.9em] opacity-85">↳ {spec || "—"}</span>
                        ))}

                        <span className="flex min-h-9 items-center gap-1 text-[0.85em] opacity-45">
                            <PlusIcon size={14} aria-hidden="true"/> Specializzazione
                        </span>
                    </span>
                )}
            </button>
        );
    }

    return (
        <article
            id={`skill-${skillKey}`}
            data-skill-editing
            className={`${frameClass} border-cpr-glow`}
            onBlur={(event) => {
                // Il focus passa a un elemento fuori dalla card: si chiude. I click su aree non focalizzabili li gestisce il pannello
                if (event.relatedTarget && !event.currentTarget.contains(event.relatedTarget as Node)) onDone();
            }}
        >
            {header}
            {statCells(<InlineNumber label="Liv" value={skill.level} autoFocus centered onChange={(level) => onChange({level})}/>)}

            {hasSlots && (
                <div className="grid gap-1.5 border-t border-cpr-red/25 pt-2">
                    {specializations.map((spec, index) => (
                        <div key={index} className="flex min-h-9 items-center gap-1.5">
                            <span aria-hidden="true">↳</span>
                            <input
                                className="inputClass flex-1"
                                value={spec}
                                aria-label={`Specializzazione ${index + 1} di ${def.label}`}
                                onChange={(event) =>
                                    onChange({specializations: replaceAt(specializations, index, event.target.value)})
                                }
                            />
                            
                            <button
                                type="button"
                                aria-label="Rimuovi specializzazione"
                                onClick={() => onChange({specializations: removeAt(specializations, index)})}
                                className="buttonClass dangerButtonClass grid min-w-9 place-items-center px-0"
                            >
                                <XIcon size={16} aria-hidden="true"/>
                            </button>
                        </div>
                    ))}

                    <button
                        type="button"
                        onClick={() => onChange({specializations: [...specializations, ""]})}
                        className="flex min-h-9 cursor-pointer items-center gap-1 border-0 bg-transparent p-0 text-left text-[0.85em] font-bold hover:text-cpr-red focus-visible:text-cpr-red focus-visible:outline-none"
                    >
                        <PlusIcon size={14} aria-hidden="true"/> Specializzazione
                    </button>
                </div>
            )}
        </article>
    );
};

// Cella piccola della card abilità: etichetta sopra, valore sotto
const Mini = ({label, accent = false, children}: {label: string; accent?: boolean; children: ReactNode}) => (
    <div className={`grid gap-1 border px-1 py-1.5 ${accent ? "border-cpr-red/60" : "border-cpr-red/25"}`}>
        <span className="text-[0.65em] font-extrabold tracking-widest uppercase opacity-70">{label}</span>
        <div className="flex min-h-9 items-center justify-center">{children}</div>
    </div>
);
