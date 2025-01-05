import "./balatro.css";
import { Card } from "@/components/ui/card";
import { Score as IScore } from "./balatro";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Shop } from "./Shop";
import { BalatroProvider, useCurrentGame } from "./BalatroProvider";
import { EconomyManagerPlugin } from "./plugins/economy-manager-plugin";
import { GameManagerPlugin, Phase } from "./plugins/game-manager";
import { HandManagerPlugin } from "./plugins/hand-manager-plugin";
import { ScoreManagerPlugin } from "./plugins";
import { cn } from "@/lib/utils";
import { Ante } from "./modules/ante/Ante";
import { Board } from "./modules/hand/Board";
import { HandBaseScore } from "./modules/hand-score/HandBaseScore";
import { GameOver } from "./modules/gameover/GameOver";
import { Deck } from "./modules/deck/Deck";
import { BalatroHomePage } from "./modules/menu/HomePage";
import { ConsumableList } from "./modules/consumables/Consumables";
import { PlayCardsTest } from "./modules/cards/PokerCards";
import { RunInfo } from "./modules/run-info/RunInfo";
import { BlindInfo } from "./modules/blinds/BlindInfo";
import { BlindWin } from "./modules/blinds/BlindWin";
import { Buffons } from "./modules/buffons/Buffons";

export const BalatroTest = () => {
  return (
    <div className="grid grid-cols-3  grid-rows-2 gap-2">
      <PlayCardsTest />

      <div className="flex flex-row gap-2">dsfdf</div>
    </div>
  );
};

export const BalatroPage = () => {
  return (
    <BalatroProvider seed={"1223344"}>
      <BalatroGame />
    </BalatroProvider>
  );
};

export const BalatroGame = () => {
  const { balatro } = useCurrentGame();

  const [phase, setPhase] = useState<Phase>("Pause");

  useEffect(() => {
    if (balatro == null) return;

    const game = balatro.getPlugin<GameManagerPlugin>("game");

    if (!game) return;

    setPhase(game.getPhase());

    balatro.onEvent("phase-changed", () => setPhase(game.getPhase()));
  }, [balatro]);

  return (
    <>
      {phase === "Menu" || phase == "DeckPicker" ? (
        <BalatroHomePage />
      ) : (
        <Balatro />
      )}
    </>
  );
};

export const Balatro = () => {
  const { balatro } = useCurrentGame();

  const [phase, setPhase] = useState<Phase>("Pause");

  useEffect(() => {
    if (balatro == null) return;

    const game = balatro.getPlugin<GameManagerPlugin>("game");

    if (!game) return;

    setPhase(game.getPhase());

    balatro.onEvent("phase-changed", () => setPhase(game.getPhase()));
  }, [balatro]);

  return (
    <>
      <div className="vhs-overlay"></div>
      <div className="grid grid-cols-5 bg-green-800 background-tv overflow-hidden">
        <div className="col-span-1">
          <Sidebar />
        </div>
        <div className="grid grid-rows-4 grid-cols-5 col-span-4 m-2 w-full h-screen gap-3">
          <div className="col-span-3">
            <Buffons />
          </div>
          <div className="col-span-2">
            <ConsumableList />
          </div>
          <div className="col-span-4 row-span-3 col-start-1 row-start-2">
            {phase === "Blind" ? (
              <Ante />
            ) : phase === "Shop" ? (
              <Shop />
            ) : phase === "BlindWin" ? (
              <BlindWin />
            ) : (
              <Board />
            )}
          </div>
          <div className="col-start-5 row-start-4">
            <CardContainer>
              <Deck />
            </CardContainer>
          </div>
        </div>
      </div>
      {phase === "GameOver" && <GameOver />}
    </>
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
    <div className="grid grid-rows-3 bg-zinc-800 bg-opacity-80 p-2 ml-6">
      {phase === "Shop" ? (
        <div className="flex flex-col items-center">
          <img alt="shop" src="../assets/shop.webp" />
        </div>
      ) : phase === "Blind" ? (
        <div className="flex flex-col items-center text-white">
          selecionner la blind
        </div>
      ) : (
        <BlindInfo />
      )}
      <div className="flex flex-col gap-2 ">
        <Score />
        <HandBaseScore />
      </div>
      <PlayerInfo />
    </div>
  );
};

