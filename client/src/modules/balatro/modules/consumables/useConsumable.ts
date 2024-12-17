import { useEffect, useState } from "react";
import { ConsumablesManagerPlugin } from "../../plugins";
import { useCurrentGame } from "../../BalatroProvider";

export function useConsumableManager() {
  const { balatro } = useCurrentGame();

  const [refresh, setRefresh] = useState(false);

  const consumableManager = balatro?.getPlugin<ConsumablesManagerPlugin>(
    "consumables-manager"
  );

  useEffect(() => {
    if (balatro == null) {
      return;
    }
    balatro.onEvent("consumable-added", () => setRefresh((prev) => !prev));
    balatro.onEvent("consumable-removed", () => setRefresh((prev) => !prev));
  }, [balatro]);

  if (consumableManager == null) {
    return null;
  }

  return consumableManager;
}
