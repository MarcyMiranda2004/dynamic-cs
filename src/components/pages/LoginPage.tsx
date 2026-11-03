import {useState, type CSSProperties} from "react";

const EASE = 'ease-[cubic-bezier(.7,0,.2,1)]';
const LOGO_SIZE = 'clamp(2.5rem, 11vw, 6rem)';

const Orbits = ({className}: {className: string}) => (
    <svg
        viewBox="-52 -52 204 204"
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 overflow-visible transition duration-400 ${className}`}
    >
        <circle cx="50" cy="50" r="95" fill="none" strokeWidth="0.5" strokeOpacity={0.25} style={{stroke: 'var(--gray-500)'}} />
        <circle cx="50" cy="50" r="60" fill="none" strokeWidth="0.5" strokeOpacity={0.25} style={{stroke: 'var(--gray-500)'}} />

        <g className="transform-view origin-[50px_50px] animate-orbit-cw motion-reduce:animate-none drop-shadow-[0_0_8px_var(--color-dcs-red)]">
            <circle cx="50" cy="-10" r="5" style={{fill: 'var(--color-dcs-red)'}} className="opacity-80"/>
            <circle cx="50" cy="-10" r="5" transform="rotate(120 50 50)" style={{fill: 'var(--color-dcs-red)'}} className="opacity-80"/>
            <circle cx="50" cy="-10" r="5" transform="rotate(240 50 50)" style={{fill: 'var(--color-dcs-red)'}} className="opacity-80"/>
        </g>

        <g className="transform-view origin-[50px_50px] animate-orbit-ccw motion-reduce:animate-none drop-shadow-[0_0_8px_var(--color-dcs-red)]">
            <circle cx="50" cy="-45" r="5" transform="rotate(60 50 50)" style={{fill: 'var(--color-dcs-red)'}} className="opacity-80"/>
            <circle cx="50" cy="-45" r="5" transform="rotate(180 50 50)" style={{fill: 'var(--color-dcs-red)'}} className="opacity-80"/>
            <circle cx="50" cy="-45" r="5" transform="rotate(300 50 50)" style={{fill: 'var(--color-dcs-red)'}} className="opacity-80"/>
        </g>
    </svg>
);

const LoginPage = () => {
    const [open, setOpen] = useState(false);

    return (
        <div className="group fixed inset-0 overflow-hidden" data-open={open} style={{'--logo': LOGO_SIZE} as CSSProperties}>
            <div>
                <div className="rounded-full size-180 bg-dcs-red blur-3xl absolute -top-35 -left-25 animate-spot-grow" style={{animationDelay: '0s'}}/>
                <div className="rounded-full size-130 bg-purple-700 blur-3xl absolute -top-45  right-25 animate-spot-grow" style={{animationDelay: '0.30s'}}/>
                <div className="rounded-full size-140 bg-emerald-700 blur-3xl absolute -bottom-25 -right-10 animate-spot-grow" style={{animationDelay: '0.15s'}}/>
                <div className="rounded-full size-150 bg-amber-700 blur-3xl absolute -bottom-65 left-25 animate-spot-grow" style={{animationDelay: '0.45s'}} />

                <div className="rounded-full size-250 bg-dcs-red blur-3xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spot-grow opacity-5!" style={{animationDelay: '0.60s'}}/>
            </div>

            <div className="fixed inset-0 z-40 bg-(--bg)/50">
                {/* Gruppo che si sposta: punto zero al centro. Da aperto sale e si rimpicciolisce, dopo il ritiro di "ynamic". */}
                <div
                    style={{fontSize: 'var(--logo)'}}
                    className={`absolute left-1/2 top-[36%] size-0 transition-transform duration-600 ${EASE} motion-reduce:transition-none translate-x-[.685em] max-sm:translate-x-[.285em] group-data-[open=true]:translate-x-0 group-data-[open=true]:translate-y-[calc(14vh_-_230px)] group-data-[open=true]:scale-[.625] max-sm:group-data-[open=true]:scale-[.85] group-data-[open=true]:delay-650`}
                >
                    <h1 className="sr-only">Dynamic CS</h1>

                    <div className="isolate absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-baseline whitespace-nowrap font-semibold leading-none text-(--text)">
                        <Orbits className="size-[4.6667em] scale-[.625] opacity-0 group-data-[open=true]:scale-100 group-data-[open=true]:opacity-100 group-data-[open=true]:delay-200" />

                        <div className={`relative -top-[.06em] flex items-baseline transition-[top] duration-600 ${EASE} motion-reduce:transition-none group-data-[open=true]:top-0`}>
                            <span aria-hidden="true" className="inline-block flex-none transition-colors duration-400 group-data-[open=true]:text-dcs-red">
                                D
                            </span>

                            <span
                                aria-hidden="true"
                                className={`inline-block min-w-0 max-w-[4.2em] flex-none [clip-path:inset(-1em_0_-1em_0)] transition-[max-width,opacity] duration-600 ${EASE} motion-reduce:transition-none group-data-[open=true]:max-w-0 group-data-[open=true]:opacity-0`}
                            >
                                ynamic
                            </span>
                        </div>

                        <span aria-hidden="true" className={`inline-block w-[.35em] flex-none transition-[width] duration-600 ${EASE} motion-reduce:transition-none group-data-[open=true]:w-0`} />

                        <span aria-hidden="true" className="relative inline-block flex-none text-dcs-red">
                            CS
                            <Orbits className="size-[2.9167em] group-data-[open=true]:scale-150 group-data-[open=true]:opacity-0" />
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    inert={open}
                    onClick={() => setOpen(true)}
                    className="absolute left-[calc(50%_+_var(--logo)_*_.685)] max-sm:left-[calc(50%_+_var(--logo)_*_.285)] top-[calc(46%_+_var(--logo)_*_2)] -translate-x-1/2 whitespace-nowrap rounded-xl shadow-[0_8px_30px_color-mix(in_srgb,var(--accent)_45%,transparent)] bg-(--accent) px-8 py-2 text-lg font-semibold text-white transition duration-300 hover:brightness-110 cursor-pointer group-data-[open=true]:pointer-events-none group-data-[open=true]:translate-y-3 group-data-[open=true]:opacity-0"
                >
                    Accedi o Registrati
                </button>

                <form
                    inert={!open}
                    onSubmit={(event) => event.preventDefault()}
                    style={{background: 'linear-gradient(to bottom, color-mix(in srgb, var(--accent) 24%, var(--bg)), var(--bg) 75%)'}}
                    className="pointer-events-none absolute left-1/2 top-[calc(50%_-_76px)] max-sm:top-auto max-sm:bottom-16 flex text-left w-[min(28rem,calc(100vw_-_2rem))] -translate-x-1/2 translate-y-6 flex-col rounded-3xl border border-(--text)/12 p-5 text-(--text) opacity-0 shadow-2xl transition duration-300 motion-reduce:transition-none sm:p-6 group-data-[open=true]:pointer-events-auto group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100 group-data-[open=true]:delay-1100 group-data-[open=true]:duration-400"
                >
                    <span className="text-[10px] font-semibold uppercase tracking-[.2em] text-(--text)/60">Accesso</span>
                    <h2 className="mt-1 text-3xl font-bold leading-tight">Apri il tuo archivio</h2>

                    <label className="mt-5 flex flex-col gap-2 text-xs font-semibold">
                        Email
                        <input type="email" required placeholder="nome@esempio.it" className="rounded-xl border border-(--text)/10 bg-(--text)/5 px-4 py-3 text-sm font-normal text-(--text) outline-none placeholder:text-(--text)/40 focus:border-(--accent)" />
                    </label>

                    <label className="mt-4 flex flex-col gap-2 text-xs font-semibold">
                        Password
                        <input type="password" required placeholder="••••••••" className="rounded-xl border border-(--text)/10 bg-(--text)/5 px-4 py-3 text-sm font-normal text-(--text) outline-none placeholder:text-(--text)/40 focus:border-(--accent)" />
                    </label>

                    <button type="submit" className="mt-5 cursor-pointer rounded-xl bg-(--accent) py-3 text-sm font-bold text-white shadow-[0_8px_30px_color-mix(in_srgb,var(--accent)_45%,transparent)] transition hover:brightness-110">
                        Accedi
                    </button>

                    <div className="my-4 flex items-center gap-3 text-xs text-(--text)/50">
                        <span className="h-px flex-1 bg-(--text)/10" />
                        oppure
                        <span className="h-px flex-1 bg-(--text)/10" />
                    </div>

                    <button type="button" className="cursor-pointer rounded-xl border border-(--text)/10 bg-(--text)/8 py-3 text-sm font-bold transition hover:bg-(--text)/12">
                        Continua con Google
                    </button>

                    <div className="mt-5 flex justify-between text-xs text-(--text)/60">
                        <button type="button" onClick={() => setOpen(false)} className="cursor-pointer transition hover:text-(--text)">← Indietro</button>
                        <button type="button" className="cursor-pointer transition hover:text-(--text)">Registrati →</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
export default LoginPage;
