import { Button, ButtonProps } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React from "react";
import { GameManagerPlugin } from "../../plugins/game-manager";
import { useCurrentGame } from "../../BalatroProvider";
import { DeckPicker } from "../deck/DeckPicker";

export const BalatroHomePage = () => {
  return (
    <div className="grid grid-rows-5 bg-green-800 background-tv">
      <div className="row-start-5">
        <div className="flex flex-row gap-4 bg-gray-600 p-4 mx-60 rounded-2xl justify-between">
          <PlayGame />
          <Button className="bg-yellow-600">Options</Button>
          <Button className="bg-red-500">Quitter</Button>
          <Button className="bg-emerald-600">Collection</Button>
        </div>
      </div>
    </div>
  );
};

export const BalatroButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    return <Button {...props} />;
  }
);

export const PlayGame = () => {
  const { balatro } = useCurrentGame();

  const game = balatro?.getPlugin<GameManagerPlugin>("game");

  if (game == null) {
    return null;
  }

  const handlePlayGame = () => {
    game.startNextPhase();
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-blue-600" onClick={handlePlayGame}>
          Jouer
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <div className="flex flex-col items-center">
          <div className="flex gap-10">
            <Button className="bg-red-500 w-48">Nouvelle Partie</Button>
            <Button className="bg-red-500 w-48">Continuer</Button>
            <Button className="bg-red-500 w-48">Défis</Button>
          </div>
          <DeckPicker />
        </div>
      </DialogContent>
    </Dialog>
  );
};
