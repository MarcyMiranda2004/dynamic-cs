import type {BaseSheet} from "../../types/sheet";
import type {NetrunnerSection} from "./program";

// #region Statistiche
export interface Stats {
    int: number;   // INT
    ref: number;   // RIF (Riflessi)
    dex: number;   // DES (Destrezza)
    tech: number;  // TEC (Tecnica)
    cool: number;  // CAR (Carisma)
    will: number;  // VOL (Volontà)
    luck: number;  // FOR (Fortuna)
    move: number;  // VEL (Velocità)
    body: number;  // FIS (Fisico)
    emp: number;   // EMP (Empatia)
}

export type StatKey = keyof Stats;

export const STAT_LABELS: Record<StatKey, string> = {
    int: "INT",
    ref: "RIF",
    dex: "DES",
    tech: "TEC",
    cool: "CAR",
    will: "VOL",
    luck: "FOR",
    move: "VEL",
    body: "FIS",
    emp: "EMP",
};
// #endregion

// #region Abilità
export interface SkillValue {
    level: number;               // LIV
    stat: number;                // STAT: valore dell'attributo collegato
    base: number;                // BASE: level + stat
    specializations?: string[];  // sottovoci (es. Casa, Streetslang)
}

// Catalogo delle abilità: chiave in inglese, etichetta in italiano
export const SKILL_DEFS = {
    // #region Abilità artistiche
    music: {label: "Musica", stat: "tech", group: "artistic", slots: 2},
    acting: {label: "Recitare", stat: "cool", group: "artistic"},
    // #endregion

    // #region Abilità di attenzione
    concentration: {label: "Concentrazione", stat: "will", group: "attention"},
    lipReading: {label: "Leggere le Labbra", stat: "int", group: "attention"},
    hideAndSearch: {label: "Nascondere/Trovare Oggetti", stat: "int", group: "attention"},
    perception: {label: "Percezione", stat: "int", group: "attention"},
    tracking: {label: "Seguire Tracce", stat: "int", group: "attention"},
    // #endregion

    // #region Combattimento a distanza
    heavyWeapons: {label: "Armi Pesanti", stat: "ref", group: "ranged", multiplier: 2},
    shoulderArms: {label: "Armi a Spalla", stat: "ref", group: "ranged"},
    autofire: {label: "Fuoco Automatico", stat: "ref", group: "ranged", multiplier: 2},
    handgun: {label: "Pistole", stat: "ref", group: "ranged"},
    bow: {label: "Tiro con l'Arco", stat: "ref", group: "ranged"},
    // #endregion

    // #region Combattimento ravvicinato
    meleeWeapons: {label: "Armi da Mischia", stat: "dex", group: "melee"},
    martialArts: {label: "Arti Marziali", stat: "dex", group: "melee", multiplier: 2},
    evasion: {label: "Elusione", stat: "dex", group: "melee"},
    brawling: {label: "Rissa", stat: "dex", group: "melee"},
    // #endregion

    // #region Abilità di controllo
    riding: {label: "Cavalcare", stat: "ref", group: "control"},
    drive: {label: "Guidare", stat: "ref", group: "control"},
    aircraftPilot: {label: "Pilotare Aeromobili", stat: "ref", group: "control", multiplier: 2},
    boatPilot: {label: "Pilotare Imbarcazioni", stat: "ref", group: "control"},
    // #endregion

    // #region Abilità fisiche
    athletics: {label: "Atletica", stat: "dex", group: "physical"},
    contortionism: {label: "Contorsionismo", stat: "dex", group: "physical"},
    dance: {label: "Danza", stat: "dex", group: "physical"},
    stealth: {label: "Furtività", stat: "dex", group: "physical"},
    resistTorture: {label: "Resistere a Tortura/Droghe", stat: "will", group: "physical"},
    endurance: {label: "Tempra", stat: "will", group: "physical"},
    // #endregion

    // #region Abilità d'istruzione
    animalHandling: {label: "Allevamento", stat: "int", group: "education"},
    archivist: {label: "Archivistica", stat: "int", group: "education"},
    bureaucracy: {label: "Burocrazia", stat: "int", group: "education"},
    business: {label: "Business", stat: "int", group: "education"},
    composition: {label: "Comporre", stat: "int", group: "education"},
    streetKnowledge: {label: "Conoscenza della Zona", stat: "int", group: "education", slots: 3},
    accounting: {label: "Contabilità", stat: "int", group: "education"},
    criminology: {label: "Criminologia", stat: "int", group: "education"},
    cryptography: {label: "Crittografia", stat: "int", group: "education"},
    deduction: {label: "Deduzione", stat: "int", group: "education"},
    gambling: {label: "Gioco d'Azzardo", stat: "int", group: "education"},
    education: {label: "Istruzione", stat: "int", group: "education"},
    language: {label: "Linguaggio", stat: "int", group: "education", slots: 3},
    science: {label: "Scienza", stat: "int", group: "education", slots: 2},
    survival: {label: "Survivalismo", stat: "int", group: "education"},
    tactics: {label: "Tattica", stat: "int", group: "education"},
    // #endregion

    // #region Abilità sociali
    trading: {label: "Commercio", stat: "cool", group: "social"},
    conversation: {label: "Conversazione", stat: "emp", group: "social"},
    bribery: {label: "Corrompere", stat: "cool", group: "social"},
    personalCare: {label: "Cura della Persona", stat: "cool", group: "social"},
    wardrobeAndStyle: {label: "Guardaroba e Stile", stat: "cool", group: "social"},
    interrogation: {label: "Interrogatorio", stat: "cool", group: "social"},
    persuasion: {label: "Persuasione", stat: "cool", group: "social"},
    cunning: {label: "Scaltrezza", stat: "cool", group: "social"},
    sensitivity: {label: "Sensibilità", stat: "emp", group: "social"},
    // #endregion

    // #region Abilità tecniche
    fineArts: {label: "Belle Arti", stat: "tech", group: "technical"},
    pickpocket: {label: "Borseggiare", stat: "tech", group: "technical"},
    cybertech: {label: "Cybertecnologia", stat: "tech", group: "technical"},
    demolition: {label: "Demolizioni", stat: "tech", group: "technical", multiplier: 2},
    electronicsSecurity: {label: "Elettronica e Sicurezza", stat: "tech", group: "technical", multiplier: 2},
    forgery: {label: "Falsificare", stat: "tech", group: "technical"},
    photography: {label: "Fotografia", stat: "tech", group: "technical"},
    paramedic: {label: "Paramedico", stat: "tech", group: "technical", multiplier: 2},
    firstAid: {label: "Pronto Soccorso", stat: "tech", group: "technical"},
    lockpicking: {label: "Scassinare", stat: "tech", group: "technical"},
    aircraftTech: {label: "Tecnologia degli Aeromobili", stat: "tech", group: "technical"},
    weaponsTech: {label: "Tecnologia delle Armi", stat: "tech", group: "technical"},
    basicTech: {label: "Tecnologia di Base", stat: "tech", group: "technical"},
    boatTech: {label: "Tecnologia delle Imbarcazioni", stat: "tech", group: "technical"},
    groundVehicleTech: {label: "Tecnologia dei Veicoli Terrestri", stat: "tech", group: "technical"},
    // #endregion
} as const;

