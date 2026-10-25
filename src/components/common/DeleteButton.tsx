import {Trash2} from 'lucide-react'
import {buttonClass, dangerButtonClass} from './ui'

// Bottone di eliminazione usato nei footer dei modali
const DeleteButton = ({label, onClick}: {label: string; onClick: () => void}) => (
    <button type="button" onClick={onClick} className={`${buttonClass} ${dangerButtonClass}`}>
        <Trash2 size={16} aria-hidden="true" className="inline-block align-text-bottom"/> {label}
    </button>
)
export default DeleteButton
