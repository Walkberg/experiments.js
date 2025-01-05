import "../../test.css";
import { Card } from "@/components/ui/card";
import { getCardLabel, getBaseChip, getCardChips } from "../../balatro";
import {
  PokerCard as ICard,
  CardSuit,
  CardRank,
  EditionType,
  EnhancementType,
  SealType,
} from "../../cards/poker-cards";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ReactNode, useRef, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { cn } from "@/lib/utils";

interface PokerCardProps {
  card: ICard;
  onSelectCard?: () => void;
  selected?: boolean;
  bottomComponent?: ReactNode;
  scaleFactor?: number;
}

export const PokerCard = ({
  card,
  onSelectCard,
  selected,
  bottomComponent,
  scaleFactor = 2,
}: PokerCardProps) => {
  return (
    <HoverCard openDelay={50} closeDelay={50}>
      <HoverCardTrigger>
        <div className={cn(selected ? "-translate-y-20 scale-110" : "")}>
          <div
            className={cn(
              "absolute inset-0 bg-gray-700 opacity-50 translate-x-2 translate-y-2 rounded-xl"
            )}
          />
          <AnimatedCard>
            <Card
              onClick={onSelectCard}
              className={cn(
                "flex flex-col cursor-pointer hover:shadow-indigo-500/60 hover:scale-125"
              )}
            >
              <CardEnhancer card={card} scaleFactor={scaleFactor}>
                <CardEdition card={card} scaleFactor={scaleFactor}>
                  <CardView card={card} scaleFactor={scaleFactor}>
                    <CardSeal card={card} scaleFactor={scaleFactor} />
                  </CardView>
                </CardEdition>
              </CardEnhancer>
            </Card>
          </AnimatedCard>
        </div>
        {selected && (
          <div className="-z-20 absolute bottom-[-20px]">{bottomComponent}</div>
        )}
      </HoverCardTrigger>
      <HoverCardContent side="top">
        <div className="flex flex-col items-center gap-2">
          <Card className="p-2">{replaceTextByCustom(getCardLabel(card))}</Card>
          <Card className="p-2">
            {replaceTextByCustom(getCardDescription(card))}
          </Card>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};

interface CardBackgroundProps {
  scaleFactor: number;
  card: ICard;
  children?: ReactNode;
}

export const CardBackground = ({ card, children }: CardBackgroundProps) => {
  return <div className="test-card">{children}</div>;
};

export const CardEdition = ({
  card,
  scaleFactor,
  ...props
}: CardBackgroundProps) => {
  const position = getCardEditionPosition(card.edition);
  return (
    <div
      style={{
        ...getCardSizeStyle(scaleFactor),
        ...cardEditionBackgroundStyle(scaleFactor),
        backgroundPositionX: position.x * -1 * CARD_X_SIZE * scaleFactor,
        backgroundPositionY: position.y * -1 * CARD_Y_SIZE * scaleFactor,
      }}
      className={cn("card-edition", { negative: card.edition === "negative" })}
      {...props}
    />
  );
};

export const CardEnhancer = ({
  card,
  scaleFactor,
  ...props
}: CardBackgroundProps) => {
  const position = getCardEnhancementPosition(card.enhancement);
  return (
    <div
      style={{
        ...getCardSizeStyle(scaleFactor),
        ...getCardEnhancementBackgroundStyle(scaleFactor),
        backgroundPositionX: position.x * -1 * CARD_X_SIZE * scaleFactor,
        backgroundPositionY: position.y * -1 * CARD_Y_SIZE * scaleFactor,
      }}
      className="card-enhancer"
      {...props}
    />
  );
};

export const CardSeal = ({
  card,
  scaleFactor,
  ...props
}: CardBackgroundProps) => {
  const position = getCardSealPosition(card.seal);
  return (
    <div
      style={{
        ...getCardSizeStyle(scaleFactor),
        ...getCardEnhancementBackgroundStyle(scaleFactor),
        backgroundPositionX: position.x * -1 * CARD_X_SIZE * scaleFactor,
        backgroundPositionY: position.y * -1 * CARD_Y_SIZE * scaleFactor,
      }}
      className="card-enhancer"
      {...props}
    />
  );
};

export const CardView = ({
  card,
  scaleFactor,
  ...props
}: CardBackgroundProps) => {
  return (
    <div
      style={{
        ...getCardSizeStyle(scaleFactor),
        ...cardRankBackgroundStyle(scaleFactor),
        backgroundPositionX:
          getCardRankPosition(card.rank) * -1 * CARD_X_SIZE * scaleFactor,
        backgroundPositionY:
          getCardSuitPosition(card.suit) * -1 * CARD_Y_SIZE * scaleFactor,
      }}
      className="card-rank"
      {...props}
    />
  );
};

interface AnimatedCardProps {
  children: ReactNode;
}

export const AnimatedCard = ({ children }: AnimatedCardProps) => {
  const [styles] = useSpring(
    () => ({
      config: { mass: 0.5, tension: 1, friction: 1, clamp: true },
      loop: { reverse: true },
      delay: Math.random() * 500,
      from: { y: 5, rotateZ: 3 },
      to: { y: -5, rotateZ: -3 },
    }),
    []
  );

  const [style, setStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y - rect.height / 2) / 1;
    const rotateY = (x - rect.width / 2) / -1;

    setStyle({
      transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
      transition: "transform 0.1s ease",
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: "rotateX(0) rotateY(0)",
      transition: "transform 0.5s ease",
    });
  };

  const handleMouseHover = () => {
    setStyle({
      transform: "rotateX(0) rotateY(0)",
      transition: "transform 0.5s ease",
    });
  };

  const constrain = 5;
  const cardRef = useRef(null);

  const transforms = (x: number, y: number, el: HTMLDivElement): string => {
    el.style.transform = "";
    const box = el.getBoundingClientRect();

    const calcX =
      -(y - box.y - box.height / 2) /
      (el.dataset.scale === "2" ? constrain * 2 : constrain);
    const calcY =
      (x - box.x - (box.width || 71) / 2) /
      (el.dataset.scale === "2" ? constrain * 2 : constrain);

    if (box.width === 0) {
      return (
        `translate(35.5px) perspective(${94}px) ` +
        `rotateX(${calcX}deg) ` +
        `rotateY(${calcY}deg) translate(-35.5px)`
      );
    }

    return (
      `perspective(${94}px) ` + `rotateX(${calcX}deg) ` + `rotateY(${calcY}deg)`
    );
  };

  const hoverCard = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const position = [e.clientX, e.clientY];

    target.style.transform = transforms(position[0], position[1], target);
  };

  const noHoverCard = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.transform = "";
  };

  return (
    <animated.div style={{ ...styles }}>
      <div
        ref={cardRef}
        style={style}
        //onMouseMove={handleMouseMove}
        onMouseMove={hoverCard}
        onMouseOut={noHoverCard}
        onMouseLeave={handleMouseLeave}
        onMouseOver={handleMouseHover}
      >
        {children}
      </div>
    </animated.div>
  );
};

