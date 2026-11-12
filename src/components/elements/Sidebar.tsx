import type {ActionLinkButton} from "@/types/global-types";
import {FileSpreadsheetIcon, HomeIcon, UsersIcon} from "lucide-react";
import {useState} from "react";
import {useNavigate} from "react-router-dom";

// vertical = colonna della sidebar desktop, horizontal = barra in basso su mobile
const SidebarContent = ({orientation}: {orientation: 'vertical' | 'horizontal'}) => {
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState<string>("home")
    
    const buttons: ActionLinkButton[] = [
        {
            id: "home",
            label: "Home",
            icon: <HomeIcon size={16} />,
            destination: "/"
        },
        {
            id: "characters",
            label: "Personaggi",
            icon: <UsersIcon size={16} />,
            destination: "/characters"
        },
        {
            id: "sheets",
            label: "Schede",
            icon: <FileSpreadsheetIcon size={14} />,
            destination: "/sheets"
        },
    ];
    return (
        <div className={
            orientation === 'vertical' 
                ? 'sticky top-4 flex flex-col gap-4 w-fit' 
                : 'flex w-full justify-around gap-2'
        }>
            {buttons.map((button: ActionLinkButton) => (
                <button
                    key={button.id}
                    onClick={() => {
                        navigate(button.destination);
                        setActiveButton(button.id);
                    }}
                    aria-label={button.label}
                    disabled={button?.disabled ?? false}
                    aria-current={activeButton === button.id ? "page" : undefined}
                    className="dcs-nav-button"
                >
                    {button?.icon}
                    {button.label}
                </button>
            ))}
        </div>
    );
};

const Sidebar = () => {
    return (
        <>
            {/* Desktop: aside direttamente figlio di shell  */}
            <aside className="dcs-sidebar-container-desktop" aria-label="Navigazione principale">
                <SidebarContent orientation="vertical" />
            </aside>

            {/* Mobile: barra fissa in basso */}
            <nav className="dcs-sidebar-container-mobile" aria-label="Navigazione principale">
                <SidebarContent orientation="horizontal" />
            </nav>
        </>
    );
};
export default Sidebar;
