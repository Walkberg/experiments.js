import { useEffect, useState } from "react";
import { Consumable, ConsumablesManagerPlugin } from "../../plugins";
import { useCurrentGame } from "../../BalatroProvider";

export function useConsumableManager() {
  const { balatro } = useCurrentGame();

  const consumableManager = balatro?.getPlugin<ConsumablesManagerPlugin>(
    "consumables-manager"
  );

  const [consumables, setConsumable] = useState<Consumable[]>([]);

  useEffect(() => {
    if (balatro == null) {
      return;
    }
    if (consumableManager == null) {
      return;
    }
    balatro.onEvent("consumable-added", () =>
      setConsumable(consumableManager.getConsumables())
    );
    balatro.onEvent("consumable-removed", () =>
      setConsumable(consumableManager.getConsumables())
    );
  }, [balatro]);

  return { consumableManager, consumables };
}
