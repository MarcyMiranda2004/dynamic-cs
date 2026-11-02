import type {CSSProperties, MouseEvent} from "react";
import {CheckIcon} from "lucide-react";
import {layoutCells, type CyberwareGroup} from "@/sheets/cyberpunkrRed/utils/cyberpunkRedCyberware";
import {CYBERWARE_LABELS} from "@/sheets/cyberpunkrRed/utils/cyberpunkRedCyberwareLabels";

// Contatore degli slot: usati/totali e, in ambra, quanti sono stati aggiunti oltre a quelli delle regole
export const SlotCount = ({group}: {group: CyberwareGroup}) => {
    if (group.locked || group.total === 0) return null;
    const extra = group.total - group.base;

    return (
        <>
            {group.used}/{group.total}
            {extra > 0 && <b> +{extra}</b>}
        </>
    );
};

export type CyberwareSide = "left" | "right" | "aside";

interface CyberwareGroupCardProps {
    group: CyberwareGroup;
    compact: boolean;
    side: CyberwareSide;
    row: number;
    highlighted: boolean;
    onOpen: () => void;
    onOpenItem: (index: number) => void;
    onHover: (hovered: boolean) => void;
}

// Gruppo-tabella dei cyberware
const CyberwareGroupCard = ({group, compact, side, row, highlighted, onOpen, onOpenItem, onHover}: CyberwareGroupCardProps) => {
    const label = CYBERWARE_LABELS[group.key];
    const slots = layoutCells(group.cells, group.base);

    const openItem = (index: number) => (event: MouseEvent) => {
        event.stopPropagation();
        onOpenItem(index);
    };

    const shared = {
        "data-side": side,
        "data-row": row,
        "data-locked": group.locked,
        "data-highlighted": highlighted,
        onClick: onOpen,
        onMouseEnter: () => onHover(true),
        onMouseLeave: () => onHover(false),
    };

    if (compact) {
        return (
            <div className="cw-group cw-group--compact" {...shared}>
                <div className="cw-group-title">
                    <button type="button" className="cw-title-button">{label}</button>
                    <span className="cw-count">
                        {group.locked ? "non installato" : <SlotCount group={group}/>}
                    </span>
                </div>

                <div className="cw-cells">
                    {slots.length === 0 && <i className="cw-cell cw-cell--extra cw-cell--plus" title="Nessuno slot: aggiungine">+</i>}
                    {slots.map(({index, item, span, extra}) => {
                        const className = `cw-cell${item ? " cw-cell--on" : ""}${extra ? " cw-cell--extra" : ""}`;
                        const style = {"--span": span} as CSSProperties;
                        
                        if (!item) return <i key={index} className={className} style={style} title="Slot libero"/>;

                        const name = item.name || "Senza nome";
                        return (
                            <button key={index} type="button" className={className} style={style} title={name}
                                    aria-label={name} onClick={openItem(index)}>
                                {item.image ? <img className="cw-cell-image" src={item.image} alt=""/> : name.charAt(0)}
                            </button>
                        );
                    })}
                </div>
            </div>
        );
    }

    const filled = slots.filter((slot) => slot.item);

    return (
        <div className={`cw-group cw-group--table${filled.length === 0 ? " cw-group--empty" : ""}`} {...shared}>
            <div className="cw-table-head">
                {group.needsBase && (
                    <span className="cw-check" data-on={group.installed} aria-hidden="true">
                        {group.installed && <CheckIcon size={9} strokeWidth={4}/>}
                    </span>
                )}
                <button type="button" className="cw-title-button cw-table-title">{label}</button>
                <span className="cw-count"><SlotCount group={group}/></span>
            </div>

            {filled.map(({index, item, span, extra}) => (
                <button key={index} type="button" className="cw-table-row" data-extra={extra} onClick={openItem(index)}>
                    <span>{item?.name || "Senza nome"}</span>
                    {span > 1 && <small>×{span}</small>}
                </button>
            ))}
        </div>
    );
};
export default CyberwareGroupCard;
