
interface PreviewFieldProps {
    label: string;
    value: string | number;
    clampClassName?: string;
};

// Anteprima di sola lettura di un campo: vive dentro una sezione cliccabile (OpenSection)
const PreviewField = ({label, value, clampClassName = 'line-clamp-3'}: PreviewFieldProps) => (
    <div className="grid min-w-0 content-start gap-1">
        <span className="fieldLabelClass">{label}</span>
        <span className={`valueClass ${clampClassName}`}>{value === '' ? '—' : value}</span>
    </div>
);
export default PreviewField;
