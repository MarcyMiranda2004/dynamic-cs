import {gamesSheets} from "../types/games";

const HomePage = () => {

    const gamesCard = gamesSheets;

    return (
        <div className="dcs-container">
            <div>
                <h1 className="text-2xl font-semibold">Benvenuto in Dynamic CS</h1>
                <span className="text-sm">scegli la tua scheda per iniziare</span>
            </div>

            <div className="grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 my-6">
                {gamesCard.length > 0 && gamesCard.map((gc) => (
                    <span key={gc.key} className="flex flex-col border border-gray-100 rounded-md cursor-pointer">
                        <img src={gc.coverCard} alt={gc.label} className="rounded-t-md w-100" />
                        <p className="p-4 font-semibold">{gc.label}</p>
                    </span>
                ))}
            </div>
        </div>
    );
};
export default HomePage;