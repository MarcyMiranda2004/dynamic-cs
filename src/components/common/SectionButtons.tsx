import {Pencil, Plus} from 'lucide-react'
import {compactButtonClass} from './ui'

// Bottoni per l'angolo in alto a destra di una sezione

export const EditButton = ({onClick, label = 'Modifica'}: {onClick: () => void; label?: string}) => (
    <button type="button" onClick={onClick} className={compactButtonClass}>
        <Pencil size={14} aria-hidden="true"/> {label}
    </button>
)

export const AddButton = ({onClick, label = 'Aggiungi'}: {onClick: () => void; label?: string}) => (
    <button type="button" onClick={onClick} className={compactButtonClass}>
        <Plus size={14} aria-hidden="true"/> {label}
    </button>
)
