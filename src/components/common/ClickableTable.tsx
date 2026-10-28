import type {CSSProperties, ReactNode} from 'react'

export interface TableColumn<T> {
    header: string;
    label?: string;
    render: (row: T) => ReactNode;
    className?: string;
};

interface ClickableTableProps<T> {
    columns: TableColumn<T>[];
    rows: T[];
    onOpen: (index: number) => void;
    emptyLabel: string;
    widths?: string;
    hideHeader?: boolean;
};

// Tabella a righe cliccabili: una riga per elemento, un click apre il dettaglio. Su schermi stretti ogni riga diventa una card
function ClickableTable<T>({columns, rows, onOpen, emptyLabel, widths, hideHeader = false}: ClickableTableProps<T>) {
    const cols = widths ?? `repeat(${columns.length}, minmax(0, 1fr))`;

    return (
        <div className="tableClass" style={{'--cols': cols} as CSSProperties}>
            {!hideHeader && (
                <div className="rowHeadClass">
                    {columns.map((column) => (
                        <span key={column.header}>{column.header}</span>
                    ))}
                </div>
            )}

            {rows.length === 0 && <p className="rowClass m-0 opacity-70" style={{'--cols': '1fr'} as CSSProperties}>{emptyLabel}</p>}

            {rows.map((row, index) => (
                <button key={index} type="button" onClick={() => onOpen(index)} className="rowClass rowButtonClass">
                    {columns.map((column, columnIndex) => (
                        <span
                            key={column.header}
                            className={`cellClass ${column.className ?? ''}`}
                            data-label={columnIndex === 0 ? undefined : column.label ?? column.header}
                        >
                            {columnIndex === 0 ? <strong>{column.render(row)}</strong> : column.render(row)}
                        </span>
                    ))}
                </button>
            ))}
        </div>
    );
};
export default ClickableTable;
