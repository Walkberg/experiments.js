import { Card } from "@/components/ui/card";
import {
  PokerCard as ICard,
  Shop as IShop,
  generateShop,
  generateCards,
  generateBuyableItems,
  BuyableItem,
} from "./balatro";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { CardContainer } from "./BalatroPage";
import { PlayCard } from "./Card";

interface ShopProps {}

export const Shop = ({}: ShopProps) => {
  const [shop, setShop] = useState<IShop>(generateShop());

  const handleBuyCard = (buyableItem: BuyableItem<ICard>) => {
    setShop((prev) => ({
      ...prev,
      cards: prev.cards.filter((card) => card.id !== buyableItem.id),
    }));
  };

  const handleReroll = () => {
    const cards = generateBuyableItems(generateCards(2));
    setShop((prev) => ({ ...prev, cards }));
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-2">
          <Button>Next Round</Button>
          <Button onClick={handleReroll}>Reroll 5$</Button>
        </div>
        <div>
          <CardContainer>
            <div className="flex flex-row gap-2">
              {shop.cards.map((card) => (
                <PlayCard
                  onSelectCard={() => handleBuyCard(card)}
                  key={card.id}
                  card={card}
                />
              ))}
            </div>
          </CardContainer>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <CardContainer>voucher</CardContainer>
        <CardContainer>
          <div className="flex flex-row gap-2">
            {shop.packs.map((pack, index) => (
              <Card key={index}>{"pack"}</Card>
            ))}
          </div>
        </CardContainer>
      </div>
    </div>
  );
};
