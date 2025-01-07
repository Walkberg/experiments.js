interface BuyAndUseProps {
  onBuyAnUse: () => void;
}
export const BuyAndUse = ({ onBuyAnUse }: BuyAndUseProps) => {
  return (
    <button
      onClick={onBuyAnUse}
      className="bg-orange-700 text-white rounded-2xl p-2"
    >
      Acheter <br /> et utiliser
    </button>
  );
};
