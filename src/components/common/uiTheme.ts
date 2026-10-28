import {createContext, useContext, type CSSProperties} from 'react'

// Tema dei componenti comuni. I componenti in components/common non conoscono nessuna scheda:
// usano solo i token ui-* (es. border-ui-accent) e ogni scheda fornisce i propri valori con UiThemeProvider.

export interface UiColors {
    accent: string        // Colore principale: bordi, titoli, bottoni
    accentGlow: string    // Variante accesa: hover, focus, titoli dei modali
    accentDeep: string    // Variante scura: azioni distruttive
    accentFg: string      // Testo sopra l'accento
    surface: string       // Fondo dei pannelli
    overlay: string       // Fondo dei modali
    overlayFg: string     // Testo dei modali
    overlayLine: string   // Linee e bordi interni dei modali
}

// Aspetto del modale oltre ai colori: forma, font, animazioni
export interface UiModalStyle {
    panelClassName?: string
    titleClassName?: string
    titlePrefix?: string
    // Classi di ogni riga di contenuto (es. animazione di comparsa)
    lineClassName?: string
}

export interface UiTheme {
    colors: UiColors
    modal?: UiModalStyle
}

// Valori neutri per le schede che non forniscono un tema
export const DEFAULT_UI_THEME: UiTheme = {
    colors: {
        accent: 'var(--accent)',
        accentGlow: 'var(--accent)',
        accentDeep: 'var(--accent)',
        accentFg: '#fff',
        surface: 'color-mix(in srgb, var(--bg) 94%, var(--accent) 6%)',
        overlay: '#1b1b1f',
        overlayFg: '#f3f4f6',
        overlayLine: 'color-mix(in srgb, var(--accent) 40%, black)',
    },
}

export const UiThemeContext = createContext<UiTheme>(DEFAULT_UI_THEME)

export const useUiTheme = (): UiTheme => useContext(UiThemeContext)

// Variabili CSS che i token ui-* leggono; applicate dal provider e dai modali (che stanno fuori dall'albero della scheda)
export const uiColorVars = ({colors}: UiTheme): CSSProperties =>
    ({
        '--color-ui-accent': colors.accent,
        '--color-ui-accent-glow': colors.accentGlow,
        '--color-ui-accent-deep': colors.accentDeep,
        '--color-ui-accent-fg': colors.accentFg,
        '--color-ui-surface': colors.surface,
        '--color-ui-overlay': colors.overlay,
        '--color-ui-overlay-fg': colors.overlayFg,
        '--color-ui-overlay-line': colors.overlayLine,
    }) as CSSProperties
