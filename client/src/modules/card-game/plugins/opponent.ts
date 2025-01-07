import { Plugin, Engine } from "../game";

interface Opponent {
  id: string;
  name: string;
}

export interface OpponentsPlugin extends Plugin {
  getOpponents: () => Opponent[];
}
interface OpponentPluginOptions {
  count: number;
}

export function createOpponentPlugin(
  args?: OpponentPluginOptions
): OpponentsPlugin {
  let _engine: Engine;

  let opponents: Opponent[];

  function init(engine: Engine): void {
    _engine = engine;
    opponents = createOpponents(args?.count ?? 8);
  }

  function createOpponents(count: number): Opponent[] {
    return Array.from({ length: count }, (_, i) => createOpponent(i));
  }

  function createOpponent(i: number): Opponent {
    return {
      id: i.toString(),
      name: `Opponent ${i + 1}`,
    };
  }

  function getOpponents(): Opponent[] {
    return opponents;
  }

  return {
    name: "opponents",
    init,
    getOpponents,
  };
}
