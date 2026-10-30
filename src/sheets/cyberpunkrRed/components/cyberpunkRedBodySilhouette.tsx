import type {KeyboardEvent} from "react";
import {BODY_PATH, BODY_VIEWBOX} from "@/sheets/cyberpunkrRed/utils/cyberpunkRedBodyOutline";
import {getCyberwareGroup, type CyberwareKey} from "@/sheets/cyberpunkrRed/utils/cyberpunkRedCyberware";
import {useSheet} from "@/sheets/cyberpunkrRed/utils/cyberpunkRedSheetContext";
import {BODY_ZONES, type BodyZoneId} from "@/sheets/cyberpunkrRed/utils/cyberpunkRedBodyZones";

// Asse di simmetria della figura (x del centro del corpo nel viewBox 329 × 758)
const MIRROR_X = 331.1;

type Point = [number, number];

// Bordo di braccio e gamba di destra del personaggio (lato sinistro dell'immagine), ricavato dalla silhouette
const RIGHT_ARM: Point[] = [
    [82, 100], [50, 100], [105, 100], [100, 205], [100, 200], [100, 300], [100, 300], [80, 360], [80, 350],
    [80, 380], [80, 380], [80, 370], [65, 360], [90, 400], [80, 500], [40, 500], [20, 500], [0, 400],
    [40, 340], [30, 350], [40, 340], [40, 340], [40, 340], [40, 300], [40, 300], [40, 300], [40, 280],
    [50, 250], [60, 220], [60, 180], [60, 200], [60, 200],
];

const RIGHT_LEG: Point[] = [
    [80, 390], [100, 480], [100, 480], [100, 500], [100, 550], [100, 540], [100, 650], [100, 680], [100, 680],
    [100, 700], [100, 700], [80, 780], [180, 760], [120, 780], [160, 720], [140, 750], [180, 750], [140, 680],
    [180, 620], [180, 600], [180, 550], [160, 480], [160, 480], [165, 390],
];

const TORSO_LEFT: Point[] = [[100, 105], [105, 100], [95, 390]];

const mirror = (points: Point[]): Point[] => points.map(([x, y]) => [MIRROR_X - x, y]);
const TORSO: Point[] = [...TORSO_LEFT, ...mirror(TORSO_LEFT).reverse()];
const toPoints = (points: Point[]) => points.map(([x, y]) => `${x},${y}`).join(" ");

// Forme non poligonali: cervello, orecchie e occhi
const BRAIN = {cx: 165.5, cy: 28, rx: 20, ry: 10};
const EAR_RIGHT = {cx: 128, cy: 72, rx: 12, ry: 15};
const EYE_RIGHT = {cx: 151, cy: 58, r: 7};

const mirrorX = (shape: {cx: number}) => ({...shape, cx: MIRROR_X - shape.cx});

const CLIP_ID = "cpr-body-clip";
const GLASS_ID = "cpr-body-glass";

// Il path è in unità 10× con asse Y invertito: stessa trasformazione per la figura e per il ritaglio
const BODY_TRANSFORM = "translate(0,758) scale(0.1,-0.1)";

interface BodySilhouetteProps {
    selected: CyberwareKey | null;
    hovered: CyberwareKey | null;
    onSelect: (key: CyberwareKey) => void;
    onHover: (key: CyberwareKey | null) => void;
}

const BodySilhouette = ({selected, hovered, onSelect, onHover}: BodySilhouetteProps) => {
    const {sheet} = useSheet();

    const zoneKey = (zone: BodyZoneId) => BODY_ZONES.find((z) => z.id === zone)!.key;
    const label = (zone: BodyZoneId) => BODY_ZONES.find((z) => z.id === zone)?.label ?? zone;

    // La zona è piena se la sua categoria ha il componente base installato o almeno un impianto
    const hasCyberware = (key: CyberwareKey) => {
        const group = getCyberwareGroup(sheet.cyberware, key);
        return (group.needsBase && group.installed) || group.used > 0;
    };

    // Proprietà comuni a ogni zona: accessibilità, stato e interazione. Si seleziona la categoria intera.
    const zoneProps = (zone: BodyZoneId) => {
        const key = zoneKey(zone);
        
        return {
            className: "cw-zone",
            role: "button" as const,
            tabIndex: 0,
            "aria-label": label(zone),
            "aria-pressed": selected === key,
            "data-has": hasCyberware(key),
            "data-hover": hovered === key,
            "data-selected": selected === key,
            clipPath: `url(#${CLIP_ID})`,
            onClick: () => onSelect(key),
            onMouseEnter: () => onHover(key),
            onMouseLeave: () => onHover(null),
            onKeyDown: (event: KeyboardEvent<SVGElement>) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(key);
                }
            },
        };
    };

    return (
        <svg viewBox={BODY_VIEWBOX} role="group" aria-label="Corpo: scegli una parte per il cyberware">
            <defs>
                <linearGradient id={GLASS_ID} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="var(--color-cpr-glow, #ff5a60)" stopOpacity=".4"/>
                    <stop offset=".55" stopColor="var(--color-cpr-red, #d7262e)" stopOpacity=".17"/>
                    <stop offset="1" stopColor="var(--color-cpr-red-deep, #7a1116)" stopOpacity=".1"/>
                </linearGradient>

                <clipPath id={CLIP_ID}>
                    <path d={BODY_PATH} transform={BODY_TRANSFORM}/>
                </clipPath>
            </defs>

            {/* Il corpo resta sempre acceso: l'attenuazione riguarda solo le zone */}
            <path d={BODY_PATH} transform={BODY_TRANSFORM} className="cw-outline" fill={`url(#${GLASS_ID})`}/>

            <polygon points={toPoints(TORSO)} {...zoneProps("torso")}>
                <title>{label("torso")}</title>
            </polygon>

            {/* Arti: il lato sinistro dell'immagine è il braccio e la gamba destri del personaggio */}
            <polygon points={toPoints(RIGHT_ARM)} {...zoneProps("right-arm")}>
                <title>{label("right-arm")}</title>
            </polygon>

            <polygon points={toPoints(mirror(RIGHT_ARM))} {...zoneProps("left-arm")}>
                <title>{label("left-arm")}</title>
            </polygon>

            <polygon points={toPoints(RIGHT_LEG)} {...zoneProps("right-leg")}>
                <title>{label("right-leg")}</title>
            </polygon>

            <polygon points={toPoints(mirror(RIGHT_LEG))} {...zoneProps("left-leg")}>
                <title>{label("left-leg")}</title>
            </polygon>

            {/* Testa: cervello, orecchie e occhi sopra il resto, così il click sull'occhio vince su quello sulla calotta */}
            <ellipse {...BRAIN} {...zoneProps("brain")}>
                <title>{label("brain")}</title>
            </ellipse>

            <ellipse {...EAR_RIGHT} {...zoneProps("right-ear")}>
                <title>{label("right-ear")}</title>
            </ellipse>

            <ellipse {...mirrorX(EAR_RIGHT)} {...zoneProps("left-ear")}>
                <title>{label("left-ear")}</title>
            </ellipse>

            <circle {...EYE_RIGHT} {...zoneProps("right-eye")}>
                <title>{label("right-eye")}</title>
            </circle>

            <circle {...mirrorX(EYE_RIGHT)} {...zoneProps("left-eye")}>
                <title>{label("left-eye")}</title>
            </circle>
        </svg>
    );
};
export default BodySilhouette;
