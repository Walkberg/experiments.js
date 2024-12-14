import { Plugin, BalatroEngine } from "../balatro-engine";

export interface SeedManagerPlugin extends Plugin {
  setSeed: (seed: string) => void;
  getSeed: () => string;
  random: () => number;
  randomInt: (min: number, max: number) => number;
  randomElement: <T>(array: T[]) => T;
}

export function createSeedManagerPlugin(): SeedManagerPlugin {
  let _seed: number = 0;
  let _originalSeed: string = "";

  function setSeed(seed: string) {
    const numericPart = parseInt(seed.slice(2, -2), 10);
    if (isNaN(numericPart)) {
      throw new Error("Invalid seed format");
    }
    _seed = numericPart;
    _originalSeed = seed;
  }

  function getSeed(): string {
    return _originalSeed;
  }

  function random(): number {
    const x = Math.sin(_seed++) * 10000;
    return x - Math.floor(x);
  }

  function randomInt(min: number, max: number): number {
    return Math.floor(random() * (max - min + 1)) + min;
  }

  function randomElement<T>(array: T[]): T {
    const index = randomInt(0, array.length - 1);
    return array[index];
  }

  function init(engine: BalatroEngine) {}

  return {
    name: "seed-manager",
    init,
    setSeed,
    getSeed,
    random,
    randomInt,
    randomElement,
  };
}

export function getSeedManagerPlugin(engine: BalatroEngine): SeedManagerPlugin {
  const plugin = engine.getPlugin<SeedManagerPlugin>("seed-manager");

  if (plugin == null) {
    throw new Error("SeedManagerPlugin not found");
  }
  return plugin;
}
