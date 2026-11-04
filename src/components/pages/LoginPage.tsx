import {useState, type CSSProperties} from "react";

const EASE = 'ease-[cubic-bezier(.7,0,.2,1)]';
const LOGO_SIZE = 'clamp(2.5rem, 11vw, 6rem)';

const CARD = 'col-start-1 row-start-1 flex h-[34rem] flex-col self-start rounded-3xl border border-(--text)/12 p-4 text-(--text) shadow-2xl sm:p-6';
const CARD_BACKGROUND: CSSProperties = {background: 'linear-gradient(to bottom, color-mix(in srgb, var(--accent) 24%, var(--bg)), var(--bg) 75%)'};
const FIELD_CLASS = 'rounded-xl border border-(--text)/10 bg-(--text)/5 px-4 py-3 text-sm font-normal text-(--text) outline-none placeholder:text-(--text)/40 focus:border-(--accent)';

type View = 'login' | 'register';

const AUTH_CONTENT: Record<View, {eyebrow: string, title: string, submitLabel: string}> = {
    login: {eyebrow: 'Accesso', title: 'Apri il tuo archivio', submitLabel: 'Accedi'},
    register: {eyebrow: 'Registrazione', title: 'Crea il tuo archivio', submitLabel: 'Crea account'},
};

const cardClass = (isActive: boolean, hasSwitched: boolean) => !hasSwitched
    ? (isActive ? 'z-[3]' : 'z-[1] translate-y-[22px] scale-[.96] brightness-[.62] opacity-0')
    : (isActive ? 'animate-card-in' : 'animate-card-out');

// lettera animata per il nome del logo
const Letter = ({children, index}: {children: string, index: number}) => (
    <span aria-hidden="true" className="inline-block animate-letter-in motion-reduce:animate-none" style={{animationDelay: `${index * 0.035}s`}}>
        {children}
    </span>
);

