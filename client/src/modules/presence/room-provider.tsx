import { ReactNode, createContext, useEffect, useState } from "react";

import { useSocket } from "./socket-provider";

interface RoomContextType {
  roomId: string;
  myPresence: Presence;
  others: Other[];
  updateMyPresence: (presence: Presence) => void;
}

export const RoomContext = createContext<RoomContextType | null>(null);

interface RoomProviderProps {
  children: ReactNode;
  roomId: string;
}

export const RoomProvider = ({ children, roomId }: RoomProviderProps) => {
  const [myPresence, setMyPresence] = useState<Presence>({ cursor: null });

  useRoom(roomId);

  const updateMyPresence = useUpdatePresence(roomId);

  const others = useOthers();

  return (
    <RoomContext.Provider
      value={{ roomId, updateMyPresence, myPresence, others }}
    >
      {children}
    </RoomContext.Provider>
  );
};

export interface Other {
  connectionId: string;
  presence: Presence;
}

export interface PresenceUpdated {
  connectionId: string;
  presence: Presence;
}

export interface Presence {
  cursor: Cursor | null;
}

export interface Cursor {
  x: number;
  y: number;
}

export const useUpdatePresence = (roomId: string) => {
  const { socket } = useSocket();

  const updatePresence = (presence: Presence) => {
    if (socket != null) {
      socket?.emit("update-presence", {
        roomId: roomId,
        presence: presence,
      });
    }
  };

  return updatePresence;
};

export const useOthers = () => {
  const [others, setOthers] = useState<Other[]>([]);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket == null) {
      return;
    }

    socket.on("user-joined", (message) => {
      if (socket.id !== message.connectionId) {
        setOthers((oldOther) => [
          ...oldOther,
          { connectionId: message.connectionId, presence: { cursor: null } },
        ]);
      }
    });

    return () => {
      socket.off("user-joined");
    };
  }, [socket]);

  useEffect(() => {
    if (socket == null) {
      return;
    }

    socket.on("user-left", (data) => {
      setOthers((others) =>
        others.filter((other) => other.connectionId === data.connectionId)
      );
    });

    return () => {
      socket.off("user-left");
    };
  }, [socket]);

  useEffect(() => {
    if (socket == null) {
      return;
    }

    socket.on("presence-updated", (data: PresenceUpdated) => {
      console.log("presnece update");
      console.log(data.presence);
      if (socket.id !== data.connectionId) {
        setOthers((oldOthers) =>
          oldOthers.map((other) =>
            other.connectionId === data.connectionId  
            
              ? { ...other, presence: data.presence }
              : other
          )
        );
      }
    });

    return () => {
      socket.off("presence-updated");
    };
  }, [socket]);
  

  return others;
};

export const useRoom = (roomId: string) => {
  const { socket } = useSocket();

  useEffect(() => {
    if (socket == null) {
      return;
    }

    socket.emit("join-room", roomId);

    return () => {
      socket.emit("leave-room", roomId);
    };
  }, [socket]);
};
