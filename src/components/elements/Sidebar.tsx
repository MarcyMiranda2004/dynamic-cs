import {LOGO_SLOT_ATTRIBUTE, LOGO_TRANSITION_NAME} from "@/utils/viewTransition";

const Sidebar = () => {
    return (
        <aside>
            <div
                // slot di atterraggio del logo per l'animazione in transizione login => home
                {...{[LOGO_SLOT_ATTRIBUTE]: ''}}
                aria-hidden="true"
                className="pointer-events-none fixed left-4 top-3 h-7 w-14"
                style={{viewTransitionName: LOGO_TRANSITION_NAME}}
            />

            <div>
                
            </div>
        </aside>
    );
};
export default Sidebar;
