import {PencilIcon, PlusIcon} from 'lucide-react'

// Bottoni per l'angolo in alto a destra di una sezione

export const EditButton = ({onClick, label = 'Modifica'}: {onClick: () => void; label?: string}) => (
    <button type="button" onClick={onClick} className="compactButtonClass">
        <PencilIcon size={14} aria-hidden="true"/> {label}
    </button>
);

export const AddButton = ({onClick, label = 'Aggiungi'}: {onClick: () => void; label?: string}) => (
    <button type="button" onClick={onClick} className="compactButtonClass">
        <PlusIcon size={14} aria-hidden="true"/> {label}
    </button>
);
