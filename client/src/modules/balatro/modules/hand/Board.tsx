import { useEffect, useState } from "react";
import { PlayCard } from "../../Card";
import { useCurrentGame } from "../../BalatroProvider";
import { Hand } from "./Hand";
import { Hand as IHand } from "../../balatro";

export const Board = () => {
  return (
    <div className="grid grid-rows-2 m-2 gap-4">
      <PlayHand />
      <Hand />
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

  return (
    <div className="flex flex-row items-center gap-2">
      {hand.map((handCard) => (
        <PlayCard key={handCard.id} card={handCard} />
      ))}
    </div>
  );
};
