import type React from "react"
import type {GameProps} from "../../types/games"

interface CardItems { 
    gameSheet: GameProps;
    onClick: () => void;
}

const CardItems: React.FC<CardItems> = ({ gameSheet, onClick }) => {

    return (
        <div 
            key={gameSheet.key} 
            className="flex flex-col border border-gray-300 rounded-md cursor-pointer overflow-hidden"
            onClick={onClick}
        >
            <img src={gameSheet.coverCard} alt={gameSheet.label} className="h-50 w-full object-cover" />
            <p className="p-3 font-semibold bg-gray-100">{gameSheet.label}</p>
        </div>
    )
}
export default CardItems;