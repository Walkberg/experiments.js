import { CustomCallback } from "./callbacks/mod-callback";
import { PostGameStart } from "./callbacks/post-game-start";

export enum ModCallBack {
  onGameStart = "onGameStart",
  onGameEnd = "onGameEnd",
}

export interface Mod {
  addCallBack(callBackType: ModCallBack, callback: () => void): void;
}

interface Mods {
  mods: Mod[];

  addMod(modName: string, mod: Mod): void;

  removeMod(modName: string): void;
}

const getModManager = createModManager();

export function createModManager() {
  let instance: Mods | null = null;

  return () => {
    if (instance === null) {
      instance = createMods();
    }

    return instance;
  };
}

export function createMods(): Mods {
  const modInterne: Record<string, Mod> = {};

  function addMod(modName: string, mod: Mod): void {
    modInterne[modName] = mod;
  }

  function removeMod(modName: string): void {
    delete modInterne[modName];
  }

  return {
    mods: Object.values(modInterne),
    addMod,
    removeMod,
  };
}

export function RegisterMod(modName: string, priority: number): Mod {
  const mod = createMod(modName, priority);

  getModManager().addMod(modName, mod);

  return mod;
}

function createMod(modName: string, priority: number): Mod {
  const mod: Mod = {
    addCallBack: (callBackType: ModCallBack, callback: () => void) => {
      getCallbackManager()?.[callBackType].addSubscriber(1, callback);
    },
  };
  return mod;
}

export function createCallbackManager() {
  let callBacks: Record<ModCallBack, CustomCallback> | null = null;

  return () => {
    if (callBacks == null) {
      callBacks = createCallbackSingleton();
    }

    return callBacks;
  };
}

export const getCallbackManager = createCallbackManager();

function createCallbackSingleton() {
  const callBacks: Record<ModCallBack, CustomCallback> = {
    [ModCallBack.onGameStart]: new PostGameStart(),
    [ModCallBack.onGameEnd]: new PostGameStart(),
  };

  return callBacks;
}

const mod = RegisterMod("test", 1);

mod.addCallBack(ModCallBack.onGameStart, () => {
  console.log("onGameStart");
});

mod.addCallBack(ModCallBack.onGameEnd, () => {
  console.log("onGameEnd");
});

const mod2 = RegisterMod("test 2", 1);

mod2.addCallBack(ModCallBack.onGameStart, () => {
  console.log("onGameStart mod 2");
});

mod2.addCallBack(ModCallBack.onGameEnd, () => {
  console.log("onGameEnd mod 2");
});