export type SkillKey = keyof typeof SKILL_DEFS;
export type Skills = Record<SkillKey, SkillValue>;
// #endregion

// #region Personaggio e salute
export interface CharacterInfo {
    playerName: string; // Nome del giocatore
    alias: string;
    tag: string;
    role: string; // Ruolo
    roleAbility: {name: string; rank: number};  // Capacità di Ruolo
    reputation: {
        points: number; // Reputazione
        reasons: string; // Motivi della Reputazione
    };
    improvementPoints: number; // Punti Miglioramento
    notes: string;
    portraitUrl: string;       // URL dell'immagine del personaggio (ritratto)
}

export interface Health {
    currentHitPoints: number;   // Punti Ferita attuali
    maxHitPoints: number;       // PF_Max
    seriouslyWounded: number;   // Ferito Gravemente
    deathSave: number;          // Tiro della Morte
    currentHumanity: number;    // Umanità attuale
    maxHumanity: number;        // Umanità_Max
    criticalInjuries: string;   // Ferite Critiche
    dependencies: string;       // Dipendenze
}
// #endregion

// #region Armi e armature
export interface ArmorSlot {
    armorValue: number;   // PA
    penalty: number;      // Penalità: applicata a RIF, DES e VEL
}

export interface Armor {
    head: ArmorSlot;     // Testa
    body: ArmorSlot;     // Corpo
    shield: ArmorSlot;   // Scudo
}

