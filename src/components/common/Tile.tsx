import type {ReactNode} from 'react'
import {panelTitleClass, sectionClass} from './ui'

interface TileProps {
    title?: string
    children: ReactNode
    // Classi di posizionamento nella griglia a mosaico (es. md:col-span-2)
    className?: string
}

// Riquadro del mosaico: pannello con titolo opzionale
const Tile = ({title, children, className = ''}: TileProps) => (
    <section className={`${sectionClass} min-w-0 ${className}`}>
        {title && <h3 className={panelTitleClass}>{title}</h3>}
        {children}
    </section>
)
export default Tile
