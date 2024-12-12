import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useCurrentGame } from "../../BalatroProvider";
import { BlindManagerPlugin, getBlindManagerPlugin } from "../../plugins";
import { Card } from "@/components/ui/card";
import { useGameManager } from "../../BalatroPage";

interface AnteProps {}

export const Ante = ({}: AnteProps) => {
  const { balatro } = useCurrentGame();

  const gameManager = useGameManager();

  if (!gameManager) return null;

  const [rerender, setRerender] = useState(false);

  useEffect(() => {
    if (balatro == null) {
      return;
    }
  }, [balatro]);

  if (balatro == null) {
    return null;
  }

  const antePlugin = getBlindManagerPlugin(balatro);

  if (antePlugin == null) {
    return null;
  }

  const ante = antePlugin.getCurrentAnte();
  const blind = antePlugin.getCurrentBlind();

  return (
    <div className="grid grid-cols-3 gap-2">
      {ante?.blinds.map((blind, index) => (
        <div className="flex flex-col gap-2 w-96" key={index}>
          <Card className="flex flex-col gap-2">
            <Button onClick={() => gameManager.startNextPhase()}>Select</Button>
            <Button>{blind.name}</Button>
            <Card>
              <div>Score at least</div>
              <div>{blind.score}</div>
              <div>
                Reward: {Array.from({ length: blind.reward }).map((a) => "$")}+
              </div>
            </Card>
          </Card>
        </div>
      ))}
    </div>
  );
};
