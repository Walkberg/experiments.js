import { useEffect, useState } from "react";
import { useCurrentGame } from "../../BalatroProvider";
import {
  GameStats,
  getStatManagerPlugin,
} from "../../plugins/stats-manager-plugin";

function useRunStatistics() {
  const [runStatistics, setRunStatistics] = useState<GameStats>();

  const { balatro } = useCurrentGame();

  useEffect(() => {
    if (balatro == null) return;

    const statsManger = getStatManagerPlugin(balatro);

    console.log("statsManger", statsManger.getStats());

    setRunStatistics(statsManger.getStats());

    balatro.onEvent("stats-updated", (event) => {
      console.log("event", event);
      setRunStatistics(event.stats);
    });
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
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 flex justify-between items-center">
          <span className="font-semibold text-lg">Meilleure main</span>
          <span className="text-red-400 text-xl font-bold">
            {runStatistics.bestHandScore}
          </span>
        </div>

        <div className="col-span-2 flex justify-between items-center">
          <span className="font-semibold text-lg">Main la plus jouée</span>
          <span className="bg-gray-700 px-2 py-1 rounded text-sm">
            {runStatistics.mostPlayedHand}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Cartes jouées</span>
          <span className="text-blue-400 font-bold">
            {runStatistics.totalCardsPlayed}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Mise initiale</span>
          <span className="text-yellow-400 font-bold">
            {runStatistics.ante}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Cartes défaussées</span>
          <span className="text-red-400 font-bold">
            {runStatistics.totalCardsDiscarded}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Manche</span>
          <span className="text-yellow-400 font-bold">
            {runStatistics.levelsCompleted}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Cartes achetées</span>
          <span className="text-green-400 font-bold">
            {runStatistics.totalCardsBought}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Nombre de renouvellements</span>
          <span className="text-green-400 font-bold">
            {runStatistics.shopRerolls}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="font-semibold">Nouvelles découvertes</span>
          <span className="text-green-400 font-bold">
            {runStatistics.totalCardsDiscovered}
          </span>
        </div>

        <div className="col-span-2 flex justify-between items-center">
          <span className="font-semibold">Battu par</span>
          <span className="bg-gray-700 px-2 py-1 rounded text-sm">{"dsd"}</span>
        </div>

        <div className="col-span-2 flex justify-between items-center">
          <span className="font-semibold">La seed</span>
          <span className="bg-gray-700 px-2 py-1 rounded text-sm">
            {runStatistics.seed}
          </span>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-6">
        <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
          Nouvelle partie
        </button>
        <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white">
          Menu principal
        </button>
      </div>
    </div>
  );
};
