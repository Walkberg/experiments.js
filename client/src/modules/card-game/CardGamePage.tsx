import "./CardGamePage.css";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  useState,
  useEffect,
  ReactNode,
  createContext,
  useContext,
} from "react";
import {
  createEngine,
  Engine,
  removeMod,
  Card as CardI,
  createCard,
  createShopPlugin,
  ShopPlugin,
  createPlayerPlugin,
  PlayerPlugin,
  createOpponentPlugin,
  OpponentsPlugin,
  createEconomyPlugin,
} from "./game";
import { cn } from "@/lib/utils";

const useGame = () => {
  const [game, setGame] = useState<Engine | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const myGame = createEngine();

    const playerPlugin = createPlayerPlugin();
    const opponentPlugin = createOpponentPlugin({ count: 8 });
    const shopPlugin = createShopPlugin();
    const economyPlugin = createEconomyPlugin();

    myGame.registerPlugin(playerPlugin);
    myGame.registerPlugin(opponentPlugin);
    myGame.registerPlugin(shopPlugin);
    myGame.registerPlugin(economyPlugin);

    myGame.onEvent("test", (payload) => {
      setRefreshCounter((prev) => prev + 1);
    });

    myGame.pool.addCard(maSuperCard, 1);
    myGame.pool.addCard(maSuperCard2, 1);

    myGame.onEvent("shop-rolled", (card) =>
      setRefreshCounter((prev) => prev + 1)
    );

    myGame.onEvent("card-bought", (card) =>
      setRefreshCounter((prev) => prev + 1)
    );

    setGame(myGame);

    return () => removeMod("mon-mod", myGame);
  }, []);

  return { messages, game, refreshCounter };
};

interface GameContextType {
  game: Engine | null;
  refreshCounter: number;
}

export const GameContext = createContext<GameContextType | null>(null);

interface GameProviderProps {
  children: ReactNode;
}

export const GameProvider = ({ children }: GameProviderProps) => {
  const { game, refreshCounter } = useGame();

  return (
    <GameContext.Provider value={{ game, refreshCounter }}>
      {children}
    </GameContext.Provider>
  );
};

export const useCurrentGame = () => {
  const context = useContext(GameContext);

  if (context == null) {
    throw new Error(
      "useBattleGround must be used within a BattleGroundProvider"
    );
  }

  return context;
};

export const CardGamePage = () => {
  return (
    <GameProvider>
      <Shop />
    </GameProvider>
  );
};

export const Shop = () => {
  const { game } = useCurrentGame();

  if (game == null) {
    return <div>Loading...</div>;
  }

  const shop = game.getPlugin<ShopPlugin>("shop");
  const playerSide = game.getPlugin<PlayerPlugin>("player");

  console.log("shop", shop);

  if (shop == null || playerSide == null) {
    return <div>Loading...</div>;
  }

  return (
    <GameTemplate sidebar={<Opponents />}>
      <div className=" bg-green-500 grid grid-rows-4 gap-4 h-screen">
        <div className="flex flex-row items-center justify-center">
          <div>
            <Button>level up</Button>
          </div>
          <div>
            <div>level indication</div>
            <div>Bob</div>
          </div>
          <div>
            <Button onClick={() => shop.roll()}>Refresh</Button>
            <Button onClick={() => shop.freeze()}>Freeze</Button>
          </div>
        </div>
        <div>
          <CardList
            cards={shop.getCards()}
            onClickCard={(card) => shop.removeCard(card.id)}
          />
          <div className="flex justify-items-end">
            <Button>Timer</Button>
          </div>
        </div>
        <div className="flex flex-col  bg-green-500">
          <div>
            <CardList cards={playerSide.getPlayerSide().board.getCards()} />
          </div>
        </div>
        <div>
          <div className="flex flex-row items-center justify-center">
            <div>hero</div>
            <div>hero power</div>
          </div>
          <div>
            <CardList
              cards={playerSide.getPlayerSide().hand.getCards()}
              onClickCard={(card) =>
                playerSide.getPlayerSide().hand.playCard(card)
              }
            />
          </div>
          <div>
            <div>mana * ** ** * ** *</div>
          </div>
        </div>
      </div>
    </GameTemplate>
  );
};

export const GameTemplate = ({
  children,
  sidebar,
}: {
  children: ReactNode;
  sidebar?: ReactNode;
}) => {
  return (
    <div className="grid grid-cols-10">
      <div className="bg-red-500 ">{sidebar}</div>
      <div className="bg-blue-500 col-span-9">{children}</div>
    </div>
  );
};

export const Opponents = () => {
  const { game } = useCurrentGame();
  const opponents = game
    ?.getPlugin<OpponentsPlugin>("opponents")
    ?.getOpponents();

  if (opponents == null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      {opponents.map((opponent) => (
        <Button key={opponent.id}>{opponent.id}</Button>
      ))}
    </div>
  );
};

const CardList = ({
  cards,
  onClickCard,
}: {
  cards: CardI[];
  actions?: ReactNode;
  onClickCard?: (card: CardI) => void;
}) => {
  return (
    <div className="flex flex-row bg-green-600 p-8 gap-3 justify-center">
      {cards.map((card) => (
        <AnimatedCard
          className="p-2 "
          key={card.id}
          onClick={() => onClickCard?.(card)}
        >
          <div className="w-60 h-32 gradient " />
          <div className="pt-4 ps-8">
            <div className="text-xl">{card.name}</div>
            <div className="text-base">{card.description}</div>
          </div>
        </AnimatedCard>
      ))}
    </div>
  );
};

interface AnimatedCardProps extends React.ButtonHTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

const AnimatedCard = ({ children, ...rest }: AnimatedCardProps) => {
  const [style, setStyle] = useState({});

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const rotateX = (y - rect.height / 2) / 3;
    const rotateY = (x - rect.width / 2) / -3;

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
    <Card
      className={cn("card", rest.className)}
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </Card>
  );
};

const maSuperCard = createCard();

const maSuperCard2 = createCard();

maSuperCard.addBattleCry((game) => {
  const shop = game.getPlugin<ShopPlugin>("shop");
  shop?.getCards().forEach((card) => {
    shop.removeCard(card.id);
  });
});
