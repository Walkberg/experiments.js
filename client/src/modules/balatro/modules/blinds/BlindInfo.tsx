import { Card } from "@/components/ui/card";
import { useCurrentGame } from "../../BalatroProvider";
import { BlindManagerPlugin } from "../../plugins";

interface BlindInfoProps {}

export const BlindInfo = ({}: BlindInfoProps) => {
  const { balatro } = useCurrentGame();

  if (balatro == null) {
    return <div>not defiend</div>;
  }

  const plugin = balatro?.getPlugin<BlindManagerPlugin>("blind-manager");

  const currentBlind = plugin?.getCurrentBlind();

  if (plugin == null || currentBlind == null) {
    throw new Error("balatro is not defined");
  }

  return (
    <div className="bg-slate-900 rounded-xl p-2 flex flex-col items-center gap-2 w-full">
      <Card className="p-2 bg-sky-500 text-center text-white w-full justify-center">
        Small Blind
      </Card>
      <Card className=" bg-sky-700 bg-opacity-30 flex flex-row items-center justify-center gap-8 p-8">
        <div>Blind Icon</div>
        <Card className="p-2 bg-slate-900 text-white flex flex-col">
          <div>Score at least</div>
          <div className="flex flex-row">
            <div>seal Icon</div>
            <div className="text-red-600 text-3xl">{currentBlind.score}</div>
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
