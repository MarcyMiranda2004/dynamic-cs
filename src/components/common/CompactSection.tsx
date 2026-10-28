import {useState, type ReactNode} from 'react'
import {ChevronRightIcon} from 'lucide-react'

interface CompactSectionProps {
    title: string;
    children: ReactNode;
    open?: boolean;
    onToggle?: (open: boolean) => void;
    defaultOpen?: boolean;
    meta?: string;
};

const CompactSection = ({title, children, open, onToggle, defaultOpen = false, meta}: CompactSectionProps) => {
    const [localOpen, setLocalOpen] = useState(defaultOpen);
    const isOpen = open ?? localOpen;

    const toggle = () => {
        const next = !isOpen;
        if (open === undefined) setLocalOpen(next);
        onToggle?.(next);
    };

    return (
        <section className="group/section border border-cpr-red/45 bg-cpr-panel" data-open={isOpen}>
            <button
                type="button"
                onClick={toggle}
                aria-expanded={isOpen}
                className="flex min-h-9 max-sm:min-h-11 w-full cursor-pointer items-center gap-3 border-0 bg-transparent px-3 py-2 text-left"
            >
                <span className="min-w-0 flex-1 font-bold tracking-widest uppercase">{title}</span>
                {meta && <span className="shrink-0 font-mono text-[0.8em] opacity-70">{meta}</span>}
                <ChevronRightIcon
                    size={14}
                    aria-hidden="true"
                    className="shrink-0 transition-transform duration-250 group-data-[open=true]/section:rotate-90 motion-reduce:transition-none"
                />
            </button>

            <div
                inert={!isOpen}
                className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-data-[open=true]/section:grid-rows-[1fr] motion-reduce:transition-none"
            >
                <div className="min-h-0 overflow-hidden">
                    <div className="grid gap-2 px-3 pt-1 pb-3">{children}</div>
                </div>
            </div>
        </section>
    );
};
export default CompactSection;
