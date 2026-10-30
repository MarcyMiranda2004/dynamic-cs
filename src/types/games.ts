import CyberpunkRedCardCover from "@/assets/cyberpunk/CyberpunkRedCardCover.jpg";
import CallOfChtulhu from "@/assets/call-of-chulhu/CallOfChtulhu7eCoverCard.jpg";
import SeventhSea from "@/assets/7th-sea/7thSea3eCoverCard.jpg";
import DungeonsAndDragons from "@/assets/dungeond-and-dragons/DungeonsAndDragons5eCoverCard.jpg";
import Pathfinder from "@/assets/pathfinder/Pathfinder2eCoverCard.jpg";
import VampireTheMasquerade from "@/assets/vampire-the-masquerde/VampireTheMasquerade6eCoverCard.jpg";

export interface GameProps {
    key: string;
    label: string;
    gameSystem: string;
    coverCard: string;
};

export const gamesSheets: GameProps[] = [
    {key: "cyberpunk-red", label: "Cyberpunk Red", gameSystem: "cyberpunk-red", coverCard: CyberpunkRedCardCover},
    {key: "call-of-chtulhu-7e", label: "Call of Chtulhu (7e)", gameSystem: "call-of-chtulhu-7e", coverCard: CallOfChtulhu},
    {key: "7th-sea-3e", label: "7th Sea (3e)", gameSystem: "7th-sea-3e", coverCard: SeventhSea},
    {key: "vampire-the-masquerade-6e", label: "Vampire: The Masquerade (6e)", gameSystem: "vampire-the-masquerade-6e", coverCard: VampireTheMasquerade},
    {key: "dungeons-and-dragons-5e", label: "Dungeons & Dragons (5e)", gameSystem: "dungeons-and-dragons-5e", coverCard: DungeonsAndDragons},
    {key: "pathfinder-2e", label: "Pathfinder (2e)", gameSystem: "pathfinder-2e", coverCard: Pathfinder},
];
