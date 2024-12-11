import { v4 as uuid } from "uuid";
import { Consumable, ConsumableType } from "../plugins";

export function createBaseConsumable({
  name,
  description,
  type,
}: {
  name: string;
  description: string;
  type: ConsumableType;
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
    getBuyPrice,
    getSellPrice,
  };
}
