import {Plus} from 'lucide-react'
import {buttonClass} from './ui'

export interface EntryItem {
    title: string
    // Dato breve mostrato a destra del titolo (es. il legame)
    meta?: string
    preview: string
}

interface EntryListProps {
    entries: EntryItem[]
    onOpen: (index: number) => void
    onAdd?: () => void
    addLabel?: string
    emptyLabel?: string
    // Classi del contenitore: di default una colonna; nel mosaico una griglia
    layoutClassName?: string
}

// Lista di voci con anteprima troncata: il click apre il dettaglio in un modale
const EntryList = ({
    entries,
    onOpen,
    onAdd,
    addLabel = 'Aggiungi',
    emptyLabel = 'Nessuna voce',
    layoutClassName = 'grid gap-2',
}: EntryListProps) => (
    <div className={layoutClassName}>
        {entries.length === 0 && <p className="m-0 opacity-70">{emptyLabel}</p>}

        {entries.map((entry, index) => (
            <button
                key={index}
                type="button"
                onClick={() => onOpen(index)}
                className="grid w-full min-h-9 max-sm:min-h-11 cursor-pointer content-start gap-1 border border-ui-accent/30 bg-[color-mix(in_srgb,currentColor_4%,transparent)] px-3 py-2 text-left hover:border-ui-accent focus-visible:border-ui-accent focus-visible:outline-none"
            >
                <span className="flex items-baseline justify-between gap-3">
                    <span className="font-bold [overflow-wrap:anywhere]">{entry.title || 'Senza nome'}</span>
                    {entry.meta && <span className="max-w-[45%] shrink-0 text-right text-[0.85em] opacity-75 [overflow-wrap:anywhere]">{entry.meta}</span>}
                </span>
                {entry.preview && (
                    <span className="line-clamp-3 text-[0.9em] opacity-75 [overflow-wrap:anywhere]">{entry.preview}</span>
                )}
            </button>
        ))}

        {onAdd && (
            <button type="button" onClick={onAdd} className={`${buttonClass} justify-self-start`}>
                <Plus size={16} aria-hidden="true" className="inline-block align-text-bottom"/> {addLabel}
            </button>
        )}
    </div>
)
export default EntryList
