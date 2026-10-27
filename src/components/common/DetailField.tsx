import {useState} from 'react'
import Modal from './Modal'
import {TextField} from './EditableField'
import {fieldLabelClass, rowButtonClass, valueClass} from './ui'

interface DetailFieldProps {
    label: string
    value: string
    onChange: (value: string) => void
    editMode: boolean
}

// Testo lungo: in scheda mostra solo l'inizio. Cliccare il campo apre il testo completo (e la modifica) in un modale
const DetailField = ({label, value, onChange, editMode}: DetailFieldProps) => {
    const [open, setOpen] = useState(false)

    return (
        <div className="grid min-w-0 content-start gap-1">
            <button type="button" onClick={() => setOpen(true)} className={`${rowButtonClass} grid min-w-0 content-start gap-1 py-0.5`}>
                <span className={fieldLabelClass}>{label}</span>
                <span className={`${valueClass} line-clamp-3`}>{value || '—'}</span>
            </button>

            {open && (
                <Modal title={label} onClose={() => setOpen(false)}>
                    <TextField label={label} value={value} multiline editMode={editMode} onChange={onChange}/>
                </Modal>
            )}
        </div>
    )
}
export default DetailField
