import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useCurrentGame } from "../../BalatroProvider";
import {
  BaseScore,
  getHandScorePlugin,
  HandScoreManagerPlugin,
} from "../../plugins/hand-score-manager-plugin";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ScoreDetail } from "../../BalatroPage";
import { PlanetType } from "../../balatro";

const useBalatroHandScore = () => {
  const [refresh, setRefresh] = useState(false);
  const [handScoreManager, setHandScoreManager] =
    useState<HandScoreManagerPlugin>();
  const { balatro } = useCurrentGame();

  useEffect(() => {
    if (!balatro) return;

    const handScore = getHandScorePlugin(balatro);

    setHandScoreManager(handScore);

    balatro.onEvent("hand-score-improved", (score) =>
      setRefresh((prev) => !prev)
    );
  }, [balatro]);

  return {
    handScoreManager,
  };
};

export const HandScoreDetail = () => {
  const { handScoreManager } = useBalatroHandScore();

  if (!handScoreManager) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Detail</Button>
      </DialogTrigger>
      <DialogContent>
        <BaseScoreDetail baseScoreList={handScoreManager.getHandScores()} />
      </DialogContent>
      <Button onClick={() => handScoreManager.improveHandScore("Flush")}>
        Improve Hand
      </Button>
    </Dialog>
  );
};

interface BaseScoreDetailProps {
  baseScoreList: BaseScore[];
}

export const BaseScoreDetail = ({ baseScoreList }: BaseScoreDetailProps) => {
  return (
    <div className="flex flex-col gap-2 p-2">
      {baseScoreList.map((baseScore) => (
        <BaseScoreRow key={baseScore.type} baseScore={baseScore} />
      ))}
    </div>
  );
};

interface BaseScoreRowProps {
  baseScore: BaseScore;
}

export const BaseScoreRow = ({ baseScore }: BaseScoreRowProps) => {
  return (
    <Card className="flex flex-row items-center justify-between p-2">
      <div>lvl {baseScore.level}</div>
      <div>{baseScore.type}</div>
      <ScoreDetail score={baseScore} />
      <div># {baseScore.playedCount}</div>
    </Card>
  );
};
