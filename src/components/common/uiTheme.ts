import {createContext, useContext} from 'react'

// Nome della classe del tema della scheda (es. "ui-theme-cpr"): colori e stile stanno nei file CSS del tema.
// Il contesto serve solo al modale, che sta in document.body e quindi fuori dall'albero della scheda.
// Stringa vuota = tema di default (token ui-* in index.css).
export const UiThemeContext = createContext<string>('')

export const useUiTheme = (): string => useContext(UiThemeContext)
