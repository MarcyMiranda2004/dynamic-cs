import {useState} from 'react'
import {fieldLabelClass, inputClass} from './ui'

// Dato semplice che si modifica direttamente a schermo, come su una scheda cartacea:
// un click trasforma il valore in un input; Invio, Esc o un click fuori lo chiudono.
// Lettura e modifica hanno la stessa scatola (stessa altezza, bordo inferiore trasparente a riposo):
// passando da una all'altra nulla si sposta.

// Frecce dei campi numerici nascoste: il numero resta centrato nel suo riquadro
const NO_SPINNER =
    '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none'

interface ClickValueProps {
    value: string | number
    inputType: 'text' | 'number'
    onCommit: (raw: string) => void
    ariaLabel: string
    placeholder?: string
    centered?: boolean
    // Stile del valore, uguale in lettura e in modifica (es. dimensione del carattere)
    className?: string
}

const ClickValue = ({value, inputType, onCommit, ariaLabel, placeholder, centered = false, className = ''}: ClickValueProps) => {
    const [editing, setEditing] = useState(false)
    const align = centered ? 'text-center' : 'text-left'

    // Il bottone resta sempre nel layout (invisibile in modifica) e l'input gli si sovrappone: la scatola
    // è per forza la stessa nei due stati, qualunque sia il font o il comportamento dell'input del browser
    return (
        <div className="relative w-full min-w-0">
            <button
                type="button"
                onClick={() => setEditing(true)}
                aria-label={`${ariaLabel}: modifica`}
                aria-hidden={editing}
                tabIndex={editing ? -1 : 0}
                title={String(value)}
                className={`block min-h-9 max-sm:min-h-11 w-full min-w-0 cursor-text overflow-hidden border-0 border-b border-transparent bg-transparent px-1 py-1.5 text-ellipsis whitespace-nowrap text-inherit hover:bg-ui-accent/10 focus-visible:bg-ui-accent/10 focus-visible:outline-none ${align} ${className} ${editing ? 'invisible' : ''}`}
            >
                {value === '' ? '—' : value}
            </button>

            {editing && (
                <input
                    autoFocus
                    className={`${inputClass} ${align} ${inputType === 'number' ? NO_SPINNER : ''} absolute inset-0 h-full ${className}`}
                    type={inputType}
                    inputMode={inputType === 'number' ? 'numeric' : undefined}
                    aria-label={ariaLabel}
                    placeholder={placeholder}
                    value={value}
                    onFocus={(event) => event.target.select()}
                    onChange={(event) => onCommit(event.target.value)}
                    onBlur={() => setEditing(false)}
                    onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === 'Escape') event.currentTarget.blur()
                    }}
                />
            )}
        </div>
    )
}

interface ClickTextProps {
    value: string
    onChange: (value: string) => void
    ariaLabel: string
    placeholder?: string
    centered?: boolean
    className?: string
}

export const ClickText = ({value, onChange, ...props}: ClickTextProps) => (
    <ClickValue value={value} inputType="text" onCommit={onChange} {...props}/>
)

interface ClickNumberProps {
    value: number
    onChange: (value: number) => void
    ariaLabel: string
    centered?: boolean
    className?: string
}

export const ClickNumber = ({value, onChange, ...props}: ClickNumberProps) => (
    <ClickValue value={value} inputType="number" onCommit={(raw) => onChange(Number(raw) || 0)} {...props}/>
)

// Versioni con etichetta sopra, per le griglie di campi (anagrafica, salute...)
export const InlineTextField = ({label, ...props}: Omit<ClickTextProps, 'ariaLabel'> & {label: string}) => (
    <div className="grid min-w-0 content-start gap-1">
        <span className={fieldLabelClass}>{label}</span>
        <ClickText ariaLabel={label} {...props}/>
    </div>
)

export const InlineNumberField = ({label, ...props}: Omit<ClickNumberProps, 'ariaLabel'> & {label: string}) => (
    <div className="grid min-w-0 content-start gap-1">
        <span className={fieldLabelClass}>{label}</span>
        <ClickNumber ariaLabel={label} {...props}/>
    </div>
)
