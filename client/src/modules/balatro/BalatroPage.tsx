import "./balatro.css";
import { Card } from "@/components/ui/card";
import {
  Hand as IHand,
  Score as IScore,
  sortByRank,
  sortBySuit,
} from "./balatro";
import { PokerCard as ICard } from "./cards/poker-cards";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Shop } from "./Shop";
import { PlayCard } from "./Card";
import { BalatroProvider, useCurrentGame } from "./BalatroProvider";
import { evaluatePokerHand } from "./hand-evaluator";
import {
  BlindManagerPlugin,
  EconomyManagerPlugin,
  GameManagerPlugin,
  Phase,
  PlayedCardManagerPlugin,
} from "./balatro-engine";
import { DeckManagerPlugin } from "./plugins/deck-manager-plugin";
import { HandManagerPlugin } from "./plugins/hand-manager-plugin";
import { ScoreManagerPlugin } from "./plugins";
import { Buffon, BuffonsManagerPlugin } from "./plugins/buffons-manager-plugin";
import { cn } from "@/lib/utils";
import {
  Consumable,
  ConsumablesManagerPlugin,
} from "./plugins/consumables-manager-plugin";
import { HandScoreDetail } from "./modules/hand-score/HandScoreDetail";
import { Hand } from "./modules/hand/Hand";

export const BalatroPage = () => {
  return (
    <BalatroProvider seed={"1223344"}>
      <Balatro />
    </BalatroProvider>
  );
};

export const Balatro = () => {
  const { balatro } = useCurrentGame();

  const [phase, setPhase] = useState<Phase>("Pause");

  useEffect(() => {
    const game = balatro?.getPlugin<GameManagerPlugin>("game");

    if (!game) return;

    balatro?.onEvent("phase-changed", () => {
      setPhase(game.getPhase());
    });
  }, [balatro]);

  if (phase === "GameOver") {
    return <div> Game Over</div>;
  }

  return (
    <div className="grid grid-cols-5 bg-green-800 background-tv">
      <div className="col-span-1">
        <Sidebar />
      </div>
      <div className="grid grid-rows-3  grid-cols-5 col-span-4 m-2 w-full gap-3">
        <div className="col-span-3">
          <CardContainer>
            <Buffons />
          </CardContainer>
        </div>
        <div className="col-span-2">
          <CardContainer>
            <ConsumableList />
          </CardContainer>
        </div>
        <div className="col-span-4 row-span-2 col-start-1 row-start-2">
          {phase === "Shop" ? <Shop /> : <Board />}
        </div>
        <div className="col-start-5 row-start-3">
          <CardContainer>
            <Deck />
          </CardContainer>
        </div>
      </div>
    </div>
  );
};

export const Board = () => {
  return (
    <div className="grid grid-rows-2 m-2 gap-4">
      <PlayHand />
      <Hand />
    </div>
  );
};

