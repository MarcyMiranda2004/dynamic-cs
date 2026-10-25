// Metadati comuni a tutti i giochi: nessun dato di personaggio qui
export interface BaseSheet {
    version: number;
    id: string;
    gameSystem: string;
    createdAt: string;
    lastUpdateAt: string;
}
