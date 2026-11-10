import type {NavigateFunction} from "react-router-dom";

export const LOGO_TRANSITION_NAME = 'dcs-logo'; // riferimento per il logo
export const LOGO_SLOT_ATTRIBUTE = 'data-logo-slot'; // riferimento per lo slot di arrivo del logo

const TRANSITION_ATTRIBUTE = 'data-vt'; // riferimento per la transizione 
const SLOT_WAIT_TIMEOUT_MS = 1500; // attesa massima ler l'animazione

// riduzione del movimento per i browser che non supportano la View Transition API
export const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;


const waitForElement = (selector: string) => new Promise<void>((resolve) => {
    if (document.querySelector(selector)) return resolve();

    const finish = () => {
        observer.disconnect();
        window.clearTimeout(timer);
        resolve();
    };

    const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) finish();
    });

    const timer = window.setTimeout(finish, SLOT_WAIT_TIMEOUT_MS);
    observer.observe(document.body, {childList: true, subtree: true});
});

export const navigateWithLogoFlight = (navigate: NavigateFunction, to: string) => {
    if (!('startViewTransition' in document)) {
        navigate(to);
        return;
    }

    const root = document.documentElement;

    // nei browser che non supportano la View Transition API scatta il reduce del movimento che disattiva l'animazione in favor edi una transizione standard
    root.setAttribute(TRANSITION_ATTRIBUTE, prefersReducedMotion() ? 'login-home-reduced' : 'login-home');

    const transition = document.startViewTransition(async () => {
        navigate(to);
        await waitForElement(`[${LOGO_SLOT_ATTRIBUTE}]`);
    });

    transition.finished.finally(() => root.removeAttribute(TRANSITION_ATTRIBUTE));
};