export const Sidebar = () => {
  const { balatro } = useCurrentGame();

  const [phase, setPhase] = useState<Phase>("Pause");

  useEffect(() => {
    const game = balatro?.getPlugin<GameManagerPlugin>("game");

    if (!game) return;

    balatro?.onEvent("phase-changed", () => {
      setPhase(game.getPhase());
    });
  }, [balatro]);

  return (
    <div className="grid grid-rows-3 gap-2">
      {phase === "Shop" ? <div>SHOP</div> : <Blind />}

      <div className="grid grid-rows-2 gap-2 ">
        <Score />
        <BaseScoreC />
      </div>
      <PlayerInfo />

      {/* <Dialog>
        <DialogTrigger>
          <Button>Detail</Button>
        </DialogTrigger>
        <DialogContent>
          <BaseScoreDetail baseScoreList={player.baseScoreList} />
        </DialogContent>
        <Button onClick={handleImproveHand}>Improve Hand</Button>
      </Dialog>
      <div>
        hand that score :
        <div className=" flex flex-col ">
          {getScoringHand(selectedCard).map((hand) => (
            <div className=" flex flex-row gap-2">
              {hand.map((card) => (
                <div>{card.id}</div>
              ))}
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export const PlayerInfo = () => {
  const { balatro } = useCurrentGame();
  const handmanager = useHandManager();
  const economyManager = useEconomyManager();

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (balatro == null) return;
    balatro.onEvent("economy-updated", () => {
      console.log("economy updated aaaa");
      setRefresh((prev) => !prev);
    });
  }, [balatro]);

  if (handmanager == null || economyManager == null) {
    return null;
  }

  console.log("economyManager", economyManager.getMoney());

  return (
    <div className="grid flex-row gap-4">
      <Button className="row-span-2">Run Info</Button>
      <Button className="col-start-1 row-start-3">Options</Button>
      <ItemContainer className="col-start-2 row-start-1" name="hands">
        <Button>{handmanager.getRemainingHands()}</Button>
      </ItemContainer>
      <ItemContainer name="discards">
        <Button>{handmanager.getRemainingDiscards()}</Button>
      </ItemContainer>
      <ItemCard className="col-span-2 col-start-2 row-start-2">
        <ItemTest>
          <Button>${economyManager.getMoney()}</Button>
        </ItemTest>
      </ItemCard>
      <ItemContainer className="row-start-3" name="antes">
        <Button>0</Button>
      </ItemContainer>
      <ItemContainer className="row-start-3" name="rounds">
        <Button>1</Button>
      </ItemContainer>
      <HandScoreDetail />
    </div>
  );
};

interface ItemContainerProps {
  name: string;
  className?: string;
  children: React.ReactNode;
}

export const ItemContainer = ({
  children,
  name,
  className,
}: ItemContainerProps) => {
  return (
    <ItemCard className={className}>
      <div className="flex items-center justify-center">{name}</div>
      <ItemTest>{children}</ItemTest>
    </ItemCard>
  );
};

interface ItemTestProps {
  children: React.ReactNode;
}

export const ItemTest = ({ children }: ItemTestProps) => {
  return <div className="flex flex-col">{children}</div>;
};

interface ItemCardProps {
  className?: string;
  children: React.ReactNode;
}

export const ItemCard = ({ children, className }: ItemCardProps) => {
  return <Card className={cn(className, "flex flex-col p-2")}>{children}</Card>;
};

interface BaseScoreCProps {}

export const BaseScoreC = ({}: BaseScoreCProps) => {
  const { balatro } = useCurrentGame();

  const [score, setScore] = useState<IScore>({ chip: 0, multiplier: 0 });

  useEffect(() => {
    balatro?.onEvent("score-calculated", (score) => setScore(score));

    balatro?.onEvent("card-selected", (hand) => {
      console.log("card-selected", hand);
    });
  }, [balatro]);

  const hand = balatro?.getPlugin<HandManagerPlugin>("hand")?.getHand();

  if (!hand) return <div>No hand</div>;

  return (
    <Card className="flex flex-col items-center align-middle p-2 ">
      <div>{evaluatePokerHand(hand)}</div>
      <ScoreDetail score={score} />
    </Card>
  );
};

interface ScoreProps {}

export const Score = ({}: ScoreProps) => {
  const { balatro } = useCurrentGame();

  const [score, setRoundScore] = useState<number>(0);

  useEffect(() => {
    balatro?.onEvent("score-calculated", (score) => {
      const plugin = balatro.getPlugin<ScoreManagerPlugin>("score");
      if (plugin != null) {
        setRoundScore(plugin.getRoundScore());
      }
    });

    balatro?.onEvent("score-reset", (score) => {
      const plugin = balatro.getPlugin<ScoreManagerPlugin>("score");
      if (plugin != null) {
        setRoundScore(plugin.getRoundScore());
      }
    });
  }, [balatro]);

  return (
    <Card className="flex flex-row items-center align-middle p-2 justify-center ">
      <div>Round Score</div>
      <ItemCard>{score}</ItemCard>
    </Card>
  );
};

interface BlindProps {}

export const Blind = ({}: BlindProps) => {
  const { balatro } = useCurrentGame();

  if (balatro == null) {
    return <div>not defiend</div>;
  }

  const plugin = balatro?.getPlugin<BlindManagerPlugin>("blind-manager");

  if (plugin == null) {
    throw new Error("balatro is not defined");
  }

  return (
    <div className="grid  flex-col items-center ">
      <Card className="justify-center">Small Blind</Card>
      <Card className="flex flex-row items-center justify-center gap-8 p-8">
        <div>Blind Icon</div>
        <Card className="flex flex-col">
          <div>Score at least</div>
          <div className="flex flex-row">
            <div>seal Icon</div>
            <div>{plugin.getCurrentBlind().amount}</div>
          </div>
          <div className="flex flex-row">
            <div>Reward</div>
            <div>$$$</div>
          </div>
        </Card>
      </Card>
    </div>
  );
};

interface CardContainerProps {
  children: React.ReactNode;
}

export const CardContainer = ({ children }: CardContainerProps) => {
  return (
    <div className="flex flex-col grow">
      <Card className="flex grow justify-center p-2 bg-black/20 h-40">
        {children}
      </Card>
      <div className="flex flex-row grow p-2">0/2</div>
    </div>
  );
};

export function useConsumableManager() {
  const { balatro } = useCurrentGame();

  const [refresh, setRefresh] = useState(false);

  const consumableManager = balatro?.getPlugin<ConsumablesManagerPlugin>(
    "consumables-manager"
  );

  useEffect(() => {
    if (balatro == null) {
      return;
    }
    balatro.onEvent("consumable-added", () => setRefresh((prev) => !prev));
    balatro.onEvent("consumable-removed", () => setRefresh((prev) => !prev));
  }, [balatro]);

  if (consumableManager == null) {
    return null;
  }

  return consumableManager;
}

interface ConsumableListProps {}

export const ConsumableList = ({}: ConsumableListProps) => {
  const consumableManager = useConsumableManager();

  if (consumableManager == null) {
    return null;
  }

  const handleUseConsumable = (consumableId: string) => {
    consumableManager.useConsumable(consumableId);
  };

  return (
    <div className="flex flex-row gap-2">
      {consumableManager.getConsumables().map((consumable) => (
        <ConsumableCard
          key={consumable.id}
          consumable={consumable}
          onUse={handleUseConsumable}
        />
      ))}
    </div>
  );
};

export const ConsumableCard = ({
  className,
  consumable,
  onUse,
}: {
  className?: string;
  consumable: Consumable;
  onUse: (consumableId: string) => void;
}) => {
  return (
    <div>
      <Card
        className={cn(
          className,
          "flex flex-col items-center p-2",
          consumable.id
        )}
      >
        {consumable.name}
      </Card>
      <Button disabled={false} onClick={() => onUse(consumable.id)}>
        Use
      </Button>
    </div>
  );
};

export function useHandManager() {
  const { balatro } = useCurrentGame();

  const handManager = balatro?.getPlugin<HandManagerPlugin>("hand");

  if (handManager == null) {
    return null;
  }

  return handManager;
}

export function useEconomyManager() {
  const { balatro } = useCurrentGame();

  const economyManager = balatro?.getPlugin<EconomyManagerPlugin>("economy");

  if (economyManager == null) {
    return null;
  }

  return economyManager;
}

export function useGameManager() {
  const { balatro } = useCurrentGame();

  const gameManager = balatro?.getPlugin<GameManagerPlugin>("game");

  if (gameManager == null) {
    return null;
  }

  return gameManager;
}

interface DeckProps {}

export const Deck = ({}: DeckProps) => {
  const { balatro } = useCurrentGame();

  const deck = balatro?.getPlugin<DeckManagerPlugin>("deck");

  return <div>{deck?.getDeckSize()}</div>;
};

export function useBuffonManager() {
  const { balatro } = useCurrentGame();

  const [refresh, setRefresh] = useState(false);

  const buffonManager =
    balatro?.getPlugin<BuffonsManagerPlugin>("buffon-manager");

  useEffect(() => {
    balatro?.onEvent("buffon-added", () => {
      setRefresh((prev) => !prev);
    });
  }, [buffonManager]);

  if (buffonManager == null) {
    return null;
  }

  return buffonManager;
}

interface BuffonsProps {}

export const Buffons = ({}: BuffonsProps) => {
  const buffonManager = useBuffonManager();

  if (buffonManager == null) {
    return null;
  }

  return (
    <div className="flex flex-row gap-2">
      {buffonManager.getBuffons().map((buffon) => (
        <BuffonCard key={buffon.id} buffon={buffon} />
      ))}
    </div>
  );
};

export const BuffonCard = ({
  buffon,
  onClick,
}: {
  buffon: Buffon;
  onClick?: () => void;
}) => {
  return (
    <Card onClick={onClick}>
      <div>{buffon.name}</div>
      <div>{buffon.description}</div>
    </Card>
  );
};

export const PlayHand = () => {
  const { balatro } = useCurrentGame();

  const playedCardPlugin =
    balatro?.getPlugin<PlayedCardManagerPlugin>("played-card");

  const [hand, setHand] = useState<IHand>([]);

  useEffect(() => {
    balatro?.onEvent("phase-changed", () => {
      setHand(playedCardPlugin?.getHand() ?? []);
    });
    balatro?.onEvent("hand-played", () =>
      setHand(playedCardPlugin?.getHand() ?? [])
    );
    balatro?.onEvent("played-card-reset", () =>
      setHand(playedCardPlugin?.getHand() ?? [])
    );
  }, [balatro]);

  return (
    <div className="flex flex-row items-center gap-2">
      {hand.map((handCard) => (
        <PlayCard key={handCard.id} card={handCard} />
      ))}
    </div>
  );
};

interface ScoreDetailProps {
  score: IScore;
}

export const ScoreDetail = ({ score }: ScoreDetailProps) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <Button className="bg-blue-500">{score.chip}</Button>
      <div>X</div>
      <Button className="bg-red-500">{score.multiplier}</Button>
    </div>
  );
};
