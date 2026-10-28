import {Trash2Icon} from 'lucide-react'

// Bottone di eliminazione usato nei footer dei modali
const DeleteButton = ({label, onClick}: {label: string; onClick: () => void}) => (
    <button type="button" onClick={onClick} className="buttonClass dangerButtonClass">
        <Trash2Icon size={16} aria-hidden="true" className="inline-block align-text-bottom"/> {label}
    </button>
);
export default DeleteButton;
