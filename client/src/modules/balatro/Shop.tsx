import { Shop as IShop, generateShop } from "./balatro";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { BuffonCard, CardContainer, useGameManager } from "./BalatroPage";
import { Buyable, ShopPlugin } from "./plugins/shop-plugin";
import { useCurrentGame } from "./BalatroProvider";
import { Card } from "@/components/ui/card";
import { ConsumableCard } from "./modules/consumables/ConsumableCard";

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

  const items = shopManager.getItems();

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
            <CardItemContainer items={items} onBuy={handleBuyItem} />
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

const CardItemContainer = ({
  items,
  onBuy,
}: {
  items: Buyable[];
  onBuy: (itemId: string) => void;
}) => {
  const [selectedItem, setSelectedItem] = useState<Buyable | null>(null);

  return (
    <div className="flex flex-row gap-2">
      {items.map((shopItem) => (
        <div className="flex flex-col gap-2">
          {shopItem.type === "buffon" && (
            <BuffonCard
              key={shopItem.buffon.id}
              buffon={shopItem.buffon}
              onClick={() => setSelectedItem(shopItem)}
            />
          )}
          {shopItem.type === "consumable" && (
            <ConsumableCard
              selected={
                selectedItem?.type === "consumable" &&
                selectedItem?.item.id === shopItem.item.id
              }
              key={shopItem.item.id}
              consumable={shopItem.item}
              onClick={() =>
                setSelectedItem(
                  selectedItem?.type === "consumable" &&
                    selectedItem?.item.id === shopItem.item.id
                    ? null
                    : shopItem
                )
              }
              hoverSide="left"
              topComponent={<PriceIndicator price={shopItem.price} />}
              rightComponent={<BuyAndUse onBuyAnUse={() => {}} />}
              bottomComponent={<Buy onBuy={() => onBuy(shopItem.item.id)} />}
            />
          )}
        </div>
      ))}
    </div>
  );
};

interface BuyProps {
  onBuy: () => void;
}

const Buy = ({ onBuy }: BuyProps) => {
  return (
    <button onClick={onBuy} className="bg-amber-500 text-white rounded-2xl p-2">
      Acheter
    </button>
  );
};

interface BuyAndUseProps {
  onBuyAnUse: () => void;
}

const BuyAndUse = ({ onBuyAnUse }: BuyAndUseProps) => {
  return (
    <button
      onClick={onBuyAnUse}
      className="bg-orange-700 text-white rounded-2xl p-2"
    >
      Acheter <br /> et utiliser
    </button>
  );
};

export const PriceIndicator = ({ price }: { price: number }) => {
  return (
    <div className="flex flex-row gap-2 bg-zinc-900 p-1 rounded-2xl pb-8">
      <div className="bg-zinc-700 text-amber-400 rounded-2xl py-2 px-8">
        ${price}
      </div>
    </div>
  );
};
