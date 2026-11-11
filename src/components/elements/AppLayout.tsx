import {Outlet} from "react-router-dom";
import Navbar from "@/components/elements/Navbar";
import Sidebar from "@/components/elements/Sidebar";

const SPOT = 'absolute rounded-full blur-spot max-sm:blur-[2.56rem]';

// una macchia per angolo; su mobile sono molto più piccole per non coprire lo schermo
const SPOTS = [
    'size-180 -top-60 -left-60 bg-red-700 opacity-30 max-sm:size-70 max-sm:-top-20 max-sm:-left-20',
    'size-160 -top-55 -right-55 bg-purple-700 opacity-20 max-sm:size-64 max-sm:-top-18 max-sm:-right-18',
    'size-150 -bottom-50 -right-50 bg-emerald-700 opacity-25 max-sm:size-60 max-sm:-bottom-16 max-sm:-right-16',
    'size-140 -bottom-45 -left-45 bg-amber-700 opacity-25 max-sm:size-56 max-sm:-bottom-14 max-sm:-left-14',
];

const AppBackground = () => (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        {SPOTS.map((spot) => <div key={spot} className={`${SPOT} ${spot}`} />)}
        <div className="absolute inset-0 bg-(--bg)/50" />
    </div>
);

const AppLayout = () => {
    return (
        <div className="dcs-app-shell isolate">
            <AppBackground />

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
