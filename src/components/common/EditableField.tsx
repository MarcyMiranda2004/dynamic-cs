import {useNumberDraft} from '@/components/common/useNumberDraft'

interface TextFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    multiline?: boolean;
    placeholder?: string;
};

export const TextField = ({label, value, onChange, multiline = false, placeholder}: TextFieldProps) => (
    <label className="grid min-w-0 gap-1">
        <span className="fieldLabelClass">{label}</span>
        {multiline ? (
            <textarea
                className="inputClass min-h-20 max-sm:min-h-24 resize-y"
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
            />
        ) : (
            <input
                className="inputClass"
                type="text"
                value={value}
                placeholder={placeholder}
                onChange={(event) => onChange(event.target.value)}
            />
        )}
    </label>
);

interface NumberFieldProps {
    label: string
    value: number
    onChange: (value: number) => void
};

export const NumberField = ({label, value, onChange}: NumberFieldProps) => {
    const number = useNumberDraft(value, onChange)

    return (
        <label className="grid min-w-0 gap-1">
            <span className="fieldLabelClass">{label}</span>
            <input className="inputClass" type="number" inputMode="numeric" {...number}/>
        </label>
    );
};

interface InlineNumberProps {
    label: string;
    value: number;
    onChange: (value: number) => void;
    autoFocus?: boolean;
    centered?: boolean;
};

export const InlineNumber = ({label, value, onChange, autoFocus, centered = false}: InlineNumberProps) => {
    const number = useNumberDraft(value, onChange);

    return (
        <span className="cellClass" data-label={label}>
            <input
                className={`inputClass min-h-9 ${centered ? "text-center" : ""}`}
                type="number"
                inputMode="numeric"
                aria-label={label}
                autoFocus={autoFocus}
                {...number}
                onFocus={(event) => {
                    number.onFocus()
                    event.target.select()
                }}
            />
        </span>
    );
};
