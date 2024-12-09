import { v4 as uuid } from "uuid";
import { BalatroEngine } from "./balatro-engine";
import {
  Consumable,
  ConsumablesManagerPlugin,
  ConsumableType,
  convertPlanetTypeToHandType,
  getHandScorePlugin,
  PlanetType,
} from "./plugins";
import { tarotCards } from "./tarots";

export function createPlanetConsumable({
  name,
  description,
  planeteType,
}: {
  name: string;
  description: string;
  planeteType: PlanetType;
}): Consumable {
  const planet = createBaseConsumable({
    name,
    description,
    type: "planet",
  });

  planet.onConsumableUse = (ctx: BalatroEngine) => {
    const handScoreManager = getHandScorePlugin(ctx);

    handScoreManager.improveHandScore(convertPlanetTypeToHandType(planeteType));
  };

  return planet;
}

export function createTarotConsumable({
  name,
  description,
}: {
  name: string;
  description: string;
}): Consumable {
  return createBaseConsumable({
    name,
    description,
    type: "tarot",
  });
}

export function createBaseConsumable({
  name,
  description,
  type,
}: {
  name: string;
  description: string;
  type: ConsumableType;
}): Consumable {
  return {
    id: uuid(),
    name: name,
    type: type,
    description,
  };
}

export function createMercury(): Consumable {
  return createPlanetConsumable({
    name: "Mercure",
    description: "Niveau supérieur Pair. +1 Multi. et +15 Jetons.",
    planeteType: "mercury",
  });
}

export function createVenus(): Consumable {
  return createPlanetConsumable({
    name: "Vénus",
    description: "Niveau supérieur Brelan. +2 Multi. et +20 Jetons.",
    planeteType: "venus",
  });
}

export function createEarth(): Consumable {
  return createPlanetConsumable({
    name: "Terre",
    description: "Niveau supérieur Full House. +2 Multi. et +25 Jetons.",
    planeteType: "earth",
  });
}

export function createMars(): Consumable {
  return createPlanetConsumable({
    name: "Mars",
    description: "Niveau supérieur Carré. +3 Multi. et +30 Jetons.",
    planeteType: "mars",
  });
}

export function createJupiter(): Consumable {
  return createPlanetConsumable({
    name: "Jupiter",
    description: "Niveau supérieur Couleur. +2 Multi. et +15 Jetons.",
    planeteType: "jupiter",
  });
}

export function createSaturn(): Consumable {
  return createPlanetConsumable({
    name: "Saturne",
    description: "Niveau supérieur Suite. +2 Multi. et +25 Jetons.",
    planeteType: "saturn",
  });
}

export function createUranus(): Consumable {
  return createPlanetConsumable({
    name: "Uranus",
    description: "Niveau supérieur Deux Paires. +1 Multi. et +20 Jetons.",
    planeteType: "uranus",
  });
}

export function createNeptune(): Consumable {
  return createPlanetConsumable({
    name: "Neptune",
    description: "Niveau supérieur Quite Flush. +3 Multi. et +40 Jetons.",
    planeteType: "neptune",
  });
}

export function createPluto(): Consumable {
  return createPlanetConsumable({
    name: "Pluton",
    description: "Niveau supérieur Carte Haute. +1 Multi. et +10 Jetons.",
    planeteType: "pluto",
  });
}
export function createLeMat(): Consumable {
  const tarotCard = createTarotConsumable({
    name: "tarot_1",
    description:
      "Crée la carte de Tarot ou de Planète utilisée en dernier durant cette partie, en excluant Le mat.",
  });

  tarotCard.onConsumableUse = (ctx) => {
    const manager = ctx.getPlugin<ConsumablesManagerPlugin>(
      "consumables-manager"
    );

    if (manager == null) {
      throw new Error("consumables-manager plugin not found");
    }

    const lastConsumable = manager?.getLastConsumableUsed();

    console.log("last consumable", lastConsumable);

    if (lastConsumable == null) {
      return;
    }

    manager.addConsumable(lastConsumable);
  };

  return tarotCard;
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

export const itemsPlayer = [...planetCards, ...tarotCards];
