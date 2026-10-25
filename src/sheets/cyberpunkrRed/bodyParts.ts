export const HEAD_BODY_PARTS = ["head-general", "brain", "skull", "face", "left-eye", "right-eye", "left-ear", "right-ear", "nose", "mouth", "jaw", "throat"] as const;
export type HeadBodyParts = typeof HEAD_BODY_PARTS[number];

export const TORSO_BODY_PARTS = ["chest", "abdomen", "lower-back", "pelvis", "groin", "heart", "lungs"] as const;
export type TorsoBodyParts = typeof TORSO_BODY_PARTS[number];

export const FINGER_PARTS = ["thumb", "index", "middle", "ring", "pinky"] as const;
export type FingerParts = typeof FINGER_PARTS[number];

export const LEFT_ARM_PARTS = [
    "left-shoulder",
    "left-upper-arm",
    "left-elbow",
    "left-forearm",
    "left-wrist",
    "left-hand",
    "left-finger-thumb",
    "left-finger-index",
    "left-finger-middle",
    "left-finger-ring",
    "left-finger-pinky",
] as const;
export type LeftArmParts = typeof LEFT_ARM_PARTS[number];

export const RIGHT_ARM_PARTS = [
    "right-shoulder",
    "right-upper-arm",
    "right-elbow",
    "right-forearm",
    "right-wrist",
    "right-hand",
    "right-finger-thumb",
    "right-finger-index",
    "right-finger-middle",
    "right-finger-ring",
    "right-finger-pinky",
] as const;
export type RightArmParts = typeof RIGHT_ARM_PARTS[number];

export const LEFT_LEG_PARTS = [
    "left-hip",
    "left-thigh",
    "left-knee",
    "left-shin",
    "left-ankle",
    "left-foot",
    "left-toes",
] as const;
export type LeftLegParts = typeof LEFT_LEG_PARTS[number];

export const RIGHT_LEG_PARTS = [
    "right-hip",
    "right-thigh",
    "right-knee",
    "right-shin",
    "right-ankle",
    "right-foot",
    "right-toes",
] as const;
export type RightLegParts = typeof RIGHT_LEG_PARTS[number];

export const BASE_ZONES = ["head", "torso", "left-arm", "right-arm", "left-leg", "right-leg"] as const;
export type BaseZones = typeof BASE_ZONES[number];

export const ADVANCED_BODY_PARTS = [
    ...HEAD_BODY_PARTS,
    ...TORSO_BODY_PARTS,
    ...LEFT_ARM_PARTS,
    ...RIGHT_ARM_PARTS,
    ...LEFT_LEG_PARTS,
    ...RIGHT_LEG_PARTS,
] as const;
export type AdvancedBodyParts = typeof ADVANCED_BODY_PARTS[number];

export function baseZoneOf(part: AdvancedBodyParts): BaseZones {
    const inList = (list: readonly string[]) => list.includes(part);

    if (inList(HEAD_BODY_PARTS)) return 'head';
    if (inList(TORSO_BODY_PARTS)) return 'torso';
    if (inList(LEFT_ARM_PARTS)) return 'left-arm';
    if (inList(RIGHT_ARM_PARTS)) return 'right-arm';
    if (inList(LEFT_LEG_PARTS)) return 'left-leg';
    return 'right-leg';
}

// ---- Full body map: a list of installed cyberware per advanced part ----
export type BodyMap = Record<AdvancedBodyParts, string[]>;

export const createBodyMap = (): BodyMap =>
    ADVANCED_BODY_PARTS.reduce((map, part) => {
        map[part] = [];
        return map;
    }, {} as BodyMap);