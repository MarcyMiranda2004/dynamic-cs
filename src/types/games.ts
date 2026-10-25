import cyberpunkRedCard from "../assets/cyberpunk/cyberpunkRedCard.jpg";

export interface GameProps {
    key: string;
    label: string;
    gameSystem: string;
    coverCard: string;
};

export const gamesSheets: GameProps[] = [
    {key: "cyberpunk-red", label: "Cyberpunk Red", gameSystem: "cyberpunk-red", coverCard: cyberpunkRedCard}
];
