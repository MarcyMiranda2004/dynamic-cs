import DcsLogo from "@/components/elements/DcsLogo";
import {logout} from "@/config/firebaseConfig";
import type {ActionLinkButton} from "@/types/global-types";
import {LOGO_SLOT_ATTRIBUTE, LOGO_TRANSITION_NAME} from "@/utils/viewTransition";
import type {User} from "firebase/auth";
import {ChevronRightIcon, LogOutIcon, SettingsIcon, UserIcon} from "lucide-react";
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
            <DcsLogo {...{[LOGO_SLOT_ATTRIBUTE]: ''}} style={{viewTransitionName: LOGO_TRANSITION_NAME}} className="dcs-logo-neon" />
        </div>
    )
};

const UserMenu = ({ user }: { user: User | null }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const menuRef = useRef<HTMLDivElement>(null);
    const iconSize = 16;

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
            icon: <UserIcon size={iconSize} />,
            destination: "/profile"
        },
        {
            id: "settings",
            label: "Impostazioni",
            icon: <SettingsIcon size={iconSize} />,
            destination: "/settings"
        },
        {
            id: "logout",
            label: "Esci",
            icon: <LogOutIcon size={iconSize} />,
            destination: "/login",
            function: logout,
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
                    {user?.photoURL ? (
                        <img src={user?.photoURL}  className="rounded-full size-10"/>
                    ) : (
                        <span className="flex items-center rounded-full p-2 border border-(--accent-border) bg-(--accent-bg)">
                           <UserIcon size={18} />
                        </span>
                    )}
                    
                    {/* Username dell'utente */}
                    <p>{user?.displayName ?? user?.email?.split("@")[0] ?? "Username"}</p>
                </div>

                <ChevronRightIcon size={14} className={`mx-2 ${isOpen ? "rotate-90" : ""}`} />
            </div>

            {/* menu */}
            <div
                onClick={() => setIsOpen(false)}
                className={`dcs-menu-under ${isOpen ? "dcs-menu-open" : "dcs-menu-close"} space-y-2`}
            >
                {buttons.map((button: ActionLinkButton) => (
                    <button
                        key={button.id}
                        onClick={async () => {
                           if (button.function) await button.function();
                            navigate(button.destination);
                        }}
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

const Navbar = ({ user }: { user: User | null }) => {
    return (
        <nav className="flex items-center justify-between py-4 px-8">
            {/* slot di atterraggio del logo per l'animazione in transizione login => home */}
            <LandingSpot destination="/" />

            {/* menu utente */}
            <UserMenu user={user} />
        </nav>
    );
};
export default Navbar;