export interface Weapon {
    name: string;        // Arma
    damage: string;      // DAN, es. "2d6"
    shots: string;       // Colpi
    rof: string;         // CF, Cadenza di Fuoco
    ammo: string;        // Munizioni, es. "12 / 24"
    notes: string;       // Note
}
// #endregion

// #region Background
// Amico o storia d'amore: nome, legame con il personaggio e dettaglio libero
export interface Relation {
    name: string;     // Nome
    bond: string;     // Legame
    details: string;  // Dettaglio
}

export interface Enemy {
    who: string;           // Chi?
    why: string;           // Perché?
    canTrigger: string;    // Cosa Può Scatenarti Contro?
    whatHappens: string;   // Cosa Accadrà?
}

export interface Background {
    originCulture: string;       // Cultura di Origine
    personality: string;         // Personalità
    clothingStyle: string;       // Stile di Abbigliamento
    hairstyle: string;           // Taglio di Capelli
    valuesMost: string;          // A Cosa Dai Più Valore?
    providesForOthers: string;   // Cosa Provi per gli Altri?
    personCaresMost: string;     // Persona a Cui Tieni di Più
    objectCaresMost: string;     // Oggetto a Cui Tieni di Più
    familyBackground: string;    // Background Familiare
    childhood: string;           // La Tua Infanzia
    familyCrisis: string;        // Crisi Familiare
    lifeGoal: string;            // Scopo nella Vita
    friends: Relation[];         // Amici
    tragicLoveStories: Relation[]; // Tragiche Storie d'Amore
    enemies: Enemy[];            // Nemici (4 righe)
    fashion: string;             // Moda
    housing: string;             // Alloggio
    rent: string;                // Affitto
    lifestyle: string;           // Stile di Vita
    roleBackground: RoleBackgroundField[]; // Background di Ruolo: campi etichetta/valore
    description: string;         // Descrizione libera del personaggio
}

// Campo del background di ruolo (TIPO, PARTNER, POSTAZIONE...). Il set è estendibile.
export interface RoleBackgroundField {
    label: string;
    value: string;
}
// #endregion

// #region Equipaggiamento
export interface EquipmentItem {
    item: string;          // Equipaggiamento
    description: string;   // Descrizione mostrata al click
    notes: string;         // Note
    image?: string;        // URL immagine opzionale
}

export interface Equipment {
    items: EquipmentItem[];
    money: number;       // Denaro
}
// #endregion

// #region Cyberware
export interface CyberwareItem {
    name: string;
    date: string;         // Data
    description: string;  // Info varie mostrate nel dettaglio
}

// Slot con componente base (es. Cyberocchio): la casella indica l'installazione
export interface CyberwareSlot {
    installed: boolean;
    components: CyberwareItem[];
}

// Categorie senza componente base (Implanti, Fashionware, Borgware)
export interface CyberwareCategory {
    components: CyberwareItem[];
}

// Chiavi delle slot con componente base (la casella di installazione)
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

export interface CyberwareSection {
    cyberAudioSystem: CyberwareSlot;       // Sistema Cyberudito, 3 righe
    rightCyberEye: CyberwareSlot;          // Cyberocchio Dx, 3 righe
    leftCyberEye: CyberwareSlot;           // Cyberocchio Sx, 3 righe
    neuralLink: CyberwareSlot;             // Collegamento Neurale, 5 righe
    rightCyberArm: CyberwareSlot;          // Cyberbraccio Dx, 4 righe
    leftCyberArm: CyberwareSlot;           // Cyberbraccio Sx, 4 righe
    rightCyberLeg: CyberwareSlot;          // Cybergamba Dx, 3 righe
    leftCyberLeg: CyberwareSlot;           // Cybergamba Sx, 3 righe
    internalImplants: CyberwareCategory;   // Implanti Interni, 6 righe
    externalImplants: CyberwareCategory;   // Implanti Esterni, 7 righe
    fashionware: CyberwareCategory;        // Fashionware, 7 righe
    borgware: CyberwareCategory;           // Borgware, 7 righe
}
// #endregion

// #region Scheda completa
export interface CyberpunkRedCharacterSheetSchema extends BaseSheet {
    gameSystem: "Cyberpunk Red";
    character: CharacterInfo;
    stats: Stats;
    statsBoost: Partial<Stats>;
    skills: Skills;
    health: Health;
    armor: Armor;
    weapons: Weapon[];
    background: Background;
    equipment: Equipment;
    cyberware: CyberwareSection;
    netrunner: NetrunnerSection;
}
// #endregion