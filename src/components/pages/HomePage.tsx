import {useNavigate} from "react-router-dom";
import {gamesSheets, type GameProps} from "@/types/games";
import CardItems from "@/components/common/CardItems";

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="dcs-container">
            <div>
                <h1 className="text-2xl font-semibold">Benvenuto in Dynamic <span className="text-app-accent">CS</span></h1>
                <span className="text-sm">scegli la tua scheda per iniziare</span>
            </div>

            <div className="grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-6 gap-4">
                {gamesSheets.length > 0 && gamesSheets.map((gs: GameProps) => (
                    <CardItems gameSheet={gs} onClick={() => navigate(`sheets/${gs.gameSystem}`)} />
                ))}
            </div>
        </div>
    );
};
export default HomePage;