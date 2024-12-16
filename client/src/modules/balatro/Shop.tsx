import { Shop as IShop, generateShop } from "./balatro";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { BuffonCard, CardContainer, useGameManager } from "./BalatroPage";
import { Buyable, BuyableConsumable, ShopPlugin } from "./plugins/shop-plugin";
import { useCurrentGame } from "./BalatroProvider";
import { Card } from "@/components/ui/card";
import { Consumable } from "./plugins/consumables-manager-plugin";
import { getTarotConfig } from "./cards/tarots";

function useShopManager() {
  const [shop, setShop] = useState<IShop>(generateShop());
  const { balatro } = useCurrentGame();

  const shopPlugin = balatro?.getPlugin<ShopPlugin>("shop");

  if (shopPlugin == null) {
    return null;
  }

  useEffect(() => {
    balatro?.onEvent("shop-rerolled", (shop) => setShop(shop));
    balatro?.onEvent("shop-item-bought", (shop) => setShop(shop));
  }, [shopPlugin]);

  return shopPlugin;
}

interface ShopProps {}

export const Shop = ({}: ShopProps) => {
  const gameManager = useGameManager();
  const shopManager = useShopManager();

  if (!gameManager) return null;

  if (!shopManager) return null;

  const handleBuyItem = (itemId: string) => {
    if (shopManager.canBuyItem(itemId)) {
      shopManager.buyItem(itemId);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-4">
        <div className="flex flex-col gap-2">
          <Button onClick={() => gameManager.startNextPhase()}>
            Next Round
          </Button>
          <Button
            disabled={!shopManager.canReroll()}
            onClick={() => shopManager.rerollShop()}
          >
            Reroll {shopManager.getRerollPrice()}$
          </Button>
        </div>
        <div>
          <CardContainer>
            <div className="flex flex-row gap-2">
              {shopManager.getItems().map((shopItem) => (
                <div className="flex flex-col gap-2">
                  <Card className="flex justify-center">{shopItem.price}</Card>
                  {shopItem.type === "buffon" && (
                    <BuffonCard
                      key={shopItem.buffon.id}
                      buffon={shopItem.buffon}
                      onClick={() => handleBuyItem(shopItem.buffon.id)}
                    />
                  )}
                  {shopItem.type === "consumable" && (
                    <ItemCard
                      key={shopItem.item.id}
                      item={shopItem.item}
                      onClick={() => handleBuyItem(shopItem.item.id)}
                    />
                  )}
                </div>
              ))}
            </div>
          </CardContainer>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <CardContainer>voucher</CardContainer>
        <CardContainer>
          aa
          {/* <div className="flex flex-row gap-2">
            {shop.packs.map((pack, index) => (
              <Card key={index}>{"pack"}</Card>
            ))}
          </div> */}
        </CardContainer>
      </div>
    </div>
  );
};

export const ItemCard = ({
  item,
  onClick,
}: {
  item: Consumable;
  onClick?: () => void;
}) => {
  console.log("item", item);
  switch (item.type) {
    case "tarot":
      return <TarotCard tarot={item} />;
    default:
      return (
        <Card onClick={onClick}>
          <div>{item.name}</div>
          <div>{item.description}</div>
        </Card>
      );
  }
};

interface TarotCardProps {
  tarot: Consumable;
}

export const TarotCard = ({ tarot }: TarotCardProps) => {
  const configId = tarot.configId;

  const config = getTarotConfig(configId);

  if (!config) {
    return null;
  }

  const pos = getBackgroundPosition(config.position);

  console.log("pos", pos);
  console.log("cardConsumableBackgroundStyle", cardConsumableBackgroundStyle);

  return (
    <div
      className="card-consumables"
      style={{
        ...cardSizeStyle,
        ...cardConsumableBackgroundStyle,
        backgroundPositionX: pos.x,
        backgroundPositionY: pos.y,
      }}
    />
  );
};

interface Position {
  x: number;
  y: number;
}

const SIZE_FACTOR = 2;

const CARD_X_SIZE = 71 * SIZE_FACTOR;
const CARD_Y_SIZE = 95 * SIZE_FACTOR;

const cardSizeStyle = {
  width: `${CARD_X_SIZE}px`,
  height: `${CARD_Y_SIZE}px`,
};

function getBackgroundPosition(position: Position): Position {
  return {
    x: -(position.x * CARD_X_SIZE),
    y: -(position.y * CARD_Y_SIZE),
  };
}

const cardConsumableBackgroundStyle = {
  backgroundSize: `${CARD_X_SIZE * 10}px ${CARD_Y_SIZE * 6}px`,
};