const CARD_X_SIZE = 71;
const CARD_Y_SIZE = 95;

function getCardSuitPosition(cardSuit: CardSuit): number {
  switch (cardSuit) {
    case "hearts":
      return 0;
    case "diamonds":
      return 2;
    case "spades":
      return 3;
    case "clubs":
      return 1;
  }
}

function getCardRankPosition(cardRank: CardRank): number {
  return getCardChips(cardRank) - 2;
}

const editionPosition = {
  base: { x: 0, y: 0 },
  foil: { x: 1, y: 0 },
  holographic: { x: 2, y: 0 },
  polychrome: { x: 3, y: 0 },
  negative: { x: 0, y: 0 },
};

function getCardEditionPosition(type: EditionType): Position {
  return editionPosition[type];
}

const enhancementPosition = {
  none: { x: 1, y: 0 },
  bonus: { x: 1, y: 1 },
  mult: { x: 2, y: 1 },
  wildcard: { x: 3, y: 1 },
  glass: { x: 5, y: 1 },
  steel: { x: 6, y: 1 },
  stone: { x: 5, y: 0 },
  gold: { x: 6, y: 0 },
  lucky: { x: 4, y: 2 },
};

function getCardEnhancementPosition(type: EnhancementType): Position {
  return enhancementPosition[type];
}

