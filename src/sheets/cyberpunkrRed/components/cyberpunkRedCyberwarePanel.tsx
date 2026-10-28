import {useEffect, useRef, useState} from "react";
import {getCyberwareGroup, type CyberwareKey} from "../utils/cyberpunkRedCyberware";
import {useSheet} from "../utils/cyberpunkRedSheetContext";
import BodySilhouette from "./cyberpunkRedBodySilhouette";
import CyberwareDetail from "./cyberpunkRedCyberwareDetail";
import CyberwareGroupCard, {type CyberwareSide} from "./cyberpunkRedCyberwareGroupCard";
import "../style/cyberpunkRedCyberware.css";

// Posizione delle categorie nella vista totale, come sulla scheda cartacea: colonna a sinistra e a destra
// del corpo, e colonna laterale per i cyberware senza componente base. L'ordine è anche quello su schermi stretti.
const PLACEMENT: Record<CyberwareKey, {side: CyberwareSide; row: number}> = {
    neuralLink: {side: "left", row: 1},
    cyberAudioSystem: {side: "right", row: 1},
    rightCyberEye: {side: "left", row: 2},
    leftCyberEye: {side: "right", row: 2},
    rightCyberArm: {side: "left", row: 3},
    leftCyberArm: {side: "right", row: 3},
    rightCyberLeg: {side: "left", row: 4},
    leftCyberLeg: {side: "right", row: 4},
    internalImplants: {side: "aside", row: 1},
    externalImplants: {side: "aside", row: 2},
    fashionware: {side: "aside", row: 3},
    borgware: {side: "aside", row: 4},
};
const GROUP_KEYS = Object.keys(PLACEMENT) as CyberwareKey[];

// La modalità compatta è una preferenza del dispositivo, non della scheda
const COMPACT_STORAGE_KEY = "cpr.cyberware.compact";

const readCompact = () => {
    try {
        return localStorage.getItem(COMPACT_STORAGE_KEY) === "1";
    } catch {
        return false;
    }
};

const writeCompact = (compact: boolean) => {
    try {
        localStorage.setItem(COMPACT_STORAGE_KEY, compact ? "1" : "0");
    } catch {
        // Storage non disponibile: la preferenza vale solo per questa sessione
    }
};

const CyberwarePanel = () => {
    const {sheet} = useSheet();
    const [compact, setCompact] = useState(readCompact);
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<{key: CyberwareKey; item: number | null}>({key: "neuralLink", item: null});
    const [hovered, setHovered] = useState<CyberwareKey | null>(null);
    const stageRef = useRef<HTMLDivElement>(null);
    const figureRef = useRef<HTMLDivElement>(null);

    const open = (key: CyberwareKey, item: number | null = null) => {
        setView({key, item});
        setIsOpen(true);
    };

    useEffect(() => {
        const stage = stageRef.current;
        const figure = figureRef.current;

        if (!stage || !figure) return;

        const measure = () => {
            const center = figure.offsetLeft + figure.offsetWidth / 2;
            stage.style.setProperty("--cw-shift", `${stage.clientWidth * 0.2 - center}px`);
        };

        measure();
        const observer = new ResizeObserver(measure);
        observer.observe(stage);
        
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key !== "Escape") return;
            if (view.item !== null) setView((current) => ({...current, item: null}));
            else setIsOpen(false);
        };

        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, [isOpen, view.item]);

    const toggleCompact = (next: boolean) => {
        setCompact(next);
        writeCompact(next);
    };

    return (
        <section aria-label="Cyberware">
            <div ref={stageRef} className="cw" data-state={isOpen ? "open" : "hub"} data-mode={compact ? "compact" : "list"}>
                <label className="cw-mode" title="Attiva o disattiva la modalità compatta">
                    <span>Modalità compatta</span>
                    <input type="checkbox" checked={compact} onChange={(event) => toggleCompact(event.target.checked)}/>
                    <i className="cw-switch" aria-hidden="true"/>
                </label>

                <div className="cw-layout">
                    <div ref={figureRef} className="cw-figure">
                        <BodySilhouette
                            selected={isOpen ? view.key : null}
                            hovered={hovered}
                            onSelect={(key) => open(key)}
                            onHover={setHovered}
                        />
                    </div>

                    <div className="cw-groups" inert={isOpen}>
                        {GROUP_KEYS.map((key) => (
                            <CyberwareGroupCard
                                key={key}
                                group={getCyberwareGroup(sheet.cyberware, key)}
                                compact={compact}
                                side={PLACEMENT[key].side}
                                row={PLACEMENT[key].row}
                                highlighted={hovered === key}
                                onOpen={() => open(key)}
                                onOpenItem={(index) => open(key, index)}
                                onHover={(isHovered) => setHovered(isHovered ? key : null)}
                            />
                        ))}
                    </div>
                </div>

                <section className="cw-panel" aria-label="Dettaglio cyberware" inert={!isOpen}>
                    <CyberwareDetail
                        cyberwareKey={view.key}
                        itemIndex={view.item}
                        onOpenItem={(item) => setView((current) => ({...current, item}))}
                        onClose={() => setIsOpen(false)}
                    />
                </section>
            </div>

            <ul className="cw-legend">
                {compact ? (
                    <>
                        <li><i className="cw-key cw-key--free" role="img" aria-label="Slot libero" title="Slot libero"/></li>
                        <li><i className="cw-key cw-key--on" role="img" aria-label="Impianto installato (iniziale del nome)" title="Impianto installato (iniziale del nome)">A</i></li>
                        <li><i className="cw-key cw-key--free cw-key--extra" role="img" aria-label="Slot extra" title="Slot extra"/></li>
                        <li><i className="cw-key cw-key--free cw-key--locked" role="img" aria-label="Componente base non installato" title="Componente base non installato"/></li>
                    </>
                ) : (
                    <>
                        <li><b>+1</b> slot extra aggiunti</li>
                        <li><b>×2</b> impianto da 2 slot</li>
                        <li>casella spenta e tabella opaca = componente base non installato</li>
                    </>
                )}
            </ul>
        </section>
    );
};
export default CyberwarePanel;
