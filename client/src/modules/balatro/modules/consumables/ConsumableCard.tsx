import {
  Consumable,
  ConsumableType,
} from "../../plugins/consumables-manager-plugin";
import { getTarotConfig } from "../../cards/tarots";
import { getPlanetConfig } from "../../cards/planets";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Card } from "@/components/ui/card";
import { ReactNode, useState } from "react";
import { cn } from "@/lib/utils";

interface ConsumableCardProps {
  consumable: Consumable;
  onClick?: () => void;
  onUse?: () => void;
  topComponent?: ReactNode;
  bottomComponent?: ReactNode;
  rightComponent?: ReactNode;
  hoverSide: "left" | "bottom";
  selected?: boolean;
}

export const ConsumableCard = ({
  selected,
  topComponent,
  bottomComponent,
  rightComponent,
  hoverSide,
  consumable,
  onClick,
}: ConsumableCardProps) => {
  return (
    <HoverCard openDelay={50} closeDelay={50}>
      <HoverCardTrigger>
        <div className={cn("relative", { "-translate-y-4": selected })}>
          <div className="flex flex-row items-center">
            <div className="flex flex-col items-center">
              <div className="absolute top-[-50px]">{topComponent}</div>
              <MovableCard>
                <ConsumableFactory consumable={consumable} onClick={onClick} />
              </MovableCard>
              {selected && (
                <div className="-z-20 absolute bottom-[-20px]">
                  {bottomComponent}
                </div>
              )}
            </div>
            {selected && (
              <div className="absolute right-[-60px] top-1/2 transform -translate-y-1/2 -z-20">
                {rightComponent}
              </div>
            )}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="bg-zinc-700" side={hoverSide}>
        <ConsumableDescription consumable={consumable} />
      </HoverCardContent>
    </HoverCard>
  );
};

interface ConsumableFactoryProps {
  consumable: Consumable;
  onClick?: () => void;
}

export const ConsumableFactory = ({
  consumable,
  onClick,
}: ConsumableFactoryProps) => {
  switch (consumable.type) {
    case "tarot":
      return <TarotCard tarot={consumable} onClick={onClick} />;
    case "planet":
      return <PlanetCard planet={consumable} onClick={onClick} />;
    default:
      return (
        <Card onClick={onClick}>
          <div>{consumable.name}</div>
          <div>{consumable.description}</div>
        </Card>
      );
  }
};

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

  const pos = getBackgroundPosition(config.position);

  return (
    <button
      onClick={onClick}
      className="card-consumables"
      style={{
        ...cardSizeStyle,
        ...cardConsumableBackgroundStyle,
        backgroundPositionX: pos.x,
        backgroundPositionY: pos.y,
      }}
    />
  );
};

interface PlanetCardProps {
  planet: Consumable;
  onClick?: () => void;
}

export const PlanetCard = ({ planet, onClick }: PlanetCardProps) => {
  const configId = planet.configId;

  const config = getPlanetConfig(configId);

  if (config == null) {
    return null;
  }

  const pos = getBackgroundPosition(config.position);

  return (
    <button
      onClick={onClick}
      className="card-consumables"
      style={{
        ...cardSizeStyle,
        ...cardConsumableBackgroundStyle,
        backgroundPositionX: pos.x,
        backgroundPositionY: pos.y,
      }}
    />
  );
};

interface ConsumableDescriptionProps {
  consumable: Consumable;
}

export const ConsumableDescription = ({
  consumable,
}: ConsumableDescriptionProps) => {
  return (
    <div className="flex flex-col items-center gap-2 ">
      <div className="text-white">{consumable.name}</div>
      <div className="min-w-fit bg-white rounded-2xl p-2">
        {consumable.description}
      </div>
      <ConsumableTypeTag type={consumable.type} />
    </div>
  );
};

export const ConsumableTypeTag = ({ type }: { type: ConsumableType }) => {
  const color = getConsumableTypeToColor(type);
  return (
    <div
      className="text-white px-8 py-2 rounded-2xl"
      style={{ backgroundColor: color }}
    >
      {getConsumableTypeToText(type)}
    </div>
  );
};

export function getConsumableTypeToText(type: ConsumableType) {
  switch (type) {
    case "tarot":
      return "Tarot";
    case "planet":
      return "Planet";
  }
}

export function getConsumableTypeToColor(type: ConsumableType) {
  switch (type) {
    case "tarot":
      return "#448811";
    case "planet":
      return "#148811";
  }
}

interface Position {
  x: number;
  y: number;
}

const SIZE_FACTOR = 2;

const CARD_X_SIZE = 71 * SIZE_FACTOR;
const CARD_Y_SIZE = 95 * SIZE_FACTOR;

const cardSizeStyle = {
  width: `${CARD_X_SIZE}px`,
  height: `${CARD_Y_SIZE}px`,
};

function getBackgroundPosition(position: Position): Position {
  return {
    x: -(position.x * CARD_X_SIZE),
    y: -(position.y * CARD_Y_SIZE),
  };
}

const cardConsumableBackgroundStyle = {
  backgroundSize: `${CARD_X_SIZE * 10}px ${CARD_Y_SIZE * 6}px`,
};

const MovableCard = ({ children }: { children: React.ReactNode }) => {
  return <div className="custom-card">{children}</div>;
};
