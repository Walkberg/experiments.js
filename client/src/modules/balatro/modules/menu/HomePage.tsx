import { Button, ButtonProps } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { ReactNode, useEffect, useState } from "react";
import { DeckUI } from "../deck/Deck";
import { GameManagerPlugin } from "../../plugins/game-manager";
import { useCurrentGame } from "../../BalatroProvider";

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

  const handleStartGame = () => {
    game.startGame();
  };

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="bg-blue-600">Jouer</Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col items-center">
          <div className="flex gap-10">
            <Button className="bg-red-500 w-48">Nouvelle Partie</Button>
            <Button className="bg-red-500 w-48">Continuer</Button>
            <Button className="bg-red-500 w-48">Défis</Button>
          </div>
          <div className="flex flex-col gap-4">
            <ContainerBis>
              <FlecheButton>{"<"}</FlecheButton>
              <Container>
                <div className="m-2">
                  <DeckUI />
                </div>
                <div className="flex flex-col bg-gray-400 p-2 rounded-2xl items-center">
                  <div className="text-white">Jeu rouge</div>
                  <div className="bg-white p-2 rounded-2xl">
                    +1 défause <br /> à chaque manche
                  </div>
                </div>
                <div className="flex flex-col">*</div>
              </Container>
              <FlecheButton>{">"}</FlecheButton>
            </ContainerBis>
            <ContainerBis>
              <FlecheButton>{"<"}</FlecheButton>
              <Container>
                <div className="flex flex-col bg-gray-400 p-2 rounded-2xl items-center">
                  <div className="text-white">Jeu rouge</div>
                  <div className="bg-white p-2 rounded-2xl">
                    +1 défause <br /> à chaque manche
                  </div>
                </div>
              </Container>
              <FlecheButton>{">"}</FlecheButton>
            </ContainerBis>
            <Button onClick={handleStartGame} className=" bg-sky-600 m-10">
              Jouer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface ContainerBisProps {
  children: ReactNode;
}

const ContainerBis = ({ children }: ContainerBisProps) => {
  return <div className="flex flex-row gap-4">{children}</div>;
};

interface ContainerProps {
  children: ReactNode;
}

const Container = ({ children }: ContainerProps) => {
  return (
    <div className="flex flex-row bg-gray-800 m-4 p-8 rounded-2xl g-4">
      {children}
    </div>
  );
};

interface FlecheButtonProps {
  children: ReactNode;
}

const FlecheButton = ({ children }: FlecheButtonProps) => {
  return (
    <Button className="bg-red-500 h-full hover:bg-red-900 ">{children}</Button>
  );
};
