import { Shop as IShop, generateShop } from "../../balatro";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CardContainer, useGameManager } from "../../BalatroPage";
import { Buyable, ShopPlugin } from "../../plugins/shop-plugin";
import { useCurrentGame } from "../../BalatroProvider";
import { ConsumableCard } from "../consumables/ConsumableCard";
import { cn } from "@/lib/utils";
import { BuffonCard } from "../buffons/BuffonCard";
import {
  getShopPackPlugin,
  ShopPackPlugin,
} from "../../plugins/shop-pack-plugin";
import { PlayCards } from "../cards/PokerCards";
import { PokerCard } from "../../cards/poker-cards";
import { isBuyable } from "../../cards/cards";
import { PriceIndicator } from "./PriceIndicator";
import { Buy } from "./Buy";
import { BuyAndUse } from "./BuyAndUse";

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
        const isSelected = selectedItemId === shopItem?.id;

        return (
          <div className="flex flex-col gap-2">
            {shopItem.type === "buffon" && (
              <BuffonCard
                selected={isSelected}
                key={shopItem.id}
                buffon={shopItem}
                onClick={() => handleSelectItem(shopItem.id)}
                hoverSide="left"
                topComponent={<PriceIndicator price={shopItem.getBuyPrice()} />}
                bottomComponent={
                  <Buy canBuy={true} onBuy={() => onBuy(shopItem.id)} />
                }
              />
            )}
            {(shopItem.type === "tarot" ||
              shopItem.type === "planet" ||
              shopItem.type === "pack") && (
              <ConsumableCard
                selected={isSelected}
                key={shopItem.id}
                consumable={shopItem}
                onClick={() => handleSelectItem(shopItem.id)}
                hoverSide="left"
                topComponent={<PriceIndicator price={shopItem.getBuyPrice()} />}
                rightComponent={<BuyAndUse onBuyAnUse={() => {}} />}
                bottomComponent={
                  isBuyable(shopItem) && (
                    <Buy canBuy={true} onBuy={() => onBuy(shopItem.id)} />
                  )
                }
              />
            )}
          </div>
        );
      })}
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
