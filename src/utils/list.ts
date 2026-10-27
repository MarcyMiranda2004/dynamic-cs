// Helper immutabili per liste, usati da tutte le schede
export const replaceAt = <T,>(list: T[], index: number, value: T): T[] =>
    list.map((item, i) => (i === index ? value : item))

export const removeAt = <T,>(list: T[], index: number): T[] =>
    list.filter((_, i) => i !== index)
