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
            icon: <HomeIcon size={14} />,
            destination: "/"
        },
        {
            id: "characters",
            label: "Personaggi",
            icon: <UsersIcon size={14} />,
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
        <div className={orientation === 'vertical' ? 'flex flex-col gap-4 w-18' : 'flex w-full justify-around gap-2'}>
            {buttons.map((button: ActionLinkButton) => (
                <button
                    key={button.id}
                    onClick={() => {
                        navigate(button.destination);
                        setActiveButton(button.id);
                    }}
                    aria-label={button.label}
                    disabled={button?.disabled ?? false}
                    className={`flex flex-col items-center text-[10px] font-semibold rounded-lg transition-all duration-200 cursor-pointer p-2 ${
                        activeButton === button.id ? "shadow-[0_0_10px_2px] shadow-dcs-red  font-bold" : "hover:shadow-sm shadow-dcs-red"
                    }`}
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
