import { Shop as IShop, generateShop } from "./balatro";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CardContainer, useGameManager } from "./BalatroPage";
import { Buyable, ShopPlugin } from "./plugins/shop-plugin";
import { useCurrentGame } from "./BalatroProvider";
import { ConsumableCard } from "./modules/consumables/ConsumableCard";
import { cn } from "@/lib/utils";
import { BuffonCard } from "./modules/buffons/BuffonCard";
import { getShopPackPlugin, ShopPackPlugin } from "./plugins/shop-pack-plugin";
import { PlayCards } from "./modules/cards/PokerCards";
import { PokerCard } from "./cards/poker-cards";

function useShopManager() {
  const [shop, setShop] = useState<IShop>(generateShop());
  const { balatro } = useCurrentGame();

  const shopPlugin = balatro?.getPlugin<ShopPlugin>("shop");

  if (shopPlugin == null) {
    return null;
  }

  useEffect(() => {
    if (balatro == null) {
      return;
    }
    balatro.onEvent("shop-rerolled", (shop) => setShop(shop));
    balatro.onEvent("shop-item-bought", (shop) => setShop(shop));
    balatro.onEvent("shop-phase-changed", (shop) => setShop(shop));
  }, [shopPlugin]);

  return shopPlugin;
}

interface ShopProps {}

export const Shop = ({}: ShopProps) => {
  const shopManager = useShopManager();

  if (!shopManager) return null;

  const shopPhase = shopManager.getPhase();

  return (
    <div className="rounded-2xl bg-zinc-900 bg-opacity-90 grid grid-rows-2 gap-2 p-4 border-red-500 border-2 h-full">
      {shopPhase === "buy" ? <ShopBuy /> : <OpenPack />}
    </div>
  );
};

export const ShopBuy = () => {
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
  const packs = shopManager.getPacks();

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-2 gap-2">
        <Button
          className=" bg-red-500 w-full h-full hover:bg-red-700 row-start-1"
          onClick={() => gameManager.startNextPhase()}
        >
          Next Round
        </Button>
        <Button
          className="bg-yellow-600 w-full h-full hover:bg-yellow-800 row-start-2"
          disabled={!shopManager.canReroll()}
          onClick={() => shopManager.rerollShop()}
        >
          Reroll {shopManager.getRerollPrice()}$
        </Button>
        <ShopZone className="col-span-3 row-span-2">
          <CardContainer>
            <CardItemContainer items={items} onBuy={handleBuyItem} />
          </CardContainer>
        </ShopZone>
      </div>
      <div className="grid grid-cols-2 gap-2 p-8">
        <ShopZone className="p-3">
          <div className="bg-zinc-900 p-2 rounded-xl h-full">voucher</div>
        </ShopZone>
        <ShopZone>
          <CardContainer>
            <CardItemContainer items={packs} onBuy={handleBuyItem} />
          </CardContainer>
        </ShopZone>
      </div>
    </>
  );
};

function useShopPackManager() {
  const [shopPlugin, setShopPlugin] = useState<ShopPackPlugin>();
  const { balatro } = useCurrentGame();

  if (balatro == null) {
    return null;
  }

  useEffect(() => {
    if (balatro == null) {
      return;
    }

    const shopPlugina = getShopPackPlugin(balatro);
    setShopPlugin(shopPlugina);
  }, [shopPlugin]);

  return shopPlugin;
}

export const OpenPack = () => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const shopManager = useShopPackManager();

  if (!shopManager) return null;

  const handleSkip = () => {
    shopManager.skipCard();
  };

  const cards = shopManager.getCards();

  const handleSelectCard = (pokerCard: PokerCard) => {
    if (pokerCard.id == selectedCard) {
      setSelectedCard(null);
    } else {
      setSelectedCard(pokerCard.id);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-center">
      <PlayCards
        pokerCards={cards}
        onSelectCard={handleSelectCard}
        selectedCards={selectedCard != null ? [selectedCard!] : []}
        bottomComponent={
          <Buy
            canBuy={true}
            onBuy={() => shopManager.pickCard(selectedCard!)}
          />
        }
      />
      <Button onClick={handleSkip}>Skip</Button>
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
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleSelectItem = (itemId: string) => {
    setSelectedItemId((prevId) => (prevId === itemId ? null : itemId));
  };

  return (
    <div className="flex flex-row gap-2 items-center">
      {items.map((shopItem) => {
        const isSelected =
          (shopItem?.type === "consumable" &&
            selectedItemId === shopItem.item?.id) ||
          (shopItem?.type === "buffon" &&
            selectedItemId === shopItem.buffon?.id);

        return (
          <div className="flex flex-col gap-2">
            {shopItem.type === "buffon" && (
              <BuffonCard
                selected={isSelected}
                key={shopItem.buffon.id}
                buffon={shopItem.buffon}
                onClick={() => handleSelectItem(shopItem.buffon.id)}
                hoverSide="left"
                topComponent={<PriceIndicator price={shopItem.price} />}
                bottomComponent={
                  <Buy canBuy={true} onBuy={() => onBuy(shopItem.buffon.id)} />
                }
              />
            )}
            {shopItem.type === "consumable" && (
              <ConsumableCard
                selected={isSelected}
                key={shopItem.item.id}
                consumable={shopItem.item}
                onClick={() => handleSelectItem(shopItem.item.id)}
                hoverSide="left"
                topComponent={<PriceIndicator price={shopItem.price} />}
                rightComponent={<BuyAndUse onBuyAnUse={() => {}} />}
                bottomComponent={
                  <Buy canBuy={true} onBuy={() => onBuy(shopItem.item.id)} />
                }
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

interface BuyProps {
  canBuy: boolean;
  onBuy: () => void;
}

const Buy = ({ onBuy, canBuy }: BuyProps) => {
  return (
    <button
      disabled={!canBuy}
      onClick={onBuy}
      className={cn("bg-amber-500 text-white rounded-2xl p-2", {
        "bg-amber-700": !canBuy,
      })}
    >
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
      <div className="bg-zinc-700 text-amber-400 rounded-2xl py-2 px-4 text-3xl font-bold">
        ${price}
      </div>
    </div>
  );
};

interface ShopZoneProps {
  className?: string;
  children: React.ReactNode;
}

export const ShopZone = ({ children, className }: ShopZoneProps) => {
  return (
    <div className={cn(className, "bg-neutral-600 rounded-2xl")}>
      {children}
    </div>
  );
};
