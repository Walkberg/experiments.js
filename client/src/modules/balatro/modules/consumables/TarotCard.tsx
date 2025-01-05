import { getTarotConfig } from "../../cards/tarots";
import { Consumable } from "../../plugins";
import {
  getBackgroundPosition,
  getCardSizeStyle,
  getCardConsumableBackgroundStyle,
} from "./card";
import { SIZE_FACTOR } from "./card";

interface TarotCardProps {
  tarot: Consumable;
  onClick?: () => void;
}

export const TarotCard = ({ tarot, onClick }: TarotCardProps) => {
  const configId = tarot.configId;

  const config = getTarotConfig(configId);

  if (!config) {
    return null;
  }

  const pos = getBackgroundPosition(config.position, SIZE_FACTOR);

  return (
    <button
      onClick={onClick}
      className="card-consumables"
      style={{
        ...getCardSizeStyle(SIZE_FACTOR),
        ...getCardConsumableBackgroundStyle(SIZE_FACTOR),
        backgroundPositionX: pos.x,
        backgroundPositionY: pos.y,
      }}
    />
  );
};
