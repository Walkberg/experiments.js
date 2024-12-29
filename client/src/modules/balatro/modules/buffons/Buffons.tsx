import { useState } from "react";
import { SellCard } from "../consumables/Consumables";
import { BuffonCard } from "./BuffonCard";
import { useBuffonManager } from "./useBuffonManager";
import { Buffon } from "../../plugins";

interface BuffonsProps {}

export const Buffons = ({}: BuffonsProps) => {
  const [selectedItem, setSelectedItem] = useState<Buffon | null>(null);

  const aaa = useBuffonManager();

  if (aaa == null) {
    return null;
  }

  const handleSellJoker = (id: string) => {};

  return (
    <div className="flex flex-row gap-2 justify-between">
      {aaa.buffons.map((buffon) => (
        <BuffonCard
          selected={selectedItem?.id === buffon.id}
          key={buffon.id}
          buffon={buffon}
          hoverSide={"bottom"}
          onClick={() =>
            setSelectedItem(selectedItem?.id === buffon.id ? null : buffon)
          }
          rightComponent={
            <SellCard onSell={() => handleSellJoker(buffon.id)} />
          }
        />
      ))}
    </div>
  );
};
