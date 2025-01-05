import { getPackConfig } from "../../cards/packs";
import { Consumable } from "../../plugins";
import { getBackgroundPosition, getCardSizeStyle } from "./card";
import { CARD_X_SIZE, CARD_Y_SIZE, SIZE_FACTOR } from "./card";

interface PackCardProps {
  pack: Consumable;
  onClick?: () => void;
}

export const Pack = ({ pack, onClick }: PackCardProps) => {
  const configId = pack.configId;

  const config = getPackConfig(configId);

  if (config == null) {
    return null;
  }

  const pos = getBackgroundPosition(config.position, SIZE_FACTOR);

  return (
    <button
      onClick={onClick}
      className="pack"
      style={{
        ...getCardSizeStyle(SIZE_FACTOR),
        ...getPackBackgroundStyle(SIZE_FACTOR),
        backgroundPositionX: pos.x,
        backgroundPositionY: pos.y,
      }}
    />
  );
};

export const getPackBackgroundStyle = (scaleFactor: number) => ({
  backgroundSize: `${CARD_X_SIZE * scaleFactor * 4}px ${
    CARD_Y_SIZE * scaleFactor * 9
  }px`,
});
