import type {ReactNode} from 'react'
import {UiThemeContext, uiColorVars, type UiTheme} from './uiTheme'

interface UiThemeProviderProps {
    theme: UiTheme
    children: ReactNode
}

// Racchiude una scheda e le fornisce colori e stile dei componenti comuni
const UiThemeProvider = ({theme, children}: UiThemeProviderProps) => (
    <UiThemeContext value={theme}>
        <div className="contents" style={uiColorVars(theme)}>
            {children}
        </div>
    </UiThemeContext>
)
export default UiThemeProvider