const sealPosition = {
  none: { x: -1, y: -1 },
  gold: { x: 2, y: 0 },
  red: { x: 5, y: 4 },
  blue: { x: 6, y: 4 },
  purple: { x: 4, y: 4 },
};

function getCardSealPosition(type: SealType): Position {
  return sealPosition[type];
}

interface Position {
  x: number;
  y: number;
}

function replaceTextByCustom(text: string): JSX.Element {
  const replacements: Record<string, string> = {
    multc: `<span style='color: #ff4d40'>`,
    prodc: `<span style='color: #fff; background-color: #ff4d40; border-left: solid; border: solid; border-color: #ff4d40; border-width: 0px 2px 1px 2px; padding-left: 1px; border-radius: 3px;'>X`,
    chipc: `<span style='color: #009dff'>`,
    numc: `<span style='color: #ff8f00'>`,
    moneyc: `<span style='color: #f5b143'>`,
    probc: `<span style='color: #35bd87'>`,
    diamondsc: `<span style='color: #f15a27'>Diamonds</span>`,
    heartsc: `<span style='color: #f11b51'>Hearts</span>`,
    spadesc: `<span style='color: #242c56'>Spades</span>`,
    clubsc: `<span style='color: #074540'>Clubs</span>`,
    endc: `</span>`,
  };

  const regex = /\${(.*?)}/g;

  const replacedText = text.replace(regex, (_, match) => {
    return replacements[match] || "";
  });

  return (
    <span
      dangerouslySetInnerHTML={{
        __html: replacedText,
      }}
    />
  );
}

const ENHANCEMENT_TILE_SIZE_X = 7;
const ENHANCEMENT_TILE_SIZE_Y = 5;

const CARD_RANK_TILE_SIZE_X = 13;
const CARD_RANK_TILE_SIZE_Y = 4;

const EDITION_TILE_SIZE_X = 5;
const EDITION_TILE_SIZE_Y = 1;

function getCardDescription(card: ICard) {
  return `\${chipc} +${getBaseChip(card)} \${endc} chips`;
}

const getCardSizeStyle = (scaleFactor: number) => {
  return {
    width: `${CARD_X_SIZE * scaleFactor}px`,
    height: `${CARD_Y_SIZE * scaleFactor}px`,
  };
};

const getCardEnhancementBackgroundStyle = (scaleFactor: number) => ({
  backgroundSize: `${CARD_X_SIZE * ENHANCEMENT_TILE_SIZE_X * scaleFactor}px ${
    CARD_Y_SIZE * ENHANCEMENT_TILE_SIZE_Y * scaleFactor
  }px`,
});

const cardRankBackgroundStyle = (scaleFactor: number) => ({
  backgroundSize: `${CARD_X_SIZE * CARD_RANK_TILE_SIZE_X * scaleFactor}px ${
    CARD_Y_SIZE * CARD_RANK_TILE_SIZE_Y * scaleFactor
  }px`,
});

const cardEditionBackgroundStyle = (scaleFactor: number) => ({
  backgroundSize: `${CARD_X_SIZE * EDITION_TILE_SIZE_X * scaleFactor}px ${
    CARD_Y_SIZE * EDITION_TILE_SIZE_Y * scaleFactor
  }px`,
});
