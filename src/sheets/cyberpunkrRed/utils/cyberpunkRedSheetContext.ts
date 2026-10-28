import {createContext, useContext} from "react";
import type {Sheet} from "./cyberpunkRedSheetState";

// Ogni modifica passa da qui: le abilità derivate vengono ricalcolate in un solo punto
export type SheetUpdater = (change: (sheet: Sheet) => Sheet) => void;

export interface SheetContextValue {
    sheet: Sheet;
    update: SheetUpdater;
}

export const SheetContext = createContext<SheetContextValue | null>(null);

export const useSheet = (): SheetContextValue => {
    const context = useContext(SheetContext);
    if (!context) throw new Error("useSheet va usato dentro CyberpunkRedCharacterSheet");
    return context;
};
