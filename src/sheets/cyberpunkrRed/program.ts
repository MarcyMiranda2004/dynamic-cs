// #region Netrunner
export type ProgramClass = "boost" | "defensive" | "offensive";
export type OffensiveTarget = "anti-operator" | "anti-program";

export const PROGRAM_CLASS_LABELS: Record<ProgramClass, string> = {
    boost: "Boost",
    defensive: "Difensiva",
    offensive: "Offensiva",
};

export const OFFENSIVE_TARGET_LABELS: Record<OffensiveTarget, string> = {
    "anti-operator": "Anti-Operatore",
    "anti-program": "Anti-Programma",
};

// Il bersaglio è obbligatorio solo per le offensive
export type Program = {
    name: string;
    att: number;     // ATT
    def: number;     // DIF
    rez: number;     // REZ
    damage: string;  // DAN, es. "2d6"; vuoto se il programma non infligge danni
    effect: string;  // testo dell'effetto
} & (
        | {class: "boost" | "defensive"}
        | {class: "offensive"; target: OffensiveTarget}
    );

// Il Cyberdeck base ha 7 slot. Lo stesso programma può comparire più volte.
export interface DeckSlot {
    slot: number;            // 1–7
    program: Program | null;
}

export interface NetrunnerSection {
    deck: DeckSlot[];
}
// #endregion