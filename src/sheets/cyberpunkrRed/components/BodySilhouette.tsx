import type {KeyboardEvent} from "react";
import {BODY_PATH, BODY_VIEWBOX} from "../bodyOutline";
import type {CyberwareSlotKey} from "../CyberpunkRedCharacterSheetSchema";
import {useSheet} from "../SheetContext";
import {BODY_ZONES, type BodyZoneId} from "../bodyZones";

// Asse di simmetria della figura (x del centro del corpo nel viewBox 329 × 758)
const MIRROR_X = 331.1;

type Point = [number, number];

// Bordo di braccio e gamba di destra del personaggio (lato sinistro dell'immagine), ricavato dalla silhouette
const RIGHT_ARM: Point[] = [
    [82, 100], [50, 100], [100, 100], [100, 205], [100, 200], [100, 300], [100, 300], [80, 360], [80, 350],
    [80, 380], [80, 380], [80, 370], [65, 360], [90, 400], [80, 500], [40, 500], [20, 500], [0, 400],
    [40, 340], [30, 350], [40, 340], [40, 340], [40, 340], [40, 300], [40, 300], [40, 300], [40, 280],
    [50, 250], [60, 220], [60, 180], [60, 200], [60, 200],
];

const RIGHT_LEG: Point[] = [
    [80, 390], [100, 480], [100, 480], [100, 500], [100, 550], [100, 540], [100, 650], [100, 680], [100, 680],
    [100, 700], [100, 700], [80, 780], [180, 760], [120, 780], [160, 720], [140, 750], [180, 750], [140, 680],
    [180, 620], [180, 600], [180, 550], [160, 480], [160, 480], [165, 390],
];

const mirror = (points: Point[]): Point[] => points.map(([x, y]) => [MIRROR_X - x, y]);
const toPoints = (points: Point[]) => points.map(([x, y]) => `${x},${y}`).join(" ");

// Forme non poligonali: cervello, orecchie e occhi
const BRAIN = {cx: 165.5, cy: 28, rx: 20, ry: 10};
const EAR_RIGHT = {cx: 128, cy: 72, rx: 12, ry: 15};
const EYE_RIGHT = {cx: 151, cy: 58, r: 7};

const mirrorX = (shape: {cx: number}) => ({...shape, cx: MIRROR_X - shape.cx});

// Le zone sono trasparenti finché non servono: si accendono su hover e focus e quando contengono cyberware
const ZONE_CLASS =
    "cursor-pointer outline-none fill-transparent stroke-transparent transition-[fill,stroke] duration-200 " +
    "motion-reduce:transition-none data-[active=true]:fill-cpr-red/25 data-[active=true]:stroke-cpr-red/70 " +
    "hover:fill-cpr-red/40 hover:stroke-cpr-glow focus-visible:fill-cpr-red/40 focus-visible:stroke-cpr-glow " +
    "data-[selected=true]:!fill-cpr-red/60 data-[selected=true]:!stroke-cpr-glow";

const CLIP_ID = "cpr-body-clip";
// Il path è in unità 10× con asse Y invertito: stessa trasformazione per la figura e per il ritaglio
const BODY_TRANSFORM = "translate(0,758) scale(0.1,-0.1)";

interface BodySilhouetteProps {
    selected: BodyZoneId | null;
    onSelect: (zone: BodyZoneId) => void;
}

const BodySilhouette = ({selected, onSelect}: BodySilhouetteProps) => {
    const {sheet} = useSheet();

    const isActive = (zone: BodyZoneId) => {
        const slots: CyberwareSlotKey[] = BODY_ZONES.find((z) => z.id === zone)?.slots ?? [];
        return slots.some((key) => sheet.cyberware[key].installed || sheet.cyberware[key].components.length > 0);
    };

    const label = (zone: BodyZoneId) => BODY_ZONES.find((z) => z.id === zone)?.label ?? zone;

    // Proprietà comuni a ogni zona: accessibilità, stato e interazione
    const zoneProps = (zone: BodyZoneId) => ({
        role: "button" as const,
        tabIndex: 0,
        "aria-label": label(zone),
        "aria-pressed": selected === zone,
        "data-active": isActive(zone),
        "data-selected": selected === zone,
        clipPath: `url(#${CLIP_ID})`,
        onClick: () => onSelect(zone),
        onKeyDown: (event: KeyboardEvent<SVGElement>) => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onSelect(zone);
            }
        },
    });

    return (
        <svg
            viewBox={BODY_VIEWBOX}
            role="group"
            aria-label="Corpo: tocca una parte per il cyberware"
            className="mx-auto block h-auto w-full max-w-85"
        >
            <defs>
                <clipPath id={CLIP_ID}>
                    <path d={BODY_PATH} transform={BODY_TRANSFORM}/>
                </clipPath>
            </defs>

            <path d={BODY_PATH} transform={BODY_TRANSFORM} className="fill-[#4d494f] stroke-[#08060d]/50   stroke-[0.5]"/>

            {/* Cervello: calotta alta della testa */}
            <ellipse cx={BRAIN.cx} cy={BRAIN.cy} rx={BRAIN.rx} ry={BRAIN.ry} className={`${ZONE_CLASS} stroke-[1.5]`} {...zoneProps("brain")}>
                <title>{label("brain")}</title>
            </ellipse>

            {/* Orecchie: una per lato, sul bordo della testa */}
            <ellipse {...EAR_RIGHT} className={`${ZONE_CLASS} stroke-[1.5]`} {...zoneProps("right-ear")}>
                <title>{label("right-ear")}</title>
            </ellipse>
            <ellipse {...mirrorX(EAR_RIGHT)} cy={EAR_RIGHT.cy} className={`${ZONE_CLASS} stroke-[1.5]`} {...zoneProps("left-ear")}>
                <title>{label("left-ear")}</title>
            </ellipse>

            {/* Occhi: sopra il cervello, così il click sull'occhio vince su quello sulla calotta */}
            <circle {...EYE_RIGHT} className={`${ZONE_CLASS} stroke-2`} {...zoneProps("right-eye")}>
                <title>{label("right-eye")}</title>
            </circle>
            <circle {...mirrorX(EYE_RIGHT)} cy={EYE_RIGHT.cy} r={EYE_RIGHT.r} className={`${ZONE_CLASS} stroke-2`} {...zoneProps("left-eye")}>
                <title>{label("left-eye")}</title>
            </circle>

            {/* Arti: il lato sinistro dell'immagine è il braccio e la gamba destri del personaggio */}
            <polygon points={toPoints(RIGHT_ARM)} className={`${ZONE_CLASS} stroke-[1.5]`} {...zoneProps("right-arm")}>
                <title>{label("right-arm")}</title>
            </polygon>
            <polygon points={toPoints(mirror(RIGHT_ARM))} className={`${ZONE_CLASS} stroke-[1.5]`} {...zoneProps("left-arm")}>
                <title>{label("left-arm")}</title>
            </polygon>
            <polygon points={toPoints(RIGHT_LEG)} className={`${ZONE_CLASS} stroke-[1.5]`} {...zoneProps("right-leg")}>
                <title>{label("right-leg")}</title>
            </polygon>
            <polygon points={toPoints(mirror(RIGHT_LEG))} className={`${ZONE_CLASS} stroke-[1.5]`} {...zoneProps("left-leg")}>
                <title>{label("left-leg")}</title>
            </polygon>
        </svg>
    );
};
export default BodySilhouette;
