import type {UiTheme} from "../../components/common/uiTheme";

// Colori e aspetto dei componenti comuni per la scheda Cyberpunk Red (token cpr-* in src/index.css)
export const CPR_UI_THEME: UiTheme = {
    colors: {
        accent: "var(--color-cpr-red)",
        accentGlow: "var(--color-cpr-glow)",
        accentDeep: "var(--color-cpr-red-deep)",
        accentFg: "#fff",
        surface: "var(--color-cpr-panel)",
        overlay: "var(--color-cpr-ink)",
        overlayFg: "var(--color-cpr-ink-fg)",
        overlayLine: "#5a1116",
    },
    // Modale da monitor: angoli smussati, righe di scansione, font a spaziatura fissa, accensione verticale e output a righe
    modal: {
        panelClassName:
            "font-mono animate-modal-in shadow-[0_0_0_1px_#5a1116,0_0_24px_rgb(215_38_46/0.35)] " +
            "[clip-path:polygon(16px_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%,0_16px)] " +
            "before:pointer-events-none before:absolute before:inset-0 before:content-[''] " +
            "before:bg-[repeating-linear-gradient(to_bottom,rgb(255_255_255/0.03)_0_1px,transparent_1px_3px)] " +
            "motion-reduce:animate-none",
        titleClassName: "[text-shadow:0_0_8px_rgb(255_90_96/0.6)]",
        titlePrefix: "> ",
        lineClassName: "animate-term-line motion-reduce:animate-none",
    },
};
