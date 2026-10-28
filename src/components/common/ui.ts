// Classi Tailwind riusate da più componenti. I colori sono token ui-* forniti dal tema della scheda (vedi uiTheme.ts)
// Su desktop l'altezza dei controlli è più compatta; su mobile resta 44px per il tocco (max-sm:min-h-11)

export const buttonClass =
    "min-h-9 max-sm:min-h-11 cursor-pointer border border-ui-accent bg-transparent px-3 py-1.5 tracking-wide " +
    "hover:bg-ui-accent hover:text-ui-accent-fg focus-visible:bg-ui-accent focus-visible:text-ui-accent-fg focus-visible:outline-none";

export const dangerButtonClass =
    "border-ui-accent-deep hover:bg-ui-accent-deep focus-visible:bg-ui-accent-deep";

export const inputClass =
    "min-h-9 max-sm:min-h-11 w-full rounded-none border-0 border-b border-current/35 bg-transparent px-1 py-1.5 " +
    "focus-visible:border-ui-accent focus-visible:shadow-[0_1px_0_0_var(--color-ui-accent)] focus-visible:outline-none";

export const fieldLabelClass = "text-[0.75em] font-bold uppercase tracking-widest opacity-70";

export const valueClass = "min-h-[1.4em] whitespace-pre-wrap [overflow-wrap:anywhere]";

export const tableClass = "grid border-2 border-ui-accent";

// Riga a colonne: --cols è definita dalla tabella; in mobile ogni riga diventa una card
export const rowClass =
    "grid min-h-9 max-sm:min-h-11 grid-cols-[var(--cols,1fr)] items-center gap-2 border-b border-ui-accent/25 px-2.5 py-1 " +
    "last:border-b-0 max-sm:grid-cols-[repeat(auto-fit,minmax(96px,1fr))] max-sm:px-3 max-sm:py-2.5 " +
    "max-sm:[&>:first-child]:col-span-full";

export const rowButtonClass =
    "w-full cursor-pointer border-x-0 border-t-0 bg-transparent text-left " +
    "hover:bg-ui-accent/12 focus-visible:bg-ui-accent/12 focus-visible:outline-none";

export const rowHeadClass =
    "grid min-h-9 grid-cols-[var(--cols,1fr)] items-center gap-2 bg-ui-accent px-2.5 text-[0.75em] font-bold " +
    "uppercase tracking-widest text-ui-accent-fg max-sm:hidden";

// Su mobile la cella mostra la propria etichetta (data-label) prima del valore
export const cellClass =
    "min-w-0 [overflow-wrap:anywhere] max-sm:before:mr-1.5 max-sm:before:text-[0.7em] max-sm:before:font-bold " +
    "max-sm:before:uppercase max-sm:before:tracking-widest max-sm:before:opacity-70 " +
    "max-sm:before:content-[attr(data-label)]";

export const panelTitleClass =
    "m-0 border-b border-ui-accent/35 pb-1 text-sm font-extrabold uppercase tracking-widest text-ui-accent";

// Bottone piccolo per l'angolo di una sezione (Aggiungi, Modifica)
export const compactButtonClass =
    "inline-flex min-h-7 max-sm:min-h-11 shrink-0 cursor-pointer items-center gap-1 border border-ui-accent bg-transparent px-2 py-0.5 " +
    "text-[0.8em] font-bold tracking-wide uppercase hover:bg-ui-accent hover:text-ui-accent-fg focus-visible:bg-ui-accent " +
    "focus-visible:text-ui-accent-fg focus-visible:outline-none aria-pressed:bg-ui-accent aria-pressed:text-ui-accent-fg";

export const sectionClass =
    "grid content-start gap-2 border-2 border-ui-accent bg-ui-surface p-2.5";
