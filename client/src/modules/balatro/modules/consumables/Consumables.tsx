import { useState } from "react";
import { ConsumableCard } from "./ConsumableCard";
import { useConsumableManager } from "./useConsumable";
import { Consumable } from "../../plugins";
import { CardContainer } from "../../BalatroPage";
import { isSellable } from "../../cards/cards";
import { SellCard } from "./SellCard";
import { UseCard } from "./UseCard";

interface ConsumableListProps {}

export const ConsumableList = ({}: ConsumableListProps) => {
  const [selectedItem, setSelectedItem] = useState<Consumable | null>(null);

  const { consumableManager, consumables } = useConsumableManager();

  if (consumableManager == null) {
    return null;
  }

  const handleUseConsumable = (consumableId: string) => {
    consumableManager.useConsumable(consumableId);
  };

  const handleSellConsumable = (consumableId: string) => {
    consumableManager.sellConsumable(consumableId);
  };

  return (
    <CardContainer
      currentCount={consumables.length}
      maxCount={consumableManager.getMaxCount()}
    >
      <div className="flex flex-row gap-2">
        {consumables.map((consumable) => (
          <ConsumableCard
            selected={selectedItem?.id === consumable.id}
            key={consumable.id}
            consumable={consumable}
            hoverSide="bottom"
            onClick={() =>
              setSelectedItem(
                selectedItem?.id === consumable.id ? null : consumable
              )
            }
            rightComponent={
              <div className="flex flex-col gap-2">
                {isSellable(consumable) && (
                  <SellCard
                    sellable={consumable}
                    onSell={() => handleSellConsumable(consumable.id)}
                  />
                )}
                <UseCard onUse={() => handleUseConsumable(consumable.id)} />
              </div>
            }
          />
        ))}
      </div>
    </CardContainer>
  );
};
