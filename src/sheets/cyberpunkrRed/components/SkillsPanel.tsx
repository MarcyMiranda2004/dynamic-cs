import {useEffect, useState, type ReactNode} from "react";
import {Plus, Search, X} from "lucide-react";
import {InlineNumber} from "../../../components/common/EditableField";
import {buttonClass, dangerButtonClass, inputClass} from "../../../components/common/ui";
import {SKILL_DEFS, STAT_LABELS, type SkillKey, type SkillValue} from "../CyberpunkRedCharacterSheetSchema";
import {useSheet} from "../SheetContext";
import {removeAt, replaceAt} from "../sheetState";

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
    const {sheet, editMode, update} = useSheet();
    const [group, setGroup] = useState<SkillGroup | "all">("artistic");
    const [query, setQuery] = useState("");
    const [activeKey, setActiveKey] = useState<SkillKey | null>(null);

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

    const setSkill = (key: SkillKey, patch: Partial<SkillValue>) =>
        update((s) => ({...s, skills: {...s.skills, [key]: {...s.skills[key], ...patch}}}));

    const keysInGroup = group === "all"
        ? [...SKILL_KEYS].sort((a, b) => SKILL_DEFS[a].label.localeCompare(SKILL_DEFS[b].label, "it"))
        : SKILL_KEYS.filter((key) => SKILL_DEFS[key].group === group);

    return (
        <div className="grid gap-4 lg:grid-cols-[240px_1fr] xl:grid-cols-[280px_1fr]">
            {/* Sidebar: su mobile diventa una riga scorrevole di gruppi */}
            <aside className="grid content-start gap-3 lg:sticky lg:top-16 lg:self-start">
                <div className="relative">
                    <Search size={16} aria-hidden="true" className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 opacity-60"/>
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
                        className={`${inputClass} border border-cpr-red/50 px-9`}
                    />
                    {query && (
                        <button
                            type="button"
                            aria-label="Cancella ricerca"
                            onClick={() => handleQuery("")}
                            className="absolute top-1/2 right-1 grid size-11 -translate-y-1/2 place-items-center cursor-pointer"
                        >
                            <X size={16} aria-hidden="true"/>
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
                                    className={`flex w-full min-h-11 cursor-pointer items-center justify-between gap-2 border px-3 text-left ${
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

                <nav aria-label="Gruppi di abilità" className="flex gap-1.5 overflow-x-auto pb-1 lg:grid lg:overflow-visible">
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
                                className={`flex min-h-11 shrink-0 cursor-pointer items-center justify-between gap-3 border px-3 text-left font-bold tracking-wide uppercase ${
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
            <div key={group} className="grid animate-tab-in content-start gap-3 motion-reduce:animate-none sm:grid-cols-2 2xl:grid-cols-3">
                {keysInGroup.map((key) => {
                    const def = SKILL_DEFS[key];
                    const skill = sheet.skills[key];
                    const specializations = skill.specializations ?? [];
                    const highlighted = activeKey === key;

                    return (
                        <article
                            key={key}
                            id={`skill-${key}`}
                            className={`grid content-start gap-3 border bg-cpr-panel p-3.5 transition-shadow duration-300 ${
                                highlighted
                                    ? "border-cpr-glow shadow-[0_0_16px_rgb(255_90_96/0.55)]"
                                    : "border-cpr-red/35"
                            }`}
                        >
                            <header className="flex items-start justify-between gap-2">
                                <h4 className="m-0 font-bold">
                                    {def.label}
                                    {"multiplier" in def && <span className="ml-1 text-[0.8em] opacity-70">×2</span>}
                                </h4>
                                <span className="shrink-0 font-mono text-[0.75em] opacity-70">{STAT_LABELS[def.stat]}</span>
                            </header>

                            <div className="grid grid-cols-3 gap-2 text-center">
                                <Mini label="Liv">
                                    <InlineNumber
                                        label="Liv"
                                        value={skill.level}
                                        editMode={editMode}
                                        onChange={(level) => setSkill(key, {level})}
                                    />
                                </Mini>
                                <Mini label="Stat">
                                    <span className="font-mono text-[1.2rem]">{skill.stat}</span>
                                </Mini>
                                <Mini label="Base" accent>
                                    <strong className="font-mono text-[1.4rem] text-cpr-red">{skill.base}</strong>
                                </Mini>
                            </div>

                            {"slots" in def && (specializations.length > 0 || editMode) && (
                                <div className="grid gap-1.5 border-t border-cpr-red/25 pt-2">
                                    {specializations.map((spec, index) =>
                                        editMode ? (
                                            <div key={index} className="flex items-center gap-1.5">
                                                <input
                                                    className={`${inputClass} flex-1`}
                                                    value={spec}
                                                    aria-label={`Specializzazione ${index + 1} di ${def.label}`}
                                                    onChange={(event) =>
                                                        setSkill(key, {
                                                            specializations: replaceAt(specializations, index, event.target.value),
                                                        })
                                                    }
                                                />
                                                <button
                                                    type="button"
                                                    aria-label="Rimuovi specializzazione"
                                                    onClick={() =>
                                                        setSkill(key, {specializations: removeAt(specializations, index)})
                                                    }
                                                    className={`${buttonClass} ${dangerButtonClass} grid min-w-11 place-items-center px-0`}
                                                >
                                                    <X size={16} aria-hidden="true"/>
                                                </button>
                                            </div>
                                        ) : (
                                            <p key={index} className="m-0 text-[0.9em] opacity-85">
                                                ↳ {spec || "—"}
                                            </p>
                                        )
                                    )}

                                    {editMode && (
                                        <button
                                            type="button"
                                            onClick={() => setSkill(key, {specializations: [...specializations, ""]})}
                                            className={`${buttonClass} justify-self-start`}
                                        >
                                            <Plus size={16} aria-hidden="true" className="inline-block align-text-bottom"/> Specializzazione
                                        </button>
                                    )}
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>
        </div>
    );
};
export default SkillsPanel;

// Cella piccola della card abilità: etichetta sopra, valore sotto
const Mini = ({label, accent = false, children}: {label: string; accent?: boolean; children: ReactNode}) => (
    <div className={`grid gap-1 border px-1 py-2 ${accent ? "border-cpr-red/60" : "border-cpr-red/25"}`}>
        <span className="text-[0.65em] font-extrabold tracking-widest uppercase opacity-70">{label}</span>
        <div className="flex min-h-7 items-center justify-center">{children}</div>
    </div>
);
