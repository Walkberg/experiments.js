import { Sellable } from "../../cards/cards";

interface SellCardProps {
  onSell: () => void;
  sellable: Sellable;
}

export const SellCard = ({ onSell, sellable }: SellCardProps) => {
  return (
    <button
      onClick={() => onSell()}
      className="bg-green-500 hover:bg-green-700  text-white font-bold py-2 px-4 rounded"
    >
      Vendre
      <br />${sellable.getSellPrice()}
    </button>
  );
};