export const PlayerInfo = () => {
  const { balatro } = useCurrentGame();
  const handmanager = useHandManager();
  const economyManager = useEconomyManager();

  const [remainingDiscard, setRemainingDiscard] = useState(4);
  const [remainingHand, setRemainingHand] = useState(4);

  useEffect(() => {
    if (balatro == null) return;
    balatro.onEvent("economy-updated", () => {
      console.log("economy updated aaaa");
    });
  }, [balatro]);

  useEffect(() => {
    if (balatro == null) return;
    if (handmanager == null) return;

    balatro.onEvent("hand-discarded", () => {
      setRemainingDiscard(handmanager.getRemainingDiscards());
    });
    balatro.onEvent("hand-reset", () => {
      setRemainingDiscard(handmanager.getRemainingDiscards());
    });
    balatro.onEvent("player-stats-updated", () => {
      setRemainingDiscard(handmanager.getRemainingDiscards());
    });
  }, [balatro]);

  useEffect(() => {
    if (balatro == null) return;
    if (handmanager == null) return;

    balatro.onEvent("hand-played", () => {
      setRemainingHand(handmanager.getRemainingHands());
    });
    balatro.onEvent("hand-reset", () => {
      setRemainingHand(handmanager.getRemainingHands());
    });
    balatro.onEvent("player-stats-updated", () => {
      setRemainingDiscard(handmanager.getRemainingDiscards());
    });
  }, [balatro]);

  if (handmanager == null || economyManager == null) {
    return null;
  }

  return (
    <div className="grid flex-row gap-4">
      <RunInfo />
      <Button className="bg-orange-500 hover:bg-orange-700 h-full col-start-1 row-start-3">
        Options
      </Button>
      <ItemContainer className="col-start-2 row-start-1" name="hands">
        <ItemText className="text-blue-500">{remainingHand}</ItemText>
      </ItemContainer>
      <ItemContainer name="discards">
        <ItemText className="text-red-500">{remainingDiscard}</ItemText>
      </ItemContainer>
      <ItemCard className="col-span-2 col-start-2 row-start-2">
        <ItemTest>
          <ItemText className="text-orange-500">
            ${economyManager.getMoney()}
          </ItemText>
        </ItemTest>
      </ItemCard>
      <ItemContainer className="row-start-3" name="antes">
        <ItemText>1/8</ItemText>
      </ItemContainer>
      <ItemContainer className="row-start-3" name="rounds">
        <ItemText className="text-orange-500">1</ItemText>
      </ItemContainer>
    </div>
  );
};

export const ItemText = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(className, "text-center text-3xl font-bold")}>
      {children}
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
      <div className="flex items-center justify-center text-white text-lg font-semibold">
        {name}
      </div>
      <ItemTest>{children}</ItemTest>
    </ItemCard>
  );
};

interface ItemTestProps {
  className?: string;
  children: React.ReactNode;
}

export const ItemTest = ({ children, className }: ItemTestProps) => {
  return (
    <div className="bg-slate-700 flex flex-col rounded-3xl  p-2">
      {children}
    </div>
  );
};

interface ItemCardProps {
  className?: string;
  children: React.ReactNode;
}

export const ItemCard = ({ children, className }: ItemCardProps) => {
  return (
    <Card
      className={cn(className, "bg-slate-900 text-white flex flex-col p-2")}
    >
      {children}
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
    <Card className="bg-slate-900 text-white flex flex-row items-center align-middle p-2 justify-center ">
      <div>Round Score</div>
      <ItemCard>{score}</ItemCard>
    </Card>
  );
};

interface CardContainerProps {
  currentCount?: number;
  maxCount?: number;
  children: React.ReactNode;
}

export const CardContainer = ({
  children,
  currentCount = 0,
  maxCount = 0,
}: CardContainerProps) => {
  return (
    <div className="h-full py-4">
      <Card className="flex grow justify-center p-2 bg-black/20 h-full items-center ">
        {children}
      </Card>
      <div>
        {currentCount}/{maxCount}
      </div>
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

interface ScoreDetailProps {
  score: IScore;
}

export const ScoreDetail = ({ score }: ScoreDetailProps) => {
  return (
    <div className="flex flex-row items-center gap-2">
      <div className="bg-blue-500 p-2 rounded-lg text-white w-full text-center text-xl">
        {score.chip}
      </div>
      <div className="text-red-500 text-3xl">X</div>
      <div className="bg-red-500 p-2 rounded-lg text-white w-full text-center text-xl">
        {score.multiplier}
      </div>
    </div>
  );
};
