// #region Cyberware
export interface CyberwareItem {
    name: string;
    date: string;         // Data
    description: string;  // Info varie mostrate nel dettaglio
    span: number;         // Slot occupati: 1 di base, alcuni impianti ne richiedono 2 o più
    image?: string;       // URL immagine opzionale: nei quadratini della modalità compatta sostituisce la lettera
}

// Uno slot: libero (null) oppure occupato da un impianto, che può estendersi su più slot
export type CyberwareCell = CyberwareItem | null;

// Categoria con componente base (es. Cyberocchio): la casella indica l'installazione e, finché manca, gli slot sono bloccati
export interface CyberwareSlot {
    installed: boolean;
    cells: CyberwareCell[];
}

// Categorie senza componente base (Impianti, Fashionware, Borgware)
export interface CyberwareCategory {
    cells: CyberwareCell[];
}

// Chiavi delle categorie con componente base (la casella di installazione)
export const CYBERWARE_SLOT_KEYS = [
    "cyberAudioSystem",
    "rightCyberEye",
    "leftCyberEye",
    "neuralLink",
    "rightCyberArm",
    "leftCyberArm",
    "rightCyberLeg",
    "leftCyberLeg",
] as const;
export type CyberwareSlotKey = (typeof CYBERWARE_SLOT_KEYS)[number];

// Chiavi delle categorie senza componente base
export const CYBERWARE_CATEGORY_KEYS = [
    "internalImplants",
    "externalImplants",
    "fashionware",
    "borgware",
] as const;
export type CyberwareCategoryKey = (typeof CYBERWARE_CATEGORY_KEYS)[number];

export type CyberwareKey = CyberwareSlotKey | CyberwareCategoryKey;

export interface CyberwareSection {
    cyberAudioSystem: CyberwareSlot;       // Sistema Cyberudito
    rightCyberEye: CyberwareSlot;          // Cyberocchio Dx
    leftCyberEye: CyberwareSlot;           // Cyberocchio Sx
    neuralLink: CyberwareSlot;             // Collegamento Neurale
    rightCyberArm: CyberwareSlot;          // Cyberbraccio Dx
    leftCyberArm: CyberwareSlot;           // Cyberbraccio Sx
    rightCyberLeg: CyberwareSlot;          // Cybergamba Dx
    leftCyberLeg: CyberwareSlot;           // Cybergamba Sx
    internalImplants: CyberwareCategory;   // Impianti Interni
    externalImplants: CyberwareCategory;   // Impianti Esterni
    fashionware: CyberwareCategory;        // Fashionware
    borgware: CyberwareCategory;           // Borgware
}

// Slot previsti dalle regole per ogni categoria; l'utente può aggiungerne altri. La Borgware non ne ha di fissi.
export const CYBERWARE_BASE_SLOTS: Record<CyberwareKey, number> = {
    cyberAudioSystem: 3,
    rightCyberEye: 3,
    leftCyberEye: 3,
    neuralLink: 5,
    rightCyberArm: 4,
    leftCyberArm: 4,
    rightCyberLeg: 4,
    leftCyberLeg: 4,
    internalImplants: 7,
    externalImplants: 7,
    fashionware: 7,
    borgware: 0,
};

// Un singolo impianto non può occupare più slot di quanti ne abbia la categoria più grande
export const MAX_ITEM_SPAN = 7;
// #endregion

// #region Helper
export const hasBaseComponent = (key: CyberwareKey): key is CyberwareSlotKey =>
    (CYBERWARE_SLOT_KEYS as readonly CyberwareKey[]).includes(key);

export const createEmptyCells = (key: CyberwareKey): CyberwareCell[] =>
    Array.from({length: CYBERWARE_BASE_SLOTS[key]}, () => null);

export const createBlankItem = (): CyberwareItem => ({name: "", date: "", description: "", span: 1});

// Riepilogo di una categoria: le sue celle e quanti slot sono previsti, usati e bloccati
export interface CyberwareGroup {
    key: CyberwareKey;
    base: number;
    cells: CyberwareCell[];
    needsBase: boolean;   // ha il componente base da installare
    installed: boolean;   // sempre vero per le categorie senza componente base
    locked: boolean;      // componente base mancante: slot bloccati
    total: number;        // slot totali, base più extra
    used: number;         // slot occupati da impianti
}

export const getCyberwareGroup = (cyberware: CyberwareSection, key: CyberwareKey): CyberwareGroup => {
    const entry = cyberware[key];
    const needsBase = hasBaseComponent(key);
    const installed = "installed" in entry ? entry.installed : true;

    return {
        key,
        base: CYBERWARE_BASE_SLOTS[key],
        cells: entry.cells,
        needsBase,
        installed,
        locked: needsBase && !installed,
        total: entry.cells.reduce((sum, cell) => sum + (cell?.span ?? 1), 0),
        used: entry.cells.reduce((sum, cell) => sum + (cell?.span ?? 0), 0),
    };
};

// Una cella con la posizione degli slot che occupa (numerati da 1) e se è oltre quelli previsti dalle regole
export interface CyberwareSlotView {
    index: number;
    item: CyberwareItem | null;
    start: number;
    span: number;
    extra: boolean;
}

export const layoutCells = (cells: CyberwareCell[], base: number): CyberwareSlotView[] => {
    let start = 1;
    return cells.map((item, index) => {
        const span = item?.span ?? 1;
        const view = {index, item, start, span, extra: start > base};
        start += span;
        return view;
    });
};

// Svuotare un impianto da più slot libera tutti i suoi slot, non ne lascia uno solo
export const clearItem = (cells: CyberwareCell[], index: number): CyberwareCell[] => {
    const span = cells[index]?.span ?? 1;
    return [...cells.slice(0, index), ...Array.from({length: span}, () => null), ...cells.slice(index + 1)];
};

// Cambia gli slot occupati da un impianto. Allargarlo consuma prima gli slot liberi dopo di lui, poi quelli prima;
// se non bastano, gli slot totali aumentano. Restringerlo restituisce gli slot liberati. Il nuovo indice può cambiare.
export const resizeItem = (
    cells: CyberwareCell[],
    index: number,
    span: number
): {cells: CyberwareCell[]; index: number} => {
    const item = cells[index];
    if (!item || span === item.span) return {cells, index};

    const resized = cells.map((cell, i) => (i === index ? {...item, span} : cell));
    const delta = span - item.span;

    if (delta < 0) {
        const freed = Array.from({length: -delta}, () => null);
        return {cells: [...resized.slice(0, index + 1), ...freed, ...resized.slice(index + 1)], index};
    }

    const after = resized.map((_, i) => i).filter((i) => i > index);
    const before = resized.map((_, i) => i).filter((i) => i < index).reverse();
    const consumed = new Set([...after, ...before].filter((i) => resized[i] === null).slice(0, delta));

    return {
        cells: resized.filter((_, i) => !consumed.has(i)),
        index: index - [...consumed].filter((i) => i < index).length,
    };
};
// #endregion
