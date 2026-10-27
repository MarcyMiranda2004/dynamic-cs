import type {LabeledField} from "../../types/sheet";
import {createEmptyCells} from "./cyberware";
import {
    SKILL_DEFS,
    type CyberpunkRedCharacterSheetSchema,
    type SkillKey,
    type Skills,
} from "./CyberpunkRedCharacterSheetSchema";

export type Sheet = CyberpunkRedCharacterSheetSchema;

// Campi di default del background di ruolo: l'utente può aggiungerne altri
export const DEFAULT_ROLE_FIELDS: LabeledField[] = [
    {label: "Tipo", value: ""},
    {label: "Partner", value: ""},
    {label: "Postazione", value: ""},
    {label: "Clienti", value: ""},
    {label: "Programmi", value: ""},
    {label: "Chi mi ha preso di mira", value: ""},
];

// Campi di default della moda: l'utente può aggiungerne altri
export const DEFAULT_FASHION_FIELDS: LabeledField[] = [
    {label: "Sopra", value: ""},
    {label: "Sotto", value: ""},
    {label: "Giacca", value: ""},
    {label: "Occhiali", value: ""},
    {label: "Cappello", value: ""},
    {label: "Gioielli", value: ""},
    {label: "Altri accessori", value: ""},
];

// STAT e BASE delle abilità dipendono dalle statistiche: vanno ricalcolate a ogni modifica
export const withDerivedSkills = (sheet: Sheet): Sheet => {
    const skills = Object.fromEntries(
        (Object.keys(SKILL_DEFS) as SkillKey[]).map((key) => {
            const current = sheet.skills[key];
            const stat = sheet.stats[SKILL_DEFS[key].stat];
            return [key, {...current, stat, base: current.level + stat}];
        })
    ) as Skills;

    return {...sheet, skills};
};

export const createEmptySheet = (): Sheet => {
    const now = new Date().toISOString();
    const skills = Object.fromEntries(
        (Object.keys(SKILL_DEFS) as SkillKey[]).map((key) => [key, {level: 0, stat: 0, base: 0}])
    ) as Skills;

    return withDerivedSkills({
        version: 1,
        id: crypto.randomUUID(),
        gameSystem: "Cyberpunk Red",
        createdAt: now,
        lastUpdateAt: now,
        character: {
            playerName: "",
            alias: "",
            tag: "",
            role: "",
            roleAbility: {name: "", rank: 0},
            reputation: {points: 0, reasons: ""},
            improvementPoints: 0,
            notes: "",
            portraitUrl: "",
        },
        stats: {int: 0, ref: 0, dex: 0, tech: 0, cool: 0, will: 0, luck: 0, move: 0, body: 0, emp: 0},
        statsBoost: {},
        skills,
        health: {
            currentHitPoints: 0,
            maxHitPoints: 0,
            seriouslyWounded: 0,
            deathSave: 0,
            currentHumanity: 0,
            maxHumanity: 0,
            criticalInjuries: "",
            dependencies: "",
        },
        armor: {
            head: {name: "", armorValue: 0, penalty: 0},
            body: {name: "", armorValue: 0, penalty: 0},
            shield: {name: "", armorValue: 0, penalty: 0},
        },
        weapons: [],
        background: {
            originCulture: "",
            personality: "",
            clothingStyle: "",
            hairstyle: "",
            valuesMost: "",
            providesForOthers: "",
            personCaresMost: "",
            objectCaresMost: "",
            familyBackground: "",
            childhood: "",
            familyCrisis: "",
            lifeGoal: "",
            friends: [],
            tragicLoveStories: [],
            enemies: [],
            housing: "",
            rent: "",
            lifestyle: "",
            description: "",
            roleBackground: DEFAULT_ROLE_FIELDS.map((field) => ({...field})),
        },
        appearance: {
            fashion: DEFAULT_FASHION_FIELDS.map((field) => ({...field})),
            physicalDescription: "",
        },
        equipment: {items: [], money: 0},
        // Ogni categoria parte con gli slot previsti dalle regole; l'utente può aggiungerne altri
        cyberware: {
            cyberAudioSystem: {installed: false, cells: createEmptyCells("cyberAudioSystem")},
            rightCyberEye: {installed: false, cells: createEmptyCells("rightCyberEye")},
            leftCyberEye: {installed: false, cells: createEmptyCells("leftCyberEye")},
            neuralLink: {installed: false, cells: createEmptyCells("neuralLink")},
            rightCyberArm: {installed: false, cells: createEmptyCells("rightCyberArm")},
            leftCyberArm: {installed: false, cells: createEmptyCells("leftCyberArm")},
            rightCyberLeg: {installed: false, cells: createEmptyCells("rightCyberLeg")},
            leftCyberLeg: {installed: false, cells: createEmptyCells("leftCyberLeg")},
            internalImplants: {cells: createEmptyCells("internalImplants")},
            externalImplants: {cells: createEmptyCells("externalImplants")},
            fashionware: {cells: createEmptyCells("fashionware")},
            borgware: {cells: createEmptyCells("borgware")},
        },
        // Il Cyberdeck base ha 7 slot; l'utente può aggiungerne altri
        netrunner: {
            deck: Array.from({length: 7}, (_, index) => ({slot: index + 1, program: null})),
        },
    });
};
