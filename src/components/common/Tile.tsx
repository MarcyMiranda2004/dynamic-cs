import type {ReactNode} from 'react'
import PanelHeading from './PanelHeading'
import {sectionClass} from './ui'

interface TileProps {
    title?: string
    children: ReactNode
    // Bottoni in alto a destra (Aggiungi, Modifica)
    action?: ReactNode
    // Classi di posizionamento nella griglia a mosaico (es. md:col-span-2)
    className?: string
}

// Riquadro del mosaico: pannello con titolo e azioni opzionali
const Tile = ({title, children, action, className = ''}: TileProps) => (
    <section className={`${sectionClass} min-w-0 ${className}`}>
        {title && <PanelHeading title={title} action={action}/>}
        {children}
    </section>
)
export default Tile
