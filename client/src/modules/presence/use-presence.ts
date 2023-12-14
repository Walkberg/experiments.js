import { useContext, useState } from "react";
import { Presence, RoomContext } from "./room-provider";

type UsePresence = [Presence, (presence: Presence) => void];

export const usePresence = (): UsePresence => {
  const context = useContext(RoomContext);

  if (context == null) {
    throw new Error();
  }

  return [context.myPresence, context.updateMyPresence];
};
