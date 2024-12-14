import { useEffect, useState } from "react";
import { useCurrentGame } from "../../BalatroProvider";
import {
  GameStats,
  getStatManagerPlugin,
} from "../../plugins/stats-manager-plugin";
import { cn } from "@/lib/utils";
import React from "react";
import { Button } from "@/components/ui/button";

function useRunStatistics() {
  const [runStatistics, setRunStatistics] = useState<GameStats>();

  const { balatro } = useCurrentGame();

  useEffect(() => {
    if (balatro == null) return;

    const statsManger = getStatManagerPlugin(balatro);

    setRunStatistics(statsManger.getStats());

    balatro.onEvent("stats-updated", (event) => setRunStatistics(event.stats));
  }, [balatro]);

  return { runStatistics };
}

export const RunStatistics = () => {
  const { runStatistics } = useRunStatistics();

  if (runStatistics == null) {
    return null;
  }

  return (
    <div className="bg-gray-800 text-white rounded-lg shadow-lg p-4 max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-red-500 text-center mb-4">
        PARTIE TERMINÉE
      </h2>
      <div className="flex flex-col gap-4 p-2 bg-gray-900 rounded-2xl">
        <div className="grid gap-4">
          <StatItem label="Meilleure main">
            <span className="text-red-400 text-xl font-bold">
              {runStatistics.bestHandScore}
            </span>
          </StatItem>
          <StatItem label="Main la plus jouée">
            <span className=" px-2 py-1 rounded text-sm">
              {runStatistics.mostPlayedHand}
            </span>
          </StatItem>
        </div>
        <div className="grid grid-cols-2 grid-rows-7 gap-2">
          <StatItem className="col-start-1 row-start-1" label="Cartes jouées">
            <span className="text-blue-400 font-bold">
              {runStatistics.totalCardsPlayed}
            </span>
          </StatItem>
          <StatItem className="col-start-2 row-start-1" label="Mise initiale">
            <span className="text-yellow-400 font-bold">
              {runStatistics.ante}
            </span>
          </StatItem>
          <StatItem
            className="col-start-1 row-start-2"
            label="Cartes défaussées"
          >
            <span className="text-red-400 font-bold">
              {runStatistics.totalCardsDiscarded}
            </span>
          </StatItem>
          <StatItem className="col-start-2 row-start-2" label="Manche">
            <span className="text-yellow-400 font-bold">
              {runStatistics.levelsCompleted}
            </span>
          </StatItem>
          <StatItem className="col-start-1 row-start-3" label="Cartes achetées">
            <span className="text-yellow-400 font-bold">
              {runStatistics.totalCardsBought}
            </span>
          </StatItem>
          <StatItem
            className="col-start-1 row-start-4"
            label="Nombre de renouvellements"
          >
            <span className="text-green-400 font-bold">
              {runStatistics.shopRerolls}
            </span>
          </StatItem>
          <StatItem
            className="col-start-1 row-start-5"
            label="Nouvelles découvertes"
          >
            <span className="text-white font-bold">
              {runStatistics.totalCardsDiscovered}
            </span>
          </StatItem>
          <StatItem
            className="col-start-2 row-start-3 row-span-4 flex-col"
            label="Battu par"
          >
            <span className="px-2 py-1 rounded text-sm">{"Grosse Blinde"}</span>
          </StatItem>
          <div className=" row-start-6 row-span-2  flex flex-col gap-2">
            <StatItem label="La seed">
              <span className="px-2 py-1 rounded text-sm">
                {runStatistics.seed}
              </span>
            </StatItem>
            <Button className="bg-sky-500">Copie</Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center gap-4 mt-6">
        <button className="bg-orange-700 hover:bg-red-700 px-4 py-2 rounded text-white">
          Nouvelle partie
        </button>
        <button className="bg-orange-700 hover:bg-red-700 px-4 py-2 rounded text-white">
          Menu principal
        </button>
      </div>
    </div>
  );
};

interface StatItemProps {
  label: string;
  children: React.ReactNode;
  className?: string;
}

const StatItem = ({ children, label, ...props }: StatItemProps) => {
  return (
    <div
      className={cn(
        "flex justify-between items-center bg-gray-400 p-2 rounded-2xl",
        props.className
      )}
    >
      <span className="font-semibold text-lg drop-shadow-xl">{label}</span>
      <div className="bg-gray-800 p-2 rounded-2xl px-6">{children}</div>
    </div>
  );
};
