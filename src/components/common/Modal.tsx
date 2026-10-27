import {Children, useCallback, useEffect, useRef, useState, type ReactNode} from 'react'
import {createPortal} from 'react-dom'
import {X} from 'lucide-react'

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
        <div
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
                className={`relative flex max-h-[min(85svh,760px)] ${wide ? 'w-[min(860px,100%)]' : 'w-[min(640px,100%)]'} animate-modal-in flex-col border-2 border-cpr-red bg-cpr-ink font-mono text-left text-cpr-ink-fg shadow-[0_0_0_1px_#5a1116,0_0_24px_rgb(215_38_46/0.35)] outline-none [clip-path:polygon(16px_0,100%_0,100%_calc(100%-16px),calc(100%-16px)_100%,0_100%,0_16px)] before:pointer-events-none before:absolute before:inset-0 before:content-[''] before:bg-[repeating-linear-gradient(to_bottom,rgb(255_255_255/0.03)_0_1px,transparent_1px_3px)] motion-reduce:animate-none`}
            >
                <header className="flex items-center justify-between gap-3 border-b border-[#5a1116] px-3.5 py-2.5">
                    <h2 className="m-0 text-base font-bold tracking-widest text-cpr-glow uppercase [overflow-wrap:anywhere] [text-shadow:0_0_8px_rgb(255_90_96/0.6)]">
                        &gt; {title}
                    </h2>
                    <button
                        type="button"
                        onClick={requestClose}
                        aria-label="Chiudi"
                        className="grid min-h-11 min-w-11 cursor-pointer place-items-center border border-[#5a1116] hover:border-cpr-glow hover:text-cpr-glow focus-visible:border-cpr-glow focus-visible:text-cpr-glow focus-visible:outline-none"
                    >
                        <X size={16} aria-hidden="true"/>
                    </button>
                </header>

                <div key={viewKey} className="grid min-h-0 gap-3 overflow-y-auto p-3.5">
                    {/* Ogni riga compare con un leggero ritardo, come l'output di un terminale */}
                    {Children.toArray(children).map((child, index) => (
                        <div
                            key={index}
                            className="animate-term-line motion-reduce:animate-none"
                            style={{animationDelay: `${Math.min(index, 7) * 40}ms`}}
                        >
                            {child}
                        </div>
                    ))}
                </div>

                {footer && (
                    <footer className="flex flex-wrap justify-between gap-2 border-t border-[#5a1116] px-3.5 py-2.5">{footer}</footer>
                )}
            </div>
        </div>,
        document.body
    )
}
export default Modal
