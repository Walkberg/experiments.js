export const SIZE_FACTOR = 2;

export const CARD_X_SIZE = 71;
export const CARD_Y_SIZE = 95;

interface Position {
  x: number;
  y: number;
}

export const getCardSizeStyle = (scaleFactor: number) => ({
  width: `${CARD_X_SIZE * scaleFactor}px`,
  height: `${CARD_Y_SIZE * scaleFactor}px`,
});

export function getBackgroundPosition(
  position: Position,
  scaleFactor: number
): Position {
  return {
    x: -(position.x * CARD_X_SIZE * scaleFactor),
    y: -(position.y * CARD_Y_SIZE * scaleFactor),
  };
}

export const getCardConsumableBackgroundStyle = (scaleFactor: number) => ({
  backgroundSize: `${CARD_X_SIZE * scaleFactor * 10}px ${
    CARD_Y_SIZE * scaleFactor * 6
  }px`,
});
