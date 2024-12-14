import { Chip } from "../balatro";
import { BalatroEngine, Plugin } from "../balatro-engine";

export interface BlindConfig {
  id: string;
  amountMultiplier: number;
  name: string;
  description?: string;
  mininimumAnte: number;
  money: number;
}

export interface AnteLevelConfig {
  level: number;
  baseChip: Chip;
}

export interface Blind {
  name: string;
  score: number;
  reward: number;
}

export interface Ante {
  ante: number;
  blinds: Blind[];
}

export interface BlindManagerPlugin extends Plugin {
  getCurrentBlind: () => Blind | null;
  getCurrentAnte: () => Ante | null;
  selectNextBlind: () => void;
}

export function createAnteManagerPlugin(): BlindManagerPlugin {
  let _engine: BalatroEngine;
  let currentBlind: BlindConfig;

  let _currentAnte = 1;
  let _currentBlind = 0;

  let _antes: Ante[] = [];

  function init(engine: BalatroEngine) {
    currentBlind = createSmallBlind();

    _antes = generateAntes();
    _engine = engine;
  }

  function generateAntes(): Ante[] {
    return ANTE_LEVELS.map((ante) => generateAnte(ante.level));
  }

  function generateAnte(ante: number): Ante {
    const smallBlind = createSmallBlind();
    const bigBlind = createBigBlind();

    const bossBlind = bossBlinds[0];

    return {
      ante: ante,
      blinds: [
        createBlind(smallBlind, ante),
        createBlind(bigBlind, ante),
        createBlind(bossBlind, ante),
      ],
    };
  }

  function getCurrentBlind(): Blind | null {
    const ante = getCurrentAnte();

    if (ante == null) {
      return null;
    }

    return ante.blinds[_currentBlind];
  }

  function getCurrentAnte(): Ante | null {
    const ante = _antes.find((ante) => ante.ante === _currentAnte);

    if (ante == null) {
      return null;
    }
    return ante;
  }

  function selectNextBlind(): void {
    const currentAnte = getCurrentAnte();
    console.log("currentAnte", currentAnte);
    console.log("_currentBlind", _currentBlind);
    if (currentAnte == null) {
      return;
    }

    if (_currentBlind + 1 >= currentAnte.blinds.length) {
      _currentBlind = 0;
      _currentAnte++;
    } else {
      _currentBlind++;
      _engine.emitEvent("blind-selected", _currentAnte);
    }
  }

  return {
    name: "blind-manager",
    init,
    getCurrentBlind,
    getCurrentAnte,
    selectNextBlind,
  };
}

export function getBlindManagerPlugin(
  engine: BalatroEngine
): BlindManagerPlugin {
  const plugin = engine.getPlugin<BlindManagerPlugin>("blind-manager");
  if (plugin == null) {
    throw new Error("BlindManagerPlugin not found");
  }
  return plugin;
}

function createBlind(config: BlindConfig, currentAnte: number): Blind {
  const anteConfig = ANTE_LEVELS.find((ante) => ante.level === currentAnte);

  if (anteConfig == null) {
    throw new Error("No ante config found for ante level " + currentAnte);
  }
  return {
    name: "Blind",
    score: anteConfig.baseChip * config.amountMultiplier,
    reward: config.money,
  };
}

const bossBlinds: BlindConfig[] = [createBossBlind1()];

function createSmallBlind(): BlindConfig {
  return {
    id: "1",
    amountMultiplier: 1,
    name: "Blind",
    description: "Blind",
    mininimumAnte: 0,
    money: 3,
  };
}

function createBigBlind(): BlindConfig {
  return {
    id: "1",
    amountMultiplier: 1.5,
    name: "Blind",
    description: "Blind",
    mininimumAnte: 0,
    money: 4,
  };
}

function createBossBlind1(): BlindConfig {
  return {
    id: "1",
    amountMultiplier: 2,
    name: "Blind",
    description: "Blind",
    mininimumAnte: 0,
    money: 4,
  };
}

export const ANTE_LEVELS: AnteLevelConfig[] = [
  {
    level: 0,
    baseChip: 100,
  },
  {
    level: 1,
    baseChip: 300,
  },
  {
    level: 2,
    baseChip: 800,
  },
  {
    level: 3,
    baseChip: 2000,
  },
  {
    level: 4,
    baseChip: 5000,
  },
  {
    level: 5,
    baseChip: 11000,
  },
  {
    level: 6,
    baseChip: 20000,
  },
  {
    level: 7,
    baseChip: 35000,
  },
  {
    level: 8,
    baseChip: 50000,
  },
];
