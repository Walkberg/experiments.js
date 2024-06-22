import { Card } from "@/components/ui/card";
import {
  BoardResolved,
  CardAttacked,
  Card as CardModel,
  DomainEvent,
  Side,
  board,
} from "./batteground";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { useSpring, animated } from "@react-spring/web";
import {
  BattlegroundApiProvider,
  BattlegroundProvider,
  useCardRefs,
  useShop,
} from "./battleground.provider";
import { DropZone } from "../drive/components/DropZone";
import { Player } from "./components/player/player";
import { Shop } from "./components/shop/shop";

export const BattlegroundPage = () => {
  return (
    <BattlegroundApiProvider>
      <BattlegroundProvider>
        <BattleGround />
      </BattlegroundProvider>
    </BattlegroundApiProvider>
  );
};

const BattleGround = () => {
  const [gamePhase, setGamePhase] = useState<"shopping" | "battle" | "end">(
    "shopping"
  );

  const setNextStep = () => {
    if (gamePhase === "shopping") {
      setGamePhase("battle");
    } else if (gamePhase === "battle") {
      setGamePhase("end");
    }
  };

  return (
    <div>
      {gamePhase === "shopping" && <Shop />}
      {gamePhase === "battle" && <Battle />}
      {gamePhase === "end" && <div>end</div>}
      <Button onClick={setNextStep}>Next step</Button>
    </div>
  );
};

export const Battle = () => {
  const [initializedBoard, setInitializedBoard] = useState(board);
  const [events, setEvents] = useState<DomainEvent[]>([]);

  const [currentEventIndex, setCurrentEventIndex] = useState(0);

  const handleResolve = () => {
    initializedBoard.resolveBoard();

    setEvents(initializedBoard.getEvents());
  };

  const handleNextStep = () => {
    if (currentEventIndex < events.length) {
      setCurrentEventIndex(currentEventIndex + 1);
    }
  };

  useEffect(() => {
    if (currentEventIndex < events.length) {
      const event = events[currentEventIndex];
      if (event instanceof CardAttacked) {
      }
    }
  }, [currentEventIndex]);

  return (
    <div className="flex flex-row items-center">
      <div className="flex flex-col items-center">
        <div>
          <SideItem side={initializedBoard.opponentSide} />
        </div>
        <div>
          timer
          <Button>10</Button>
        </div>
        <div>
          <SideItem side={initializedBoard.playerSide} />
        </div>
        <Button onClick={handleResolve}>Resolve</Button>
        <Button onClick={handleNextStep}>Next step</Button>
      </div>
      <div>
        <EventsList events={events.slice(0, currentEventIndex)} />
      </div>
    </div>
  );
};

export const PlayerHand = () => {
  return (
    <div>
      main du joueur
      <CardList cards={[]} />
    </div>
  );
};

interface CardListProps {
  cards: CardModel[];
}

export const CardList = ({ cards }: CardListProps) => {
  return (
    <div className="flex flex-row items-center">
      {cards.map((card, index) => (
        <CardItem card={card} key={index} />
      ))}
    </div>
  );
};

interface SideProps {
  side: Side;
}

export const SideItem = ({ side }: SideProps) => {
  return (
    <div className="flex flex-row items-center">
      {side.cards.map((card, index) => (
        <AnimatedCard cardId={card.id} key={index}>
          <CardItem card={card} />
        </AnimatedCard>
      ))}
    </div>
  );
};

interface CardItemProps {
  card: CardModel;
}

export const CardItem = ({ card }: CardItemProps) => {
  return (
    <Card className="flex flex-col items-center">
      <div>{card.name}</div>
      <div className="flex flex-row items-center justify-between">
        <div>{card.health}</div>
        <div>{card.attack}</div>
      </div>
    </Card>
  );
};

export const EventsList = ({ events }: { events: DomainEvent[] }) => {
  return (
    <div className="flex flex-col items-center">
      {events.map((event, index) => (
        <EventDetail key={index} event={event} />
      ))}
    </div>
  );
};

export const EventDetail = ({ event }: { event: DomainEvent }) => {
  if (event instanceof CardAttacked) {
    return (
      <div>
        {event.id} : carte avec id: {event.attackCardId} attacké :{" "}
        {event.attackedCardId}
      </div>
    );
  }
  if (event instanceof BoardResolved) {
    return <div> {event.id} : Board resolved</div>;
  }
  return <div>{event.id}</div>;
};

interface AnimatedCardProps {
  cardId: string;
  children: React.ReactNode;
}

export const AnimatedCard = ({ cardId, children }: AnimatedCardProps) => {
  const { ref, styles, playAttackAnimation, playDeadAnimation } =
    useCardAnimation(cardId);

  const handleClick = () => {
    playDeadAnimation();
    //playAttackAnimation("card-825938");
  };

  return (
    <animated.div
      className="spring-box"
      onClick={handleClick}
      ref={ref}
      style={{
        ...styles,
        cursor: "pointer",
      }}
    >
      {children}
    </animated.div>
  );
};

export const useCardAnimation = (cardId: string) => {
  const cardRefs = useCardRefs();

  const ref = (el: HTMLDivElement | null) => {
    cardRefs.current.set(cardId, el);
  };

  const [styles, api] = useSpring(
    () => ({
      x: 0,
      y: 0,
      rotateZ: 0,
    }),
    []
  );

  const playAttackAnimation = (targetCardId: string) => {
    const attackCard = cardRefs.current.get(cardId);
    const attackedCard = cardRefs.current.get(targetCardId);

    if (attackCard == null || attackedCard == null || targetCardId === cardId) {
      return;
    }

    const { left: x1, top: y1 } = attackCard.getBoundingClientRect();
    const { left: x2, top: y2 } = attackedCard.getBoundingClientRect();

    const dx = x2 - x1;
    const dy = y2 - y1;

    api.start({
      to: [
        { x: dx, y: dy, rotateZ: 360 },
        { x: 0, y: 0, rotateZ: 0 },
      ],
    });
  };

  const playDeadAnimation = () => {
    const attackCard = cardRefs.current.get(cardId);

    if (attackCard == null) {
      return;
    }

    api.start({
      to: [
        { x: 0, y: 0, rotateZ: 360 },
        { x: 0, y: 0, rotateZ: 0 },
      ],
    });
  };

  return {
    ref,
    styles,
    playAttackAnimation,
    playDeadAnimation,
  };
};
