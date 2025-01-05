import { BalatroEngine } from "../balatro-engine";
import { v4 as uuid } from "uuid";
import {
  PlanetType,
  Consumable,
  getHandScorePlugin,
  convertPlanetTypeToHandType,
} from "../plugins";
import { Buyable, Sellable, Useable } from "./cards";
import { packs } from "./packs";
import { tarotCards } from "./tarots";

type PlanetConfigId = string;

type Position = {
  x: number;
  y: number;
};

export type PlanetCard = {
  id: string;
  name: string;
  type: "planet";
  description: string;
  configId: PlanetConfigId;
} & Buyable &
  Useable &
  Sellable;

export type PlanetConfig = {
  id: PlanetConfigId;
  position: Position;
};

const planetConfigs: Record<PlanetConfigId, PlanetConfig> = {
  p_mercury: {
    id: "p_mercury",
    position: {
      x: 0,
      y: 3,
    },
  },
  p_venus: {
    id: "p_venus",
    position: {
      x: 1,
      y: 3,
    },
  },
  p_earth: {
    id: "p_earth",
    position: {
      x: 2,
      y: 3,
    },
  },
  p_mars: {
    id: "p_mars",
    position: {
      x: 3,
      y: 3,
    },
  },
  p_jupiter: {
    id: "p_jupiter",
    position: {
      x: 4,
      y: 3,
    },
  },
  p_saturn: {
    id: "p_saturn",
    position: {
      x: 5,
      y: 3,
    },
  },
  p_uranus: {
    id: "p_uranus",
    position: {
      x: 6,
      y: 3,
    },
  },
  p_neptune: {
    id: "p_neptune",
    position: {
      x: 7,
      y: 3,
    },
  },
  p_pluto: {
    id: "p_pluto",
    position: {
      x: 8,
      y: 3,
    },
  },
};

export function getPlanetConfig(configId: PlanetConfigId): PlanetConfig {
  return planetConfigs[configId];
}

export function createPlanetConsumable({
  name,
  description,
  planeteType,
  configId,
}: {
  name: string;
  description: string;
  planeteType: PlanetType;
  configId: PlanetConfigId;
}): PlanetCard {
  function onConsumableUsed(ctx: BalatroEngine) {
    const handScoreManager = getHandScorePlugin(ctx);

    handScoreManager.improveHandScore(convertPlanetTypeToHandType(planeteType));
  }

  function checkCanUse(ctx: BalatroEngine) {
    return true;
  }

  function getBuyPrice() {
    return 3;
  }

  function getSellPrice() {
    return Math.floor(getBuyPrice() / 2);
  }

  return {
    id: uuid(),
    name: name,
    type: "planet",
    description,
    configId,
    onConsumableUsed,
    checkCanUse,
    getBuyPrice,
    getSellPrice,
  };
}

export function createMercury(): Consumable {
  return createPlanetConsumable({
    name: "Mercure",
    description: "Niveau supérieur Pair. +1 Multi. et +15 Jetons.",
    planeteType: "mercury",
    configId: "p_mercury",
  });
}

export function createVenus(): Consumable {
  return createPlanetConsumable({
    name: "Vénus",
    description: "Niveau supérieur Brelan. +2 Multi. et +20 Jetons.",
    planeteType: "venus",
    configId: "p_venus",
  });
}

export function createEarth(): Consumable {
  return createPlanetConsumable({
    name: "Terre",
    description: "Niveau supérieur Full House. +2 Multi. et +25 Jetons.",
    planeteType: "earth",
    configId: "p_earth",
  });
}

export function createMars(): Consumable {
  return createPlanetConsumable({
    name: "Mars",
    description: "Niveau supérieur Carré. +3 Multi. et +30 Jetons.",
    planeteType: "mars",
    configId: "p_mars",
  });
}

export function createJupiter(): Consumable {
  return createPlanetConsumable({
    name: "Jupiter",
    description: "Niveau supérieur Couleur. +2 Multi. et +15 Jetons.",
    planeteType: "jupiter",
    configId: "p_jupiter",
  });
}

export function createSaturn(): Consumable {
  return createPlanetConsumable({
    name: "Saturne",
    description: "Niveau supérieur Suite. +2 Multi. et +25 Jetons.",
    planeteType: "saturn",
    configId: "p_saturn",
  });
}

export function createUranus(): Consumable {
  return createPlanetConsumable({
    name: "Uranus",
    description: "Niveau supérieur Deux Paires. +1 Multi. et +20 Jetons.",
    planeteType: "uranus",
    configId: "p_uranus",
  });
}

export function createNeptune(): Consumable {
  return createPlanetConsumable({
    name: "Neptune",
    description: "Niveau supérieur Quite Flush. +3 Multi. et +40 Jetons.",
    planeteType: "neptune",
    configId: "p_neptune",
  });
}

export function createPluto(): Consumable {
  return createPlanetConsumable({
    name: "Pluton",
    description: "Niveau supérieur Carte Haute. +1 Multi. et +10 Jetons.",
    planeteType: "pluto",
    configId: "p_pluto",
  });
}

export const planetCards: Consumable[] = [
  createMercury(),
  createVenus(),
  createEarth(),
  createMars(),
  createJupiter(),
  createSaturn(),
  createUranus(),
  createNeptune(),
  createPluto(),
];

export const itemsPlayer = [...planetCards, ...tarotCards, ...packs];
