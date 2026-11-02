import {ArrowLeftIcon, EraserIcon, MinusIcon, PlusIcon} from "lucide-react";
import {TextField} from "@/components/common/EditableField";
import {
    MAX_ITEM_SPAN,
    clearItem,
    createBlankItem,
    getCyberwareGroup,
    layoutCells,
    resizeItem,
    type CyberwareCell,
    type CyberwareItem,
    type CyberwareKey,
} from "@/sheets/cyberpunkrRed/utils/cyberpunkRedCyberware";
import {CYBERWARE_LABELS} from "@/sheets/cyberpunkrRed/utils/cyberpunkRedCyberwareLabels";
import {useSheet} from "@/sheets/cyberpunkrRed/utils/cyberpunkRedSheetContext";
import {removeAt, replaceAt} from "@/utils/list";
import {SlotCount} from "@/sheets/cyberpunkrRed/components/cyberpunkRedCyberwareGroupCard";

const pad = (value: number) => String(value).padStart(2, "0");

// Numero dello slot, o intervallo se l'impianto ne occupa più di uno
const slotNumber = (start: number, span: number) => (span > 1 ? `${pad(start)}·${pad(start + span - 1)}` : pad(start));

interface CyberwareDetailProps {
    cyberwareKey: CyberwareKey;
    // Impianto aperto nel dettaglio; null mostra la lista degli slot della categoria
    itemIndex: number | null;
    onOpenItem: (index: number | null) => void;
    onClose: () => void;
}

