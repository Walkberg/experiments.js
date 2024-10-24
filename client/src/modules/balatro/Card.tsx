import "./test.css";
import { Card } from "@/components/ui/card";
import {
  PokerCard as ICard,
  CardSuit,
  getCardLabel,
  getBaseChip,
  getCardChips,
  CardRank,
} from "./balatro";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { ReactNode } from "react";
import { animated, useSpring } from "@react-spring/web";

interface PlayCardProps {
  card: ICard;
  onSelectCard: () => void;
}

export const PlayCard = ({ card, onSelectCard }: PlayCardProps) => {
  return (
    <HoverCard>
      <HoverCardTrigger>
        <AnimatedCard card={card}>
          <Card
            onClick={onSelectCard}
            className="flex flex-col cursor-pointer hover:shadow-indigo-500/60"
          >
            <CardEdition card={card}>
              <CardEnhancer card={card}>
                <CardView card={card}>sd</CardView>
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
  children: ReactNode;
}

export const CardBackground = ({ children }: CardBackgroundProps) => {
  return <div className="test-card">{children}</div>;
};

export const CardEdition = ({ children }: CardBackgroundProps) => {
  return <div className="card-edition">{children}</div>;
};

export const CardEnhancer = ({ children }: CardBackgroundProps) => {
  return <div className="card-enhancer">{children}</div>;
};

export const CardView = ({ children, card }: CardBackgroundProps) => {
  return (
    <div
      style={{
        backgroundPositionX: getCardRankPosition(card.rank),
        backgroundPositionY: getCardSuitPosition(card.suit),
      }}
      className="card-rank"
    >
      {children}
    </div>
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
  console.log(getCardChips(cardRank));
  return (getCardChips(cardRank) - 2) * -CARD_X_SIZE;
}
