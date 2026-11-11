import {Outlet} from "react-router-dom";
import Navbar from "@/components/elements/Navbar";
import Sidebar from "@/components/elements/Sidebar";

const AppLayout = () => {
    return (
        <div className="dcs-app-shell">
            <Sidebar />

            <div className="dcs-app-content">
                <header>
                    <Navbar />
                </header>

                <main className="dcs-main-container">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};
export default AppLayout;
