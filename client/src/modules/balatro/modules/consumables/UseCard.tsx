interface UseCardProps {
  onUse: () => void;
}

export const UseCard = ({ onUse }: UseCardProps) => {
  return (
    <button
      onClick={() => onUse()}
      className="bg-red-500 hover:bg-red-700  text-white font-bold py-2 px-4 rounded"
    >
      Utiliser
    </button>
  );
};
