import { useEffect, useState } from "react";
import { useCurrentGame } from "../../BalatroProvider";
import { Buffon, BuffonsManagerPlugin } from "../../plugins";

export function useBuffonManager() {
  const { balatro } = useCurrentGame();

  const [buffons, setBuffons] = useState<Buffon[]>([]);

  const buffonManager =
    balatro?.getPlugin<BuffonsManagerPlugin>("buffon-manager");

  useEffect(() => {
    if (balatro == null) {
      return;
    }
    const buffonManager =
      balatro?.getPlugin<BuffonsManagerPlugin>("buffon-manager");

    if (buffonManager == null) {
      return;
    }

    balatro.onEvent("buffon-added", () => {
      setBuffons(buffonManager.getBuffons());
    });
  }, [balatro, buffonManager]);

  if (buffonManager == null) {
    return null;
  }

  return { buffons, buffonManager };
}
