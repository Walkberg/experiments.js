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
import { ReactNode } from "react";
import { animated, useSpring } from "@react-spring/web";
import { cn } from "@/lib/utils";

interface PlayCardProps {
  card: ICard;
  onSelectCard?: () => void;
  selected?: boolean;
}

export const PlayCard = ({ card, onSelectCard, selected }: PlayCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <AnimatedCard card={card}>
          <Card
            onClick={onSelectCard}
            className={cn(
              "flex flex-col cursor-pointer hover:shadow-indigo-500/60",
              selected ? "translate-y-2" : ""
            )}
          >
            <CardEdition card={card}>
              <CardEnhancer card={card}>
                <CardView card={card}>
                  <CardSeal card={card} />
                </CardView>
              </CardEnhancer>
            </CardEdition>
          </Card>
        </AnimatedCard>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className="flex flex-col items-center gap-4">
          <Card className="p-4">{getCardLabel(card)}</Card>
          <Card className="p-4">+ {getBaseChip(card)} chips</Card>
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

  return (
    <animated.div style={{ ...styles }} className="bg-purple-200 ">
      {children}
    </animated.div>
  );
};

const CARD_X_SIZE = 71;
const CARD_Y_SIZE = 95;

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
