import "./CardGamePage.css";
import { Button } from "@/components/ui/button";
import { ReactNode, createContext, useContext } from "react";
import { Engine } from "./game";
import { ShopPlugin } from "./plugins/shop-plugin";
import { PlayerPlugin } from "./plugins/player-plugin";
import { EconomyPlugin } from "./plugins/economy-plugin";
import { OpponentsPlugin } from "./plugins/opponent";
import { useGame } from "./modules/game/useGame";
import { Card } from "@/components/ui/card";
import { Card as CardI } from "./core/cards/card";
import { Minion } from "./modules/cards/Minion";
import { GameStateMachine } from "./modules/game/GameStateMachine";

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
      <GameStateMachine />
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
  const economy = game.getPlugin<EconomyPlugin>("economy");

  if (shop == null || playerSide == null || economy == null) {
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
            <Button
              disabled={economy.getCurrentMoney() <= 0}
              onClick={() => shop.roll()}
            >
              Refresh
            </Button>
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
          <Gold />
        </div>
      </div>
    </GameTemplate>
  );
};

const Gold = () => {
  const { game } = useCurrentGame();

  const goldPlugin = game?.getPlugin<EconomyPlugin>("economy");

  if (goldPlugin == null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-row gap-2">
      <Card className="p-2 items-center">
        {goldPlugin.getCurrentMoney()}/{goldPlugin.getMaxMoney()}
      </Card>
      <Card className="flex flex-row p-2 items-center ">
        {Array.from({ length: 10 }).map((gold, index) => (
          <div key={index}>
            {index + 1 > goldPlugin.getCurrentMoney() ? "x" : "0"}
          </div>
        ))}
      </Card>
    </div>
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
        <Minion onClickCard={onClickCard} card={card} />
      ))}
    </div>
  );
};
