import type {ComponentProps} from "react";

const SIZES = {
    sm: 'text-sm',
    md: 'text-3xl',
    lg: 'text-7xl',
};

interface DcsLogoProps extends ComponentProps<'span'> {
    label?: string;
    size?: keyof typeof SIZES;
}

const DcsLogo = ({className = '', label, size = 'sm', ...props}: DcsLogoProps) => (
    <span {...props} className={`relative isolate inline-block whitespace-nowrap font-semibold leading-none text-dcs-red ${SIZES[size]} ${className}`}>
        <svg
            viewBox="-52 -52 204 204"
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-[4.6667em] -translate-x-1/2 -translate-y-1/2 overflow-visible"
        >
            {/* anelli fissi: tratto di 1px costante, qualunque sia la dimensione del logo */}
            <circle cx="50" cy="50" r="95" fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke" className="stroke-gray-600/40" />
            <circle cx="50" cy="50" r="60" fill="none" strokeWidth="1" vectorEffect="non-scaling-stroke" className="stroke-gray-600/40" />

            {/* pallini dell'anello interno, senso orario */}
            <g className="transform-view origin-[50px_50px] animate-orbit-cw motion-reduce:animate-none drop-shadow-[0_0_8px_var(--color-dcs-red)]">
                <circle cx="50" cy="-10" r="5" className="fill-dcs-red opacity-80" />
                <circle cx="50" cy="-10" r="5" transform="rotate(120 50 50)" className="fill-dcs-red opacity-80" />
                <circle cx="50" cy="-10" r="5" transform="rotate(240 50 50)" className="fill-dcs-red opacity-80" />
            </g>

            {/* pallini dell'anello esterno, senso antiorario e sfalsati di 60° */}
            <g className="transform-view origin-[50px_50px] animate-orbit-ccw motion-reduce:animate-none drop-shadow-[0_0_8px_var(--color-dcs-red)]">
                <circle cx="50" cy="-45" r="5" transform="rotate(60 50 50)" className="fill-dcs-red opacity-80" />
                <circle cx="50" cy="-45" r="5" transform="rotate(180 50 50)" className="fill-dcs-red opacity-80" />
                <circle cx="50" cy="-45" r="5" transform="rotate(300 50 50)" className="fill-dcs-red opacity-80" />
            </g>
        </svg>
        {label ?? "DCS"}
    </span>
);
export default DcsLogo;
