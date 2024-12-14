import { RunStatistics } from "../run-statistics/RunStatistics";

export const GameOver = () => {
  return (
    <div>
      <div className="fixed inset-0 bg-red-500 opacity-80 z-40"></div>

      <div className="fixed inset-0 z-50 flex justify-center items-center">
        <div className="relative bg-gray-800 rounded-lg shadow-lg p-6">
          <RunStatistics />
        </div>
      </div>
    </div>
  );
};
