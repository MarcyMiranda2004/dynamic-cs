export interface BaseSheet {
    version: number;
    id: string;
    gameSystem: string;
    createdAt: string;
    lastUpdateAt: string;
}

// Campo con etichetta e valore, a elenco estendibile dall'utente (background di ruolo, moda...)
export interface LabeledField {
    label: string;
    value: string;
}
