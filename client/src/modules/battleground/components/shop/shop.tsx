import { Button } from "@/components/ui/button";
import { CardList } from "../../battleground-page";
import { Player } from "../player/player";
import { usePlayerHand, useShop } from "../../battleground.provider";

export const Shop = () => {
  const { cards, roll } = useShop();

  const { canAddCard } = usePlayerHand();

  return (
    <div className="flex flex-row items-center">
      <div className="flex flex-col items-center">
        <div>
          <div>shop</div>
          <CardList cards={cards} />
        </div>
        <div>
          timer
          <Button onClick={roll}>Roll</Button>
        </div>
        <Player />
      </div>
    </div>
  );
};
