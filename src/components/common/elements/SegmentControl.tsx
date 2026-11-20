import {useRef, type KeyboardEvent, type ReactNode} from "react";

export interface SegmentOption<T extends string> {
    value: T;
    label: string;
    icon?: ReactNode;
}

interface SegmentControlProps<T extends string> {
    label: string;
    options: SegmentOption<T>[];
    value: T;
    onChange: (value: T) => void;
}

const SegmentControl = <T extends string>({label, options, value, onChange}: SegmentControlProps<T>) => {
    const buttons = useRef<(HTMLButtonElement | null)[]>([]);

    const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        const step = event.key === 'ArrowRight' || event.key === 'ArrowDown' ? 1
            : event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? -1
            : 0;
        if (step === 0) return;

        event.preventDefault();
        const current = options.findIndex((option) => option.value === value);
        const next = (current + step + options.length) % options.length;
        onChange(options[next].value);
        buttons.current[next]?.focus();
    };

    return (
        <div
            role="radiogroup"
            aria-label={label}
            className="inline-flex items-center gap-1 rounded-full border border-(--text)/10 bg-(--text)/5 p-1"
        >
            {options.map((option, index) => {
                const checked = option.value === value;

                return (
                    <button
                        key={option.value}
                        ref={(element) => {
                            buttons.current[index] = element;
                        }}
                        type="button"
                        role="radio"
                        aria-checked={checked}
                        tabIndex={checked ? 0 : -1}
                        onClick={() => onChange(option.value)}
                        onKeyDown={handleKeyDown}
                        className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--dcs-neon) ${
                            checked ? 'dcs-fake-glass text-(--text)' : 'border border-transparent text-(--text)/70 hover:text-(--text)'
                        }`}
                    >
                        {option.icon}
                        {option.label}
                    </button>
                );
            })}
        </div>
    );
};
export default SegmentControl;
