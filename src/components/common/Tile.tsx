import type {ReactNode} from 'react'
import PanelHeading from '@/components/common/PanelHeading'

interface TileProps {
    title?: string;
    children: ReactNode;
    action?: ReactNode;
    className?: string;
}

// Riquadro del mosaico: pannello con titolo e azioni opzionali
const Tile = ({title, children, action, className = ''}: TileProps) => (
    <section className={`sectionClass min-w-0 ${className}`}>
        {title && <PanelHeading title={title} action={action}/>}
        {children}
    </section>
);
export default Tile;
