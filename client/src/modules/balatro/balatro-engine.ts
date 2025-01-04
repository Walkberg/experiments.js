export type EventName =
  | "deck-selected"
  | "deck-generated"
  | "change-phase"
  | "phase-changed"
  | "hand-reset"
  | "hand-play"
  | "hand-played"
  | "hand-discard"
  | "hand-discarded"
  | "card-play"
  | "card-played"
  | "card-discard"
  | "card-discarded"
  | "card-destroyed"
  | "card-upgraded"
  | "score-calculated"
  | "score-reset"
  | "phase-next"
  | "played-card-reset"
  | "shop-rerolled"
  | "shop-item-bought"
  | "economy-updated"
  | "card-selected"
  | "card-unselected"
  | "buffon-added"
  | "buffon-removed"
  | "consumable-added"
  | "consumable-removed"
  | "consumable-used"
  | "hand-score-improved"
  | "achievement-unlocked"
  | "score-card-calculated"
  | "blind-selected"
  | "seed-set"
  | "stats-updated"
  | "shop-phase-changed"
  | "pack-skip"
  | "pack-pick"
  | "player-stats-updated";

export interface BalatroEngine {
  removePlugin: (modName: string) => void;
  emitEvent: (eventName: EventName, payload: any) => void;
  onEvent: (eventName: EventName, callback: EventCallback) => void;
  hasPlugin: (name: string) => boolean;
  registerPlugin: (mod: Plugin) => void;
  getPlugin: <T extends Plugin>(name: string) => T | null;
}

export interface Plugin {
  name: string;
  init: (engine: BalatroEngine) => void;
}

export type EventCallback = (payload: any) => void | Promise<void>;

export function createBalatroEngine(): BalatroEngine {
  const plugins: Record<string, Plugin> = {};

  const eventListeners: Map<string, EventCallback[]> = new Map();

  function on(eventName: string, callback: EventCallback): void {
    if (!eventListeners.has(eventName)) {
      eventListeners.set(eventName, []);
    }

    eventListeners.get(eventName)!.push(callback);
  }

  async function emit(eventName: string, payload: any): Promise<void> {
    const listeners = eventListeners.get(eventName);

    if (listeners) {
      await Promise.all(
        listeners.map(async (callback) => await callback(payload))
      );
    }
  }

  function hasPlugin(pluginName: string) {
    return pluginName in plugins;
  }

  function registerPlugin(plugin: Plugin) {
    if (!hasPlugin(plugin.name)) {
      plugins[plugin.name] = plugin;
      plugin.init(engine);
    }
  }

  function removePlugin(modName: string) {
    if (hasPlugin(modName)) {
      delete plugins[modName];
    }
  }

  function getPlugin<T extends Plugin>(pluginName: string): T | null {
    return (plugins[pluginName] as T) || null;
  }

  const engine: BalatroEngine = {
    hasPlugin: hasPlugin,
    registerPlugin: registerPlugin,
    removePlugin: removePlugin,
    onEvent: on,
    emitEvent: emit,
    getPlugin,
  };

  return engine;
}
