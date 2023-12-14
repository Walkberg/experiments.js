import { useContext } from "react";
import { Other, RoomContext } from "./room-provider";

interface UseOther {
  others: Other[];
}

export const useOthers = (): UseOther => {
  const context = useContext(RoomContext);

  if (context == null) {
    throw new Error();
  }

  return { others: context.others };
};
