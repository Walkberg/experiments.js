import { Button } from "@/components/ui/button";
import { useGameManager } from "../../BalatroPage";

export const BlindWin = ({}: {}) => {
  const gameManager = useGameManager();

  if (!gameManager) return null;

  return (
    <div className="rounded-2xl bg-zinc-900 flex flex-col gap-2 p-4 border-red-500 border-2 h-full">
      <div className="flex flex-col gap-2">
        <Button
          onClick={() => gameManager.startNextPhase()}
          className="bg-orange-500 hover:bg-orange-700"
        >
          Encaisser: 6$
        </Button>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 justify-between text-white">
          <div>Blind icon</div>
          <div>faire un score d'au moins</div>
          <div>$$$</div>
        </div>
        <div className=" text-white">
          .........................................................
        </div>
        <MoneyWinItem
          quantity={2}
          label="mains restante (1$ chacune)"
          money={2}
        />
        <MoneyWinItem quantity={1} label="main" money={1} />
      </div>
    </div>
  );
};

export const MoneyWinItem = ({
  quantity,
  label,
  money,
}: {
  quantity: number;
  label: string;
  money: number;
}) => {
  return (
    <div className="flex flex-row gap-2 justify-between text-white">
      <div className="flex flex-row gap-2">
        <div>{quantity}</div>
        <div>{label}</div>
      </div>
      <div className="text-orange-500 font-bold">
        {Array(quantity).fill("$").join("")}
      </div>
    </div>
  );
};
