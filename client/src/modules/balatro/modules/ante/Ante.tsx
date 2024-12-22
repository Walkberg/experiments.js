import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useCurrentGame } from "../../BalatroProvider";
import {
  BlindManagerPlugin,
  getBlindManagerPlugin,
  Blind,
} from "../../plugins";
import { Card } from "@/components/ui/card";
import { useGameManager } from "../../BalatroPage";
import { cn } from "@/lib/utils";

interface AnteProps {}

export const Ante = ({}: AnteProps) => {
  const { balatro } = useCurrentGame();

  const gameManager = useGameManager();

  if (!gameManager) return null;

  if (balatro == null) {
    return null;
  }

  const antePlugin = getBlindManagerPlugin(balatro);

  if (antePlugin == null) {
    return null;
  }

  const ante = antePlugin.getCurrentAnte();
  const currentBlind = antePlugin.getCurrentBlind();

  const isSelected = (blind: Blind) => {
    return currentBlind?.name === blind.name;
  };

  return (
    <div className="grid grid-cols-3 gap-2 h-full">
      {ante?.blinds.map((blind, index) => (
        <BlindItem
          key={index}
          blind={blind}
          onSelect={() => antePlugin.pickBlind()}
          selected={isSelected(blind)}
        />
      ))}
    </div>
  );
};

const BlindTag = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-orange-800 rounded-2xl border-4 border-orange-400 text-white text-center p-2">
      {children}
    </div>
  );
};

const BlindItem = ({
  blind,
  onSelect,
  selected = false,
}: {
  blind: Blind;
  onSelect: () => void;
  selected: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 w-96 grow p-2 rounded-2xl h-full pt-12 ",
        {
          " pt-0": selected,
        }
      )}
    >
      <Card className="flex flex-col p-2 border-4 border-orange-500 bg-slate-700 h-full">
        <div className="flex flex-col  gap-2  p-2 border-2 border-gray-400 rounded-xl">
          <Button
            disabled={!selected}
            className={cn("bg-orange-500 hover:bg-orange-700 rounded-2xl")}
            onClick={() => onSelect()}
          >
            Select
          </Button>
          <BlindTag>{blind.name}</BlindTag>
          <Card className="flex flex-col items-center gap-2 bg-slate-900 text-white">
            <div>Score at least</div>
            <div className="text-3xl text-red-500 font-bold">{blind.score}</div>
            <div>
              Reward: {Array.from({ length: blind.reward }).map((a) => "$")}+
            </div>
          </Card>
        </div>
      </Card>
    </div>
  );
};
