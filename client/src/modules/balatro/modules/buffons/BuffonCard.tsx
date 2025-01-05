import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { BuffonCard as Buffon, getBuffonConfig } from "../../cards/buffons";

interface BuffonCardProps {
  buffon: Buffon;
  onClick?: () => void;
  topComponent?: ReactNode;
  bottomComponent?: ReactNode;
  rightComponent?: ReactNode;
  hoverSide: "left" | "bottom";
  selected?: boolean;
}

export const BuffonCard = ({
  selected,
  topComponent,
  bottomComponent,
  rightComponent,
  hoverSide,
  buffon,
  onClick,
}: BuffonCardProps) => {
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
                <BuffonCarda buffon={buffon} onClick={onClick} />
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
        <BuffonDescription buffon={buffon} />
      </HoverCardContent>
    </HoverCard>
  );
};

interface BuffonCardaProps {
  buffon: Buffon;
  onClick?: () => void;
}

export const BuffonCarda = ({ buffon, onClick }: BuffonCardaProps) => {
  const configId = buffon.configId;

  const config = getBuffonConfig(configId);

  if (!config) {
    return null;
  }

  const pos = getBackgroundPosition(config.position);

  return (
    <button
      onClick={onClick}
      className="card-buffon"
      style={{
        ...cardSizeStyle,
        ...cardConsumableBackgroundStyle,
        backgroundPositionX: pos.x,
        backgroundPositionY: pos.y,
      }}
    />
  );
};

interface BuffonDescriptionProps {
  buffon: Buffon;
}

export const BuffonDescription = ({ buffon }: BuffonDescriptionProps) => {
  return (
    <div className="flex flex-col items-center gap-2 ">
      <div className="text-white">{buffon.name}</div>
      <div className="min-w-fit bg-white rounded-2xl p-2">
        {buffon.description}
      </div>
      <BuffonTypeTag />
    </div>
  );
};

export const BuffonTypeTag = ({}: {}) => {
  return (
    <div
      className="text-white px-8 py-2 rounded-2xl"
      style={{ backgroundColor: "#11ff11" }}
    >
      Commun
    </div>
  );
};

interface Position {
  x: number;
  y: number;
}

const SIZE_FACTOR = 2;

const CARD_X_SIZE = 71 * SIZE_FACTOR;
const CARD_Y_SIZE = 95 * SIZE_FACTOR;

const SPREADSHEET_HEIGHT = 16;
const SPREADSHEET_WIDTH = 10;

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
  backgroundSize: `${CARD_X_SIZE * SPREADSHEET_WIDTH}px ${
    CARD_Y_SIZE * SPREADSHEET_HEIGHT
  }px`,
};

const MovableCard = ({ children }: { children: React.ReactNode }) => {
  return <div className="custom-card">{children}</div>;
};
