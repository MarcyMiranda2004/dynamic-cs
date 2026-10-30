import {useState} from 'react'
import Modal from '@/components/common/Modal'
import PreviewField from '@/components/common/PreviewField'
import {TextField} from '@/components/common/EditableField'

interface DetailFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    clampClassName?: string;
};

// Testo lungo: nella scheda mostra solo l'inizio. Cliccare il campo apre il testo completo, modificabile, in un modale
const DetailField = ({label, value, onChange, clampClassName}: DetailFieldProps) => {
    const [open, setOpen] = useState(false);

    return (
        <div className="grid min-w-0 content-start gap-1">
            <button type="button" onClick={() => setOpen(true)} aria-label={`${label}: apri e modifica`}
                    className="rowButtonClass grid min-w-0 content-start py-0.5 text-inherit">
                <PreviewField label={label} value={value} clampClassName={clampClassName}/>
            </button>

            {open && (
                <Modal title={label} onClose={() => setOpen(false)}>
                    <TextField label={label} value={value} multiline onChange={onChange}/>
                </Modal>
            )}
        </div>
    );
};
export default DetailField;
