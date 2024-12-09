import { Shop as IShop, generateShop } from "./balatro";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { BuffonCard, CardContainer, useGameManager } from "./BalatroPage";
import { ShopPlugin } from "./plugins/shop-plugin";
import { useCurrentGame } from "./BalatroProvider";
import { Card } from "@/components/ui/card";
import { Consumable } from "./plugins/consumables-manager-plugin";

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
  return (
    <Card onClick={onClick}>
      <div>{item.name}</div>
      <div>{item.description}</div>
    </Card>
  );
};
