import { v4 as uuid } from "uuid";
import { Consumable, ConsumableType } from "../plugins";

export function createBaseConsumable({
  name,
  description,
  type,
  configId,
}: {
  name: string;
  description: string;
  type: "planet" | "tarot";
  configId: string;
}): Consumable {
  function getBuyPrice() {
    return 3;
  }

  function getSellPrice() {
    return Math.floor(getBuyPrice() / 2);
  }

  return {
    id: uuid(),
    name: name,
    type: type,
    description,
    configId,
    getBuyPrice,
    getSellPrice,
  };
}
