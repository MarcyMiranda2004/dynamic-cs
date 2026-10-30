import type {CyberwareKey} from "@/sheets/cyberpunkrRed/utils/cyberpunkRedCyberware";

export type BodyZoneId =
    | "brain"
    | "torso"
    | "left-eye"
    | "right-eye"
    | "left-ear"
    | "right-ear"
    | "right-arm"
    | "left-arm"
    | "right-leg"
    | "left-leg";

export const BODY_ZONES: {id: BodyZoneId; label: string; key: CyberwareKey}[] = [
    {id: "brain", label: "Cervello · Collegamento neurale", key: "neuralLink"},
    {id: "torso", label: "Torso · Impianti interni", key: "internalImplants"},
    {id: "right-eye", label: "Cyberocchio destro", key: "rightCyberEye"},
    {id: "left-eye", label: "Cyberocchio sinistro", key: "leftCyberEye"},
    {id: "right-ear", label: "Orecchio destro · Sistema cyberudito", key: "cyberAudioSystem"},
    {id: "left-ear", label: "Orecchio sinistro · Sistema cyberudito", key: "cyberAudioSystem"},
    {id: "right-arm", label: "Cyberbraccio destro", key: "rightCyberArm"},
    {id: "left-arm", label: "Cyberbraccio sinistro", key: "leftCyberArm"},
    {id: "right-leg", label: "Cybergamba destra", key: "rightCyberLeg"},
    {id: "left-leg", label: "Cybergamba sinistra", key: "leftCyberLeg"},
];
