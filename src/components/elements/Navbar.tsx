import DcsLogo from "@/components/elements/DcsLogo";
import type {ActionLinkButton} from "@/types/global-types";
import {LOGO_SLOT_ATTRIBUTE, LOGO_TRANSITION_NAME} from "@/utils/viewTransition";
import {ChevronRightIcon, SettingsIcon, UserIcon} from "lucide-react";
import {useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";

// Logo nella navbar e slot di atterraggio dell'animazione in transizione login => home
const LandingSpot = ({ destination }: { destination: string }) => {
    const navigate = useNavigate();
    
    return (
        <div 
            role="img" 
            aria-label="Dynamic CS" 
            className="grid size-[4.70em] place-items-center text-xs cursor-pointer"
            onClick={() => navigate(`${destination ?? ""}`)}
        >
            <DcsLogo {...{[LOGO_SLOT_ATTRIBUTE]: ''}} style={{viewTransitionName: LOGO_TRANSITION_NAME}} />
        </div>
    )
};

const UserMenu = () => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const menuRef = useRef<HTMLDivElement>(null);

    // chiude il menu se clicco al di fuori
    useEffect(() => {
        if (!isOpen) return;

        const handlePointerDown = (event: PointerEvent) => {
            if (!menuRef.current?.contains(event.target as Node)) setIsOpen(false);
        };

        document.addEventListener("pointerdown", handlePointerDown);
        return () => document.removeEventListener("pointerdown", handlePointerDown);
    }, [isOpen]);

    const buttons: ActionLinkButton[] = [
        {
            id: "profile",
            label: "Profilo",
            icon: <UserIcon size={16} />,
            destination: "/profile"
        },
        {
            id: "settings",
            label: "Impostazioni",
            icon: <SettingsIcon size={16} />,
            destination: "/settings"
        }
    ];

    return (
        <div ref={menuRef} className="relative w-fit">
            <div
                data-open={isOpen}
                onClick={() => setIsOpen(!isOpen)}
                className="dcs-menu-trigger"
            >
                <div className="flex items-center gap-2">
                    {/* Img profilo dell'utente */}
                    {/* <img src="" size={} className="" /> */}
                    <span className="flex items-center rounded-full p-2 border border-(--accent-border) bg-(--accent-bg)">
                        <UserIcon size={18} />
                    </span>

                    {/* Username dell'utente */}
                    <p>Username</p>
                </div>

                <ChevronRightIcon size={14} className={`mx-2 ${isOpen ? "rotate-90" : ""}`} />
            </div>

            {/* menu: fratello del trigger e non suo figlio, così il trigger (z più alta) lo copre. Un clic su una voce lo chiude */}
            <div
                onClick={() => setIsOpen(false)}
                className={`dcs-menu-under ${isOpen ? "dcs-menu-open" : "dcs-menu-close"} space-y-2`}
            >
                {buttons.map((button: ActionLinkButton) => (
                    <button
                        key={button.id}
                        onClick={() => navigate(button.destination)}
                        className="dcs-menu-item"
                    >
                        {button?.icon}
                        {button.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

const Navbar = () => {
    return (
        <nav className="flex items-center justify-between py-4 px-8">
            {/* slot di atterraggio del logo per l'animazione in transizione login => home */}
            <LandingSpot destination="/" />

            {/* menu utente */}
            <UserMenu />
        </nav>
    );
};
export default Navbar;