// logo con orbite
const Orbits = ({className, showDots = true}: {className: string, showDots?: boolean}) => (
    <svg
        viewBox="-52 -52 204 204"
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 overflow-visible transition duration-400 ${className}`}
    >
        <circle cx="50" cy="50" r="95" fill="none" strokeWidth="0.5" strokeOpacity={0.25} style={{stroke: 'var(--gray-600)'}} />
        <circle cx="50" cy="50" r="60" fill="none" strokeWidth="0.5" strokeOpacity={0.25} style={{stroke: 'var(--gray-600)'}} />

        <g className="transform-view origin-[50px_50px] animate-orbit-cw motion-reduce:animate-none drop-shadow-[0_0_8px_var(--color-dcs-red)]">
            {showDots && (
                <>
                    <circle cx="50" cy="-10" r="5" style={{fill: 'var(--color-dcs-red)'}} className="opacity-80"/>
                    <circle cx="50" cy="-10" r="5" transform="rotate(120 50 50)" style={{fill: 'var(--color-dcs-red)'}} className="opacity-80"/>
                    <circle cx="50" cy="-10" r="5" transform="rotate(240 50 50)" style={{fill: 'var(--color-dcs-red)'}} className="opacity-80"/>
                </>
            )}
        </g>

        <g className="transform-view origin-[50px_50px] animate-orbit-ccw motion-reduce:animate-none drop-shadow-[0_0_8px_var(--color-dcs-red)]">
            {showDots && (
                <>
                    <circle cx="50" cy="-45" r="5" transform="rotate(60 50 50)" style={{fill: 'var(--color-dcs-red)'}} className="opacity-80"/>
                    <circle cx="50" cy="-45" r="5" transform="rotate(180 50 50)" style={{fill: 'var(--color-dcs-red)'}} className="opacity-80"/>
                    <circle cx="50" cy="-45" r="5" transform="rotate(300 50 50)" style={{fill: 'var(--color-dcs-red)'}} className="opacity-80"/>
                </>
            )}
        </g>
    </svg>
);

interface AuthCardProps {
    type: View;
    view: View;
    open: boolean;
    hasSwitched: boolean;
    onSwitch: (next: View) => void;
    onClose: () => void;
}

// card di login e registrazione
const AuthCard = ({type, view, open, hasSwitched, onSwitch, onClose}: AuthCardProps) => {
    const {eyebrow, title, submitLabel} = AUTH_CONTENT[type];

    return (
        <form
            inert={!open || view !== type}
            onSubmit={(event) => event.preventDefault()}
            style={CARD_BACKGROUND}
            className={`${CARD} ${cardClass(view === type, hasSwitched)}`}
        >
            <span className="text-[10px] font-semibold uppercase tracking-[.2em] text-(--text)/60">{eyebrow}</span>
            <h2 className="mt-1 text-3xl font-bold leading-tight">{title}</h2>

            {type === 'register' && (
                <label className="mt-5 flex flex-col gap-2 text-xs font-semibold">
                    Username
                    <input type="text" required placeholder="Username" className={FIELD_CLASS} />
                </label>
            )}

            <label className={`${type === 'register' ? 'mt-4' : 'mt-5'} flex flex-col gap-2 text-xs font-semibold`}>
                Email
                <input type="email" required placeholder="nome@esempio.it" className={FIELD_CLASS} />
            </label>

            <label className="mt-4 flex flex-col gap-2 text-xs font-semibold">
                Password
                <input type="password" required placeholder="••••••••" className={FIELD_CLASS} />
            </label>

            <button type="submit" className="mt-4 cursor-pointer rounded-xl bg-(--accent) py-3 text-sm font-bold text-white shadow-[0_8px_30px_color-mix(in_srgb,var(--accent)_45%,transparent)] transition hover:brightness-110">
                {submitLabel}
            </button>

            <div className="my-3 flex items-center gap-3 text-xs text-(--text)/50">
                <span className="h-px flex-1 bg-(--text)/10" />
                oppure
                <span className="h-px flex-1 bg-(--text)/10" />
            </div>

            <button type="button" className="cursor-pointer rounded-xl border border-(--text)/10 bg-(--text)/8 py-3 text-sm font-bold transition hover:bg-(--text)/12">
                Continua con Google
            </button>

            <div className="mt-auto flex justify-between text-xs text-(--text)/60">
                {type === 'login' ? (
                    <>
                        <button type="button" onClick={onClose} className="cursor-pointer transition hover:text-(--text)">← Indietro</button>
                        <button type="button" onClick={() => onSwitch('register')} className="cursor-pointer transition hover:text-(--text)">Registrati →</button>
                    </>
                ) : (
                    <button type="button" onClick={() => onSwitch('login')} className="cursor-pointer transition hover:text-(--text)">← Accedi</button>
                )}
            </div>
        </form>
    );
};

const LoginPage = () => {
    const [open, setOpen] = useState(false);
    const [view, setView] = useState<View>('login');
    const [hasSwitched, setHasSwitched] = useState(false); // necessaria per far partire l'animazione del cambio card i login e registrati

    const switchView = (next: View) => {
        setHasSwitched(true);
        setView(next);
    };

    return (
        <div className="group fixed inset-0 overflow-hidden" data-open={open} style={{'--logo': LOGO_SIZE} as CSSProperties}>
            <div>
                <div className="rounded-full size-180 bg-red-700 blur-spot opacity-85! absolute -top-65 -left-35 max-sm:size-108 max-sm:top-[15%] max-sm:left-[17%] max-sm:-translate-x-1/2 max-sm:-translate-y-1/2 max-sm:blur-[2.56rem] animate-spot-grow" style={{animationDelay: '0.15s'}}/>
                <div className="rounded-full size-130 bg-purple-700 blur-spot opacity-85! absolute -top-55  right-35 max-sm:size-78 max-sm:top-[8%] max-sm:left-[77%] max-sm:-translate-x-1/2 max-sm:-translate-y-1/2 max-sm:blur-[2.56rem] animate-spot-grow" style={{animationDelay: '0.35s'}}/>
                <div className="rounded-full size-140 bg-emerald-700 blur-spot opacity-85! absolute -bottom-35 -right-20 max-sm:size-84 max-sm:top-[85%] max-sm:left-[87%] max-sm:-translate-x-1/2 max-sm:-translate-y-1/2 max-sm:blur-[2.56rem] animate-spot-grow" style={{animationDelay: '0.25s'}}/>
                <div className="rounded-full size-150 bg-amber-700 blur-spot opacity-85! absolute -bottom-75 left-15 max-sm:size-90 max-sm:top-[96%] max-sm:left-[29%] max-sm:-translate-x-1/2 max-sm:-translate-y-1/2 max-sm:blur-[2.56rem] animate-spot-grow" style={{animationDelay: '0.45s'}} />

                <div className="rounded-full size-250 bg-dcs-red blur-spot absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:size-150 max-sm:blur-[2.56rem] animate-spot-grow opacity-15!" style={{animationDelay: '0.55s'}}/>
            </div>

            <div className="fixed inset-0 z-40 bg-(--bg)/50">
                <div
                    style={{fontSize: 'var(--logo)'}}
                    className={`absolute left-1/2 top-[36%] size-0 transition-transform duration-600 ${EASE} motion-reduce:transition-none translate-x-[.685em] max-sm:translate-x-[.285em] group-data-[open=true]:translate-x-0 group-data-[open=true]:translate-y-[calc(14vh-230px)] group-data-[open=true]:scale-[.625] max-sm:group-data-[open=true]:scale-[.85] group-data-[open=true]:delay-650`}
                >
                    <h1 className="sr-only">Dynamic CS</h1>

                    <div className="isolate absolute left-0 top-0 flex -translate-x-1/2 -translate-y-1/2 items-baseline whitespace-nowrap font-semibold leading-none text-(--text)">
                        <Orbits className="size-[4.6667em] scale-[.625] opacity-0 group-data-[open=true]:scale-100 group-data-[open=true]:opacity-100 group-data-[open=true]:delay-200" />

                        <div className={`relative top-[-0.06em] flex items-baseline transition-[top] duration-600 ${EASE} motion-reduce:transition-none group-data-[open=true]:top-0`}>
                            <span aria-hidden="true" className="inline-block flex-none transition-colors duration-400 group-data-[open=true]:text-dcs-red">
                                <Letter index={0}>D</Letter>
                            </span>

                            <span
                                aria-hidden="true"
                                className={`inline-block min-w-0 max-w-[4.2em] flex-none [clip-path:inset(-1em_0_-1em_0)] transition-[max-width,opacity] duration-600 ${EASE} motion-reduce:transition-none group-data-[open=true]:max-w-0 group-data-[open=true]:opacity-0 z-60`}
                            >
                                <Letter index={1}>y</Letter>
                                <Letter index={2}>n</Letter>
                                <Letter index={3}>a</Letter>
                                <Letter index={4}>m</Letter>
                                <Letter index={5}>i</Letter>
                                <Letter index={6}>c</Letter>
                            </span>
                        </div>

                        <span aria-hidden="true" className={`inline-block w-[.35em] flex-none transition-[width] duration-600 ${EASE} motion-reduce:transition-none group-data-[open=true]:w-0`} />

                        <span aria-hidden="true" className="relative inline-block flex-none text-dcs-red">
                            <Letter index={7}>C</Letter>
                            <Letter index={8}>S</Letter>
                            <span className="animate-spot-grow" style={{animationDelay: '0.50s'}} >
                                <Orbits className="size-[2.9167em] group-data-[open=true]:scale-150 group-data-[open=true]:opacity-0" />
                            </span>
                        </span>
                    </div>
                </div>

                <button
                    type="button"
                    inert={open}
                    onClick={() => setOpen(true)}
                    className="absolute left-[calc(50%+var(--logo)*0.685)] max-sm:left-[calc(50%+var(--logo)*0.285)] top-[calc(46%+var(--logo)*2)] -translate-x-1/2 whitespace-nowrap rounded-xl shadow-[0_8px_30px_color-mix(in_srgb,var(--accent)_45%,transparent)] bg-(--accent) px-8 py-2 text-lg font-semibold text-white transition duration-300 hover:brightness-110 cursor-pointer animate-fade-in group-data-[open=true]:pointer-events-none group-data-[open=true]:translate-y-3 group-data-[open=true]:opacity-0"
                    style={{animationDelay: '0.6s', animationDuration: '0.4s', animationFillMode: 'backwards'}}
                >
                    Accedi o Registrati
                </button>

                <div className="pointer-events-none absolute left-1/2 top-[calc(50%-76px)] max-sm:top-auto max-sm:bottom-16 grid w-[min(28rem,calc(100vw-2rem))] -translate-x-1/2 translate-y-6 text-left opacity-0 transition duration-300 motion-reduce:transition-none group-data-[open=true]:pointer-events-auto group-data-[open=true]:translate-y-0 group-data-[open=true]:opacity-100 group-data-[open=true]:delay-1100 group-data-[open=true]:duration-400">
                    <AuthCard type="login" view={view} open={open} hasSwitched={hasSwitched} onSwitch={switchView} onClose={() => setOpen(false)} />
                    <AuthCard type="register" view={view} open={open} hasSwitched={hasSwitched} onSwitch={switchView} onClose={() => setOpen(false)} />
                </div>
            </div>
        </div>
    );
};
export default LoginPage;
