import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  BaseScoreDetail,
  useBalatroHandScore,
} from "../hand-score/HandScoreDetail";

export const RunInfo = () => {
  const { handScoreManager } = useBalatroHandScore();

  if (!handScoreManager) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-red-500 hover:bg-red-700 h-full row-span-2">
          Run Info
        </Button>
      </DialogTrigger>
      <DialogContent>
        <BaseScoreDetail baseScoreList={handScoreManager.getHandScores()} />
      </DialogContent>
    </Dialog>
  );
};
