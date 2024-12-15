import { useCurrentGame } from "../../BalatroProvider";
import { DeckManagerPlugin } from "../../plugins";

interface DeckProps {}

export const Deck = ({}: DeckProps) => {
  const { balatro } = useCurrentGame();

  const deck = balatro?.getPlugin<DeckManagerPlugin>("deck");

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex relative">
        <DeckShadow />
        <div
          style={{
            width: "144px",
            height: "190px",
            backgroundSize: "700%",
            backgroundPosition: "top left",
            overflow: "hidden",
            imageRendering: "pixelated",
          }}
          className="z-50 cursor-pointer card-enhancer hover:scale-125"
        />
      </div>
      <div className="flex justify-items-end">
        <div className=" text-white">
          {deck?.getDeckSize()}/{deck?.getDeckSize()}
        </div>
      </div>
    </div>
  );
};

const DeckShadow = () => {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gray-400  z-10 -translate-x-3 translate-y-3 rounded-2xl border" />
      <div className="absolute inset-0 bg-gray-400  z-10 -translate-x-2 translate-y-2 rounded-2xl border" />
      <div className=" absolute inset-0 bg-gray-400  z-10 -translate-x-1 translate-y-1 rounded-2xl border" />
    </div>
  );
};
