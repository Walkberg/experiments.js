import { Consumable } from "../../plugins/consumables-manager-plugin";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { PlanetCard } from "./PlanetCard";
import { Pack } from "./Pack";
import { TarotCard } from "./TarotCard";
import { ConsumableDescription } from "./ConsumableDescription";

interface ConsumableCardProps {
  consumable: Consumable;
  onClick?: () => void;
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
        <div className={cn("relative", { "-translate-y-4 z-20": selected })}>
          <div
            className={cn(
              "absolute inset-0 bg-gray-700 opacity-50 translate-x-1 -z-50 translate-y-1 rounded-xl"
            )}
          />
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
    case "pack":
      return <Pack pack={consumable} onClick={onClick} />;
    default:
      return null;
  }
};

const MovableCard = ({ children }: { children: React.ReactNode }) => {
  return <div className="custom-card">{children}</div>;
};
