import {useState} from "react";
import {Plus, X} from "lucide-react";
import DeleteButton from "./DeleteButton";
import DetailField from "./DetailField";
import Modal from "./Modal";
import PreviewField from "./PreviewField";
import {AddButton, EditButton} from "./SectionButtons";
import {TextField} from "./EditableField";
import Tile from "./Tile";
import {buttonClass, dangerButtonClass, inputClass, rowButtonClass} from "./ui";
import type {LabeledField} from "../../types/sheet";
import {removeAt, replaceAt} from "../../utils/list";

// Sezioni a campi riusabili da qualsiasi scheda (background, aspetto...). Ogni campo si apre da solo in un modale;
// il bottone "Modifica" in alto a destra apre un modale con tutta la sezione, in griglia a due colonne.

export interface SectionField {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

interface FieldsSectionProps {
    title: string;
    fields: SectionField[];
    className?: string;
    // Colonne delle anteprime nella card
    columnsClassName?: string;
    // Righe di anteprima per campo prima del troncamento
    clampClassName?: string;
}

// Campi fissi: etichetta e valore sono sempre gli stessi
export const FieldsSection = ({title, fields, className, columnsClassName = "sm:grid-cols-2", clampClassName}: FieldsSectionProps) => {
    const [editingAll, setEditingAll] = useState(false);

    return (
        <Tile title={title} className={className} action={<EditButton onClick={() => setEditingAll(true)}/>}>
            <div className={`grid gap-3 ${columnsClassName}`}>
                {fields.map((field) => (
                    <DetailField key={field.label} label={field.label} value={field.value}
                                 onChange={field.onChange} clampClassName={clampClassName}/>
                ))}
            </div>

            {editingAll && (
                <Modal title={title} wide onClose={() => setEditingAll(false)}>
                    <div className={`grid gap-3 ${fields.length > 1 ? "sm:grid-cols-2" : ""}`}>
                        {fields.map((field) => (
                            <TextField key={field.label} label={field.label} value={field.value} multiline
                                       onChange={field.onChange}/>
                        ))}
                    </div>
                </Modal>
            )}
        </Tile>
    );
};

interface DynamicFieldsSectionProps {
    title: string;
    fields: LabeledField[];
    onChange: (fields: LabeledField[]) => void;
    className?: string;
    columnsClassName?: string;
}

type OpenState = {kind: "all"} | {kind: "field"; index: number} | null;

// Campi estendibili (background di ruolo, moda): si possono aggiungere, rinominare e togliere
export const DynamicFieldsSection = ({title, fields, onChange, className, columnsClassName = "sm:grid-cols-2 xl:grid-cols-3"}: DynamicFieldsSectionProps) => {
    const [open, setOpen] = useState<OpenState>(null);

    const addField = () => {
        onChange([...fields, {label: "Nuovo campo", value: ""}]);
        setOpen({kind: "field", index: fields.length});
    };

    const patch = (index: number, values: Partial<LabeledField>) =>
        onChange(replaceAt(fields, index, {...fields[index], ...values}));

    const remove = (index: number) => {
        onChange(removeAt(fields, index));
        setOpen(null);
    };

    return (
        <Tile
            title={title}
            className={className}
            action={
                <span className="flex gap-1.5">
                    <AddButton label="Campo" onClick={addField}/>
                    <EditButton onClick={() => setOpen({kind: "all"})}/>
                </span>
            }
        >
            <div className={`grid gap-3 ${columnsClassName}`}>
                {fields.map((field, index) => (
                    <button key={index} type="button" onClick={() => setOpen({kind: "field", index})}
                            aria-label={`${field.label}: apri e modifica`}
                            className={`${rowButtonClass} grid min-w-0 content-start py-0.5 text-inherit`}>
                        <PreviewField label={field.label} value={field.value}/>
                    </button>
                ))}
            </div>

            {open?.kind === "all" && (
                <Modal
                    title={title}
                    wide
                    onClose={() => setOpen(null)}
                    footer={
                        <button type="button" onClick={() => onChange([...fields, {label: "Nuovo campo", value: ""}])}
                                className={buttonClass}>
                            <Plus size={16} aria-hidden="true" className="inline-block align-text-bottom"/> Campo
                        </button>
                    }
                >
                    <div className="grid gap-3 sm:grid-cols-2">
                        {fields.map((field, index) => (
                            <div key={index} className="grid content-start gap-2 border border-dashed border-[#5a1116] p-2.5">
                                <div className="flex items-center gap-2">
                                    <input
                                        className={`${inputClass} flex-1 font-bold uppercase`}
                                        aria-label="Nome campo"
                                        value={field.label}
                                        onChange={(event) => patch(index, {label: event.target.value})}
                                    />
                                    <button
                                        type="button"
                                        aria-label="Rimuovi campo"
                                        onClick={() => onChange(removeAt(fields, index))}
                                        className={`${buttonClass} ${dangerButtonClass} grid min-w-11 place-items-center px-0`}
                                    >
                                        <X size={16} aria-hidden="true"/>
                                    </button>
                                </div>
                                <TextField label="Valore" value={field.value} multiline
                                           onChange={(value) => patch(index, {value})}/>
                            </div>
                        ))}
                    </div>
                </Modal>
            )}

            {open?.kind === "field" && fields[open.index] && (
                <Modal
                    title={fields[open.index].label || title}
                    onClose={() => setOpen(null)}
                    footer={<DeleteButton label="Elimina campo" onClick={() => remove(open.index)}/>}
                >
                    <TextField label="Nome campo" value={fields[open.index].label}
                               onChange={(label) => patch(open.index, {label})}/>
                    <TextField label="Valore" value={fields[open.index].value} multiline
                               onChange={(value) => patch(open.index, {value})}/>
                </Modal>
            )}
        </Tile>
    );
};
