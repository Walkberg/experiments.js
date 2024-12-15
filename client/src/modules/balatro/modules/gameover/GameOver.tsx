import { Card } from "@/components/ui/card";
import {
  ParticleSystem,
  useParticleSystem,
} from "../particle-system/ParticleSystem";
import { RunStatistics } from "../run-statistics/RunStatistics";
import React, { useState } from "react";
import { GameManagerPlugin } from "../../plugins/game-manager";
import { useCurrentGame } from "../../BalatroProvider";

export const GameOver = () => {
  const { balatro } = useCurrentGame();

  const game = balatro?.getPlugin<GameManagerPlugin>("game");

  const { ref, position } = useParticleSystem();

  if (game == null) {
    return null;
  }

  const handleClickMenu = () => {
    game.returnMenu();
  };

  return (
    <div>
      <div className="fixed inset-0 bg-red-500 opacity-80 z-40"></div>
      <div className="fixed inset-0 z-50 flex justify-center items-center">
        <div className="flex flex-row items-center gap-40">
          <div className="flex flex-col gap-4 items-center">
            <Buffon ref={ref} />
            <Card className="z-50 bg-gray-300">
              <Card className="bg-white m-2 p-3 text-gray-800 ">
                Eh bien, je crois que <br /> le vrais Joker, <br /> c'est vous !
              </Card>
            </Card>
          </div>
          <RunStatistics
            onClickMainMenu={handleClickMenu}
            onClickNewGame={handleClickMenu}
          />
        </div>
        <ParticleSystem
          enabled={true}
          duration={2000}
          count={10000}
          velocity={2}
          origin={position}
        />
      </div>
    </div>
  );
};

const Buffon = React.forwardRef<HTMLDivElement, {}>((props, ref) => {
  return (
    <>
      <div className="flex relative">
        <div className="absolute inset-0 bg-gray-700 opacity-50 z-10 translate-x-2 translate-y-2 rounded-2xl" />
        <div
          className="card-buffon custom-card z-50"
          ref={ref}
          style={{
            width: "144px",
            height: "190px",
            backgroundSize: "1000%",
            backgroundPosition: "top left",
            overflow: "hidden",
          }}
        />
      </div>
    </>
  );
});
