import { ConsumableCard } from "./ConsumableCard";
import { useConsumableManager } from "./useConsumable";

interface ConsumableListProps {}

export const ConsumableList = ({}: ConsumableListProps) => {
  const consumableManager = useConsumableManager();

  if (consumableManager == null) {
    return null;
  }

  const handleUseConsumable = (consumableId: string) => {
    consumableManager.useConsumable(consumableId);
  };

  return (
    <div className="flex flex-row gap-2">
      {consumableManager.getConsumables().map((consumable) => (
        <ConsumableCard
          key={consumable.id}
          consumable={consumable}
          onUse={() => handleUseConsumable(consumable.id)}
          hoverSide="bottom"
        />
      ))}
    </div>
  );
};
