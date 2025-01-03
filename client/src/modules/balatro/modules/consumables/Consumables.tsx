import { useState } from "react";
import { ConsumableCard } from "./ConsumableCard";
import { useConsumableManager } from "./useConsumable";
import { Consumable } from "../../plugins";

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
    //consumableManager.useConsumable(consumableId);
  };

  return (
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
              <SellCard onSell={() => handleSellConsumable(consumable.id)} />
              <UseCard onUse={() => handleUseConsumable(consumable.id)} />
            </div>
          }
        />
      ))}
    </div>
  );
};

export const SellCard = ({ onSell }: { onSell: () => void }) => {
  return (
    <button
      onClick={() => onSell()}
      className="bg-green-500 hover:bg-green-700  text-white font-bold py-2 px-4 rounded"
    >
      Vendre
      <br />
      $5
    </button>
  );
};

export const UseCard = ({ onUse }: { onUse: () => void }) => {
  return (
    <button
      onClick={() => onUse()}
      className="bg-red-500 hover:bg-red-700  text-white font-bold py-2 px-4 rounded"
    >
      Utiliser
    </button>
  );
};
