import { useEffect, useState } from "react";
import { useCurrentGame, Shop } from "../../CardGamePage";
import { getGameManagerPlugin, Phase } from "../../plugins/game-manager-plugin";

export const GameStateMachine = () => {
  const { phase } = useGameStateMachine();

  if (phase === "Shop") {
    return <Shop />;
  } else if (phase === "Fight") {
    return <div>Fight</div>;
  }

  return null;
};

function useGameStateMachine() {
  const { game } = useCurrentGame();

  const [phase, setPhase] = useState<Phase | null>(null);

  useEffect(() => {
    if (!game) {
      return;
    }

    const gameManager = getGameManagerPlugin(game);

    setPhase(gameManager.getPhase());

    const handlePhaseChange = (newPhase: Phase) => {
      setPhase(newPhase);
    };

    game.onEvent("phase-changed", handlePhaseChange);

    return () => {};
  }, [game]);

  return { phase };
}
