// Classi Tailwind riusate da più componenti. I colori cpr-* e le animazioni sono in src/index.css
// Su desktop l'altezza dei controlli è più compatta; su mobile resta 44px per il tocco (max-sm:min-h-11)

export const buttonClass =
    "min-h-9 max-sm:min-h-11 cursor-pointer border border-cpr-red bg-transparent px-3 py-1.5 tracking-wide " +
    "hover:bg-cpr-red hover:text-white focus-visible:bg-cpr-red focus-visible:text-white focus-visible:outline-none";

export const dangerButtonClass =
    "border-cpr-red-deep hover:bg-cpr-red-deep focus-visible:bg-cpr-red-deep";

export const inputClass =
    "min-h-9 max-sm:min-h-11 w-full rounded-none border-0 border-b border-current/35 bg-transparent px-1 py-1.5 " +
    "focus-visible:border-cpr-red focus-visible:shadow-[0_1px_0_0_var(--color-cpr-red)] focus-visible:outline-none";

export const fieldLabelClass = "text-[0.75em] font-bold uppercase tracking-widest opacity-70";

export const valueClass = "min-h-[1.4em] whitespace-pre-wrap [overflow-wrap:anywhere]";

export const tableClass = "grid border-2 border-cpr-red";

// Riga a colonne: --cols è definita dalla tabella; in mobile ogni riga diventa una card
export const rowClass =
    "grid min-h-9 max-sm:min-h-11 grid-cols-[var(--cols,1fr)] items-center gap-2 border-b border-cpr-red/25 px-2.5 py-1 " +
    "last:border-b-0 max-sm:grid-cols-[repeat(auto-fit,minmax(96px,1fr))] max-sm:px-3 max-sm:py-2.5 " +
    "max-sm:[&>:first-child]:col-span-full";

export const rowButtonClass =
    "w-full cursor-pointer border-x-0 border-t-0 bg-transparent text-left " +
    "hover:bg-cpr-red/12 focus-visible:bg-cpr-red/12 focus-visible:outline-none";

export const rowHeadClass =
    "grid min-h-9 grid-cols-[var(--cols,1fr)] items-center gap-2 bg-cpr-red px-2.5 text-[0.75em] font-bold " +
    "uppercase tracking-widest text-white max-sm:hidden";

// Su mobile la cella mostra la propria etichetta (data-label) prima del valore
export const cellClass =
    "min-w-0 [overflow-wrap:anywhere] max-sm:before:mr-1.5 max-sm:before:text-[0.7em] max-sm:before:font-bold " +
    "max-sm:before:uppercase max-sm:before:tracking-widest max-sm:before:opacity-70 " +
    "max-sm:before:content-[attr(data-label)]";

export const panelTitleClass =
    "m-0 border-b border-cpr-red/35 pb-1 text-sm font-extrabold uppercase tracking-widest text-cpr-red";

// I pannelli diventano tratteggiati quando la scheda è in modifica (vedi data-editing su .group/sheet)
export const sectionClass =
    "grid content-start gap-2 border-2 border-cpr-red bg-cpr-panel p-2.5 group-data-[editing=true]/sheet:border-dashed";
