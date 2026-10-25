import type {CyberwareSlotKey} from "./CyberpunkRedCharacterSheetSchema";

// Ogni zona del corpo apre gli elementi di uno o più slot del cyberware.
// Le orecchie condividono lo slot del sistema cyberudito; il cervello è il collegamento neurale.
export type BodyZoneId =
    | "brain"
    | "left-eye"
    | "right-eye"
    | "left-ear"
    | "right-ear"
    | "right-arm"
    | "left-arm"
    | "right-leg"
    | "left-leg";

export const BODY_ZONES: {id: BodyZoneId; label: string; slots: CyberwareSlotKey[]}[] = [
    {id: "brain", label: "Cervello · Collegamento neurale", slots: ["neuralLink"]},
    {id: "right-eye", label: "Cyberocchio destro", slots: ["rightCyberEye"]},
    {id: "left-eye", label: "Cyberocchio sinistro", slots: ["leftCyberEye"]},
    {id: "right-ear", label: "Orecchio destro · Sistema cyberudito", slots: ["cyberAudioSystem"]},
    {id: "left-ear", label: "Orecchio sinistro · Sistema cyberudito", slots: ["cyberAudioSystem"]},
    {id: "right-arm", label: "Cyberbraccio destro", slots: ["rightCyberArm"]},
    {id: "left-arm", label: "Cyberbraccio sinistro", slots: ["leftCyberArm"]},
    {id: "right-leg", label: "Cybergamba destra", slots: ["rightCyberLeg"]},
    {id: "left-leg", label: "Cybergamba sinistra", slots: ["leftCyberLeg"]},
];