// Pannello a destra della silhouette: lista degli slot della categoria, poi dettaglio di un impianto.
// Le modifiche sono sempre attive: si tocca un impianto e lo si cambia lì.
const CyberwareDetail = ({cyberwareKey, itemIndex, onOpenItem, onClose}: CyberwareDetailProps) => {
    const {sheet, update} = useSheet();
    const group = getCyberwareGroup(sheet.cyberware, cyberwareKey);
    const label = CYBERWARE_LABELS[cyberwareKey];
    const {cells} = group;

    const setCells = (next: CyberwareCell[]) =>
        update((s) => ({...s, cyberware: {...s.cyberware, [cyberwareKey]: {...s.cyberware[cyberwareKey], cells: next}}}));

    const setInstalled = (installed: boolean) =>
        update((s) => ({...s, cyberware: {...s.cyberware, [cyberwareKey]: {...s.cyberware[cyberwareKey], installed}}}));

    const item = itemIndex !== null ? cells[itemIndex] : null;

    if (itemIndex !== null && item) {
        const start = layoutCells(cells, group.base)[itemIndex].start;

        const patch = (values: Partial<CyberwareItem>) => setCells(replaceAt(cells, itemIndex, {...item, ...values}));

        const setSpan = (span: number) => {
            const resized = resizeItem(cells, itemIndex, span);
            setCells(resized.cells);
            onOpenItem(resized.index);
        };

        const clear = () => {
            setCells(clearItem(cells, itemIndex));
            onOpenItem(null);
        };

        return (
            <>
                <header className="cw-panel-head">
                    <h3 className="cw-panel-title">{item.name || "Senza nome"}</h3>
                    <button type="button" className="cw-button" onClick={() => onOpenItem(null)}>
                        <ArrowLeftIcon size={14} aria-hidden="true"/> Elenco
                    </button>
                </header>

                <div className="cw-panel-body scrollbar-cpr" key={`${cyberwareKey}-${itemIndex}`}>
                    <p className="cw-meta">
                        {label} · slot {slotNumber(start, item.span)}
                        {item.span > 1 && ` · occupa ${item.span} slot`}
                    </p>

                    <div className="cw-fields">
                        {item.image && <img className="cw-item-image" src={item.image} alt={item.name}/>}
                        <TextField 
                            label="Nome" 
                            value={item.name} 
                            onChange={(name) => patch({name})}
                        />

                        <TextField 
                            label="Data" 
                            value={item.date}
                            onChange={(date) => patch({date})}
                        />

                        <TextField 
                            label="Descrizione" 
                            value={item.description} 
                            multiline
                            placeholder="Info varie sull'impianto" 
                            onChange={(description) => patch({description})}
                        />

                        <TextField 
                            label="URL immagine" 
                            value={item.image ?? ""} 
                            placeholder="https://..."
                            onChange={(image) => patch({image: image || undefined})}
                        />

                        <div className="grid gap-1">
                            <span className="fieldLabelClass">Slot occupati</span>
                            <div className="cw-stepper">
                                <button 
                                    type="button" 
                                    className="cw-button" 
                                    aria-label="Meno slot"
                                    disabled={item.span <= 1} 
                                    onClick={() => setSpan(item.span - 1)}
                                >
                                    <MinusIcon size={14} aria-hidden="true"/>
                                </button>

                                <strong aria-live="polite">{item.span}</strong>
                                <button 
                                    type="button" 
                                    className="cw-button" 
                                    aria-label="Più slot"
                                    disabled={item.span >= MAX_ITEM_SPAN} 
                                    onClick={() => setSpan(item.span + 1)}
                                >
                                    <PlusIcon size={14} aria-hidden="true"/>
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="cw-panel-foot">
                        <button type="button" className="cw-button cw-button--danger" onClick={clear}>
                            <EraserIcon size={14} aria-hidden="true"/> Svuota slot
                        </button>
                    </div>
                </div>
            </>
        );
    }

    const install = (index: number) => {
        setCells(replaceAt<CyberwareCell>(cells, index, createBlankItem()));
        onOpenItem(index);
    };

    return (
        <>
            <header className="cw-panel-head">
                {group.needsBase && (
                    <input
                        type="checkbox"
                        className="cw-panel-check"
                        aria-label="Componente base installato"
                        title="Componente base installato"
                        checked={group.installed}
                        onChange={(event) => setInstalled(event.target.checked)}
                    />
                )}
                <h3 className="cw-panel-title">{label}</h3>
                <span className="cw-count">
                    {group.locked ? "base non installata" : <SlotCount group={group}/>}
                </span>

                <button type="button" className="cw-button" onClick={onClose}>
                    <ArrowLeftIcon size={14} aria-hidden="true"/> Corpo
                </button>
            </header>

            <div className="cw-panel-body scrollbar-cpr" key={cyberwareKey}>
                {group.locked && (
                    <p className="cw-notice">Spunta la casella per installare il componente base e sbloccare gli slot.</p>
                )}

                {cells.length === 0 ? (
                    <p className="cw-notice">Nessuno slot previsto dalle regole: aggiungine uno per ogni impianto.</p>
                ) : (
                    <>
                        <div className="cw-row cw-row--head" aria-hidden="true">
                            <span>Slot</span>
                            <span>Impianto</span>
                            <span>Data</span>
                        </div>

                        <div className="cw-rows" data-locked={group.locked}>
                            {layoutCells(cells, group.base).map(({index, item: cell, start, span, extra}) =>
                                cell ? (
                                    <button 
                                        key={index} 
                                        type="button" 
                                        className="cw-row cw-row--item" 
                                        data-extra={extra}
                                        onClick={() => onOpenItem(index)}
                                    >
                                        <span className="cw-slot-number">{slotNumber(start, span)}</span>
                                        <span>
                                            <b>{cell.name || "Senza nome"}</b>
                                            {span > 1 && <span className="cw-tag">{span} slot</span>}
                                            {extra && <span className="cw-tag cw-tag--extra">extra</span>}
                                        </span>

                                        <span className="cw-date">{cell.date || "—"}<i aria-hidden="true">›</i></span>
                                    </button>
                                ) : (
                                    <div key={index} className="cw-row" data-extra={extra}>
                                        <span className="cw-slot-number">{slotNumber(start, span)}</span>
                                        <span className="cw-free">
                                            Slot libero
                                            {extra && <span className="cw-tag cw-tag--extra">extra</span>}
                                        </span>

                                        <span className="cw-row-actions">
                                            <button type="button" className="cw-link" onClick={() => install(index)}>Installa</button>
                                            {extra && (
                                                <button type="button" className="cw-link" onClick={() => setCells(removeAt(cells, index))}>
                                                    Rimuovi slot
                                                </button>
                                            )}
                                        </span>
                                    </div>
                                )
                            )}
                        </div>
                    </>
                )}

                <button type="button" className="cw-add" disabled={group.locked} onClick={() => setCells([...cells, null])}>
                    <PlusIcon size={14} aria-hidden="true"/> Aggiungi slot
                </button>
            </div>
        </>
    );
};
export default CyberwareDetail;
