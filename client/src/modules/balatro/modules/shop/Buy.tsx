import { cn } from "@/lib/utils";

interface BuyProps {
  canBuy: boolean;
  onBuy: () => void;
}
export const Buy = ({ onBuy, canBuy }: BuyProps) => {
  return (
    <button
      disabled={!canBuy}
      onClick={onBuy}
      className={cn("bg-amber-500 text-white rounded-2xl p-2", {
        "bg-amber-700": !canBuy,
      })}
    >
      Acheter
    </button>
  );
};
