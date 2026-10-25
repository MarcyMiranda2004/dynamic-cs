import type {CyberwareCategoryKey, CyberwareItem, CyberwareSlotKey} from "./CyberpunkRedCharacterSheetSchema";
import type {EntryItem} from "../../components/common/EntryList";

export type CyberwareKey = CyberwareSlotKey | CyberwareCategoryKey;

export const CYBERWARE_LABELS: Record<CyberwareKey, string> = {
    cyberAudioSystem: "Sistema cyberudito",
    rightCyberEye: "Cyberocchio destro",
    leftCyberEye: "Cyberocchio sinistro",
    neuralLink: "Collegamento neurale",
    rightCyberArm: "Cyberbraccio destro",
    leftCyberArm: "Cyberbraccio sinistro",
    rightCyberLeg: "Cybergamba destra",
    leftCyberLeg: "Cybergamba sinistra",
    internalImplants: "Implanti interni",
    externalImplants: "Implanti esterni",
    fashionware: "Fashionware",
    borgware: "Borgware",
};

export const toEntry = (item: CyberwareItem): EntryItem => ({
    title: item.name,
    preview: [item.date, item.description].filter(Boolean).join(" · "),
});
