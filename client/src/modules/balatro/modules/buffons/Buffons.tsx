import { useState } from "react";
import { SellCard } from "../consumables/SellCard";
import { BuffonCard } from "./BuffonCard";
import { useBuffonManager } from "./useBuffonManager";
import { BuffonCard as Buffon } from "../../cards/buffons";
import { CardContainer } from "../../BalatroPage";

interface BuffonsProps {}

export const Buffons = ({}: BuffonsProps) => {
  const [selectedItem, setSelectedItem] = useState<Buffon | null>(null);

  const buffonManager = useBuffonManager();

  if (buffonManager == null) {
    return null;
  }

  const handleSellJoker = (id: string) => {
    buffonManager.buffonManager.sellBuffon(id);
  };

  return (
    <CardContainer
      maxCount={buffonManager.buffonManager.getMaxCount()}
      currentCount={buffonManager.buffons.length}
    >
      <div className="flex flex-row gap-2 justify-between">
        {buffonManager.buffons.map((buffon) => (
          <BuffonCard
            selected={selectedItem?.id === buffon.id}
            key={buffon.id}
            buffon={buffon}
            hoverSide={"bottom"}
            onClick={() =>
              setSelectedItem(selectedItem?.id === buffon.id ? null : buffon)
            }
            rightComponent={
              <SellCard
                sellable={buffon}
                onSell={() => handleSellJoker(buffon.id)}
              />
            }
          />
        ))}
      </div>
    </CardContainer>
  );
};
