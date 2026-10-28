import {Children, useCallback, useEffect, useRef, useState, type ReactNode} from 'react'
import {createPortal} from 'react-dom'
import {X} from 'lucide-react'
import {uiColorVars, useUiTheme} from './uiTheme'

const CLOSE_DELAY_MS = 180

interface ModalProps {
    title: string
    onClose: () => void
    children: ReactNode
    footer?: ReactNode
    // Cambiando viewKey il contenuto si ridisegna con l'animazione di comparsa
    viewKey?: string
    // Per i modali con molti campi in griglia a due colonne
    wide?: boolean
}

const Modal = ({title, onClose, children, footer, viewKey, wide = false}: ModalProps) => {
    const [closing, setClosing] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)
    const theme = useUiTheme()
    const style = theme.modal ?? {}

    // Il genitore passa onClose come funzione nuova a ogni render: la leggiamo da un ref,
    // altrimenti gli effetti ripartirebbero a ogni tasto e il focus tornerebbe sul pannello
    const onCloseRef = useRef(onClose)
    useEffect(() => {
        onCloseRef.current = onClose
    })

    const requestClose = useCallback(() => {
        setClosing(true)
        window.setTimeout(() => onCloseRef.current(), CLOSE_DELAY_MS)
    }, [])

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') requestClose()
        }
        const previousOverflow = document.body.style.overflow

        document.addEventListener('keydown', onKeyDown)
        document.body.style.overflow = 'hidden'
        panelRef.current?.focus()

        return () => {
            document.removeEventListener('keydown', onKeyDown)
            document.body.style.overflow = previousOverflow
        }
    }, [requestClose])

    return createPortal(
        // Il modale sta in document.body, fuori dalla scheda: riceve colori e stile dal tema tramite il contesto
        <div
            style={uiColorVars(theme)}
            className={`fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 ${closing ? 'animate-fade-out' : 'animate-fade-in'}`}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) requestClose()
            }}
        >
            <div
                ref={panelRef}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                tabIndex={-1}
                className={`relative flex max-h-[min(85svh,760px)] ${wide ? 'w-[min(860px,100%)]' : 'w-[min(640px,100%)]'} flex-col border-2 border-ui-accent bg-ui-overlay text-left text-ui-overlay-fg outline-none ${style.panelClassName ?? ''}`}
            >
                <header className="flex items-center justify-between gap-3 border-b border-ui-overlay-line px-3.5 py-2.5">
                    <h2 className={`m-0 text-base font-bold tracking-widest text-ui-accent-glow uppercase [overflow-wrap:anywhere] ${style.titleClassName ?? ''}`}>
                        {style.titlePrefix}{title}
                    </h2>
                    <button
                        type="button"
                        onClick={requestClose}
                        aria-label="Chiudi"
                        className="grid min-h-11 min-w-11 cursor-pointer place-items-center border border-ui-overlay-line hover:border-ui-accent-glow hover:text-ui-accent-glow focus-visible:border-ui-accent-glow focus-visible:text-ui-accent-glow focus-visible:outline-none"
                    >
                        <X size={16} aria-hidden="true"/>
                    </button>
                </header>

                <div key={viewKey} className="grid min-h-0 gap-3 overflow-y-auto p-3.5">
                    {Children.toArray(children).map((child, index) => (
                        <div
                            key={index}
                            className={style.lineClassName}
                            style={{animationDelay: `${Math.min(index, 7) * 40}ms`}}
                        >
                            {child}
                        </div>
                    ))}
                </div>

                {footer && (
                    <footer className="flex flex-wrap justify-between gap-2 border-t border-ui-overlay-line px-3.5 py-2.5">{footer}</footer>
                )}
            </div>
        </div>,
        document.body
    )
}
export default Modal
