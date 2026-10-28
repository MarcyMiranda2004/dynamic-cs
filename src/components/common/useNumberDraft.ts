import {useState, type ChangeEvent} from 'react'

// Campo numerico con un testo proprio mentre è in modifica: il vuoto resta vuoto e lo zero
// si riscrive solo a fine modifica. Il valore numerico va comunque aggiornato a ogni tasto.
export const useNumberDraft = (value: number, onChange: (value: number) => void) => {
    // null = non in modifica: il campo mostra il valore salvato
    const [draft, setDraft] = useState<string | null>(null);

    return {
        value: draft ?? String(value),
        onFocus: () => setDraft(String(value)),
        onBlur: () => setDraft(null),
        onChange: (event: ChangeEvent<HTMLInputElement>) => {
            setDraft(event.target.value)
            onChange(Number(event.target.value) || 0)
        },
    };
};
