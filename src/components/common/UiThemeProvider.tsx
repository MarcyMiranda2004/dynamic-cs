import type {ReactNode} from 'react'
import {UiThemeContext} from '@/components/common/uiTheme'

interface UiThemeProviderProps {
    theme: string;
    children: ReactNode;
};

// Racchiude una scheda: la classe del tema imposta i token ui-* per tutti i componenti comuni al suo interno
const UiThemeProvider = ({theme, children}: UiThemeProviderProps) => (
    <UiThemeContext value={theme}>
        <div className={`contents ${theme}`}>
            {children}
        </div>
    </UiThemeContext>
);
export default UiThemeProvider;
