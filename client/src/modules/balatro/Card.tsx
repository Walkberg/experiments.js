import "./test.css";
import { Card } from "@/components/ui/card";
import { getCardLabel, getBaseChip, getCardChips } from "./balatro";
import {
  PokerCard as ICard,
  CardSuit,
  CardRank,
  EditionType,
  EnhancementType,
  SealType,
} from "./cards/poker-cards";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ReactNode, useState } from "react";
import { animated, useSpring } from "@react-spring/web";
import { cn } from "@/lib/utils";

interface PlayCardProps {
  card: ICard;
  onSelectCard?: () => void;
  selected?: boolean;
}

export const PlayCard = ({ card, onSelectCard, selected }: PlayCardProps) => {
  return (
    <HoverCard openDelay={50} closeDelay={50}>
      <HoverCardTrigger>
        <AnimatedCard card={card}>
          <Card
            onClick={onSelectCard}
            className={cn(
              "flex flex-col cursor-pointer hover:shadow-indigo-500/60 hover:scale-125",
              selected ? "-translate-y-20 scale-110" : ""
            )}
          >
            <CardEnhancer card={card}>
              <CardEdition card={card}>
                <CardView card={card}>
                  <CardSeal card={card} />
                </CardView>
              </CardEdition>
            </CardEnhancer>
          </Card>
        </AnimatedCard>
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
  card: ICard;
  children?: ReactNode;
}

export const CardBackground = ({ card, children }: CardBackgroundProps) => {
  return <div className="test-card">{children}</div>;
};

export const CardEdition = ({ card, ...props }: CardBackgroundProps) => {
  const position = getCardEditionPosition(card.edition);
  return (
    <div
      style={{
        ...cardSizeStyle,
        ...cardEditionBackgroundStyle,
        backgroundPositionX: position.x,
        backgroundPositionY: position.y,
      }}
      className={cn("card-edition", { negative: card.edition === "negative" })}
      {...props}
    />
  );
};

export const CardEnhancer = ({ card, ...props }: CardBackgroundProps) => {
  const position = getCardEnhancementPosition(card.enhancement);
  return (
    <div
      style={{
        ...cardSizeStyle,
        ...cardBackgroundStyle,
        backgroundPositionX: position.x,
        backgroundPositionY: position.y,
      }}
      className="card-enhancer"
      {...props}
    />
  );
};

export const CardSeal = ({ card, ...props }: CardBackgroundProps) => {
  const position = getCardSealPosition(card.seal);
  return (
    <div
      style={{
        ...cardSizeStyle,
        ...cardBackgroundStyle,
        backgroundPositionX: position.x,
        backgroundPositionY: position.y,
      }}
      className="card-enhancer"
      {...props}
    />
  );
};

export const CardView = ({ card, ...props }: CardBackgroundProps) => {
  return (
    <div
      style={{
        ...cardSizeStyle,
        ...cardRankBackgroundStyle,
        backgroundPositionX: getCardRankPosition(card.rank),
        backgroundPositionY: getCardSuitPosition(card.suit),
      }}
      className="card-rank"
      {...props}
    />
  );
};

export const AnimatedCard = ({ children }: CardBackgroundProps) => {
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

  return (
    <animated.div style={{ ...styles }}>
      <div
        style={style}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
    </animated.div>
  );
};

const SIZE_FACTOR = 2;

const CARD_X_SIZE = 71 * SIZE_FACTOR;
const CARD_Y_SIZE = 95 * SIZE_FACTOR;

function getCardSuitPosition(cardSuit: CardSuit): number {
  switch (cardSuit) {
    case "hearts":
      return -CARD_Y_SIZE * 0;
    case "diamonds":
      return -CARD_Y_SIZE * 2;
    case "spades":
      return -CARD_Y_SIZE * 3;
    case "clubs":
      return -CARD_Y_SIZE * 1;
  }
}

function getCardRankPosition(cardRank: CardRank): number {
  return (getCardChips(cardRank) - 2) * -CARD_X_SIZE;
}

const editionPosition = {
  base: { x: 0 * -CARD_X_SIZE, y: 0 * -CARD_Y_SIZE },
  foil: { x: -CARD_X_SIZE, y: 0 * -CARD_Y_SIZE },
  holographic: { x: -CARD_X_SIZE * 2, y: 0 * -CARD_Y_SIZE },
  polychrome: { x: -CARD_X_SIZE * 3, y: 0 * -CARD_Y_SIZE },
  negative: { x: 0 * -CARD_X_SIZE, y: 0 * -CARD_Y_SIZE },
};

function getCardEditionPosition(type: EditionType): Position {
  return editionPosition[type];
}

const enhancementPosition = {
  none: { x: 0, y: 1 * CARD_Y_SIZE },
  bonus: { x: -CARD_X_SIZE, y: 1 * -CARD_Y_SIZE },
  mult: { x: -CARD_X_SIZE * 2, y: 1 * -CARD_Y_SIZE },
  wildcard: { x: -CARD_X_SIZE * 3, y: 1 * -CARD_Y_SIZE },
  glass: { x: -CARD_X_SIZE * 5, y: 1 * -CARD_Y_SIZE },
  steel: { x: -CARD_X_SIZE * 6, y: 1 * -CARD_Y_SIZE },
  stone: { x: -CARD_X_SIZE * 5, y: 0 * -CARD_Y_SIZE },
  gold: { x: -CARD_X_SIZE * 6, y: 0 * -CARD_Y_SIZE },
  lucky: { x: -CARD_X_SIZE * 4, y: 2 * -CARD_Y_SIZE },
};

function getCardEnhancementPosition(type: EnhancementType): Position {
  return enhancementPosition[type];
}

const sealPosition = {
  none: { x: -1 * -CARD_X_SIZE, y: -1 * -CARD_X_SIZE },
  gold: { x: 2 * -CARD_X_SIZE, y: 0 * -CARD_X_SIZE },
  red: { x: -CARD_X_SIZE * 5, y: 4 * -CARD_X_SIZE },
  blue: { x: -CARD_X_SIZE * 6, y: 4 * -CARD_X_SIZE },
  purple: { x: -CARD_X_SIZE * 4, y: 4 * -CARD_X_SIZE },
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

function getCardDescription(card: ICard) {
  return `\${chipc} +${getBaseChip(card)} \${endc} chips`;
}

const cardSizeStyle = {
  width: `${CARD_X_SIZE}px`,
  height: `${CARD_Y_SIZE}px`,
};

const cardBackgroundStyle = {
  backgroundSize: `${CARD_X_SIZE * 7}px ${CARD_Y_SIZE * 5}px`,
};

const cardRankBackgroundStyle = {
  backgroundSize: `${CARD_X_SIZE * 13}px ${CARD_Y_SIZE * 4}px`,
};

const cardEditionBackgroundStyle = {
  backgroundSize: `${CARD_X_SIZE * 5}px ${CARD_Y_SIZE * 1}px`,
};
