import type {ReactNode} from 'react'

interface PanelHeadingProps {
    title: string
    // Bottone nell'angolo in alto a destra della sezione (es. Aggiungi, Modifica)
    action?: ReactNode
    level?: 'h2' | 'h3'
}

// Titolo di sezione con un'azione a destra
const PanelHeading = ({title, action, level: Level = 'h3'}: PanelHeadingProps) => (
    <div className="flex items-center justify-between gap-2 border-b border-ui-accent/35 pb-1">
        <Level className="m-0 text-sm font-extrabold tracking-widest text-ui-accent uppercase">{title}</Level>
        {action}
    </div>
)
export default PanelHeading
