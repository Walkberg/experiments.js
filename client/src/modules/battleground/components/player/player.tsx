import { DropZone } from "@/modules/mynotary-clone/modules/drive/components/DropZone";
import { CardList, PlayerHand } from "../../battleground-page";

export const Player = () => {
  return (
    <div>
      <div>
        <CardList cards={[]} />
      </div>
      <div>
        <DropZone id={"player hand"}>
          <PlayerHand />
        </DropZone>
      </div>
    </div>
  );
};
