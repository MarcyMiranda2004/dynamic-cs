import {cellClass, fieldLabelClass, inputClass, valueClass} from './ui'

// Campi che in sola lettura mostrano il valore e in modifica diventano input

interface TextFieldProps {
    label: string
    value: string
    onChange: (value: string) => void
    editMode: boolean
    multiline?: boolean
    placeholder?: string
}

export const TextField = ({label, value, onChange, editMode, multiline = false, placeholder}: TextFieldProps) => (
    <label className="grid min-w-0 gap-1">
        <span className={fieldLabelClass}>{label}</span>
        {editMode ? (
            multiline ? (
                <textarea
                    className={`${inputClass} min-h-20 max-sm:min-h-24 resize-y`}
                    value={value}
                    placeholder={placeholder}
                    onChange={(event) => onChange(event.target.value)}
                />
            ) : (
                <input
                    className={inputClass}
                    type="text"
                    value={value}
                    placeholder={placeholder}
                    onChange={(event) => onChange(event.target.value)}
                />
            )
        ) : (
            <span className={valueClass}>{value || '—'}</span>
        )}
    </label>
)

interface NumberFieldProps {
    label: string
    value: number
    onChange: (value: number) => void
    editMode: boolean
}

export const NumberField = ({label, value, onChange, editMode}: NumberFieldProps) => (
    <label className="grid min-w-0 gap-1">
        <span className={fieldLabelClass}>{label}</span>
        {editMode ? (
            <input
                className={inputClass}
                type="number"
                inputMode="numeric"
                value={value}
                onChange={(event) => onChange(Number(event.target.value) || 0)}
            />
        ) : (
            <span className={valueClass}>{value}</span>
        )}
    </label>
)

// Versione compatta per le celle di tabella: in mobile mostra l'etichetta accanto al valore
interface InlineNumberProps {
    label: string
    value: number
    onChange: (value: number) => void
    editMode: boolean
}

export const InlineNumber = ({label, value, onChange, editMode}: InlineNumberProps) => (
    <span className={cellClass} data-label={label}>
        {editMode ? (
            <input
                className={`${inputClass} min-h-9`}
                type="number"
                inputMode="numeric"
                aria-label={label}
                value={value}
                onChange={(event) => onChange(Number(event.target.value) || 0)}
            />
        ) : (
            value
        )}
    </span>
)
