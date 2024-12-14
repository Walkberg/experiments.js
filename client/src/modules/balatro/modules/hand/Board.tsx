import { ReactNode, useCallback, useEffect, useState } from "react";
import { PlayedCardManagerPlugin } from "../../balatro-engine";
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

  const playedCardPlugin =
    balatro?.getPlugin<PlayedCardManagerPlugin>("played-card");

  const [hand, setHand] = useState<IHand>([]);

  useEffect(() => {
    balatro?.onEvent("phase-changed", () => {
      setHand(playedCardPlugin?.getHand() ?? []);
    });
    balatro?.onEvent("hand-played", () =>
      setHand(playedCardPlugin?.getHand() ?? [])
    );
    balatro?.onEvent("played-card-reset", () =>
      setHand(playedCardPlugin?.getHand() ?? [])
    );
  }, [balatro]);

  console.log("hand", hand);

  return (
    <div className="flex flex-row items-center gap-2">
      {hand.map((handCard) => (
        <PlayCard key={handCard.id} card={handCard} />
      ))}
    </div>
  );
};
