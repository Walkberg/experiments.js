import { useEffect, useState } from "react";
import { PokerCard } from "../cards/PokerCard";
import { useCurrentGame } from "../../BalatroProvider";
import { Hand } from "./Hand";
import { Hand as IHand } from "../../balatro";
import { PlayCards } from "../cards/PokerCards";

export const Board = () => {
  return (
    <div className="grid grid-rows-3 m-2 gap-4 h-full">
      <PlayHand />
      <div className="row-span-2">
        <Hand />
      </div>
    </div>
  );
};

export const PlayHand = () => {
  const { balatro } = useCurrentGame();

  const [hand, setHand] = useState<IHand>([]);

  const handleScoreCardCalculated = async () => {
    console.log("score-card-calculated");
    await new Promise((resolve) => setTimeout(resolve, 4000)); // Attendre 4 secondes
  };

  const handleScoreCalculated = () => {
    setHand([]);
  };

  useEffect(() => {
    if (balatro == null) return;

    balatro.onEvent("hand-played", (hand: IHand) => setHand(hand));

    balatro.onEvent("score-card-calculated", handleScoreCardCalculated);

    balatro.onEvent("score-calculated", handleScoreCalculated);
  }, [balatro]);

  return <PlayCards pokerCards={hand} />;
};
