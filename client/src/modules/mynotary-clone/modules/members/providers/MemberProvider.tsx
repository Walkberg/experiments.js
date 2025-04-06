import { createContext, useContext, useState, ReactNode } from "react";
import { Member } from "../members";

interface MembersContextState {
  members: Member[];
  setMembers: (members: Member[]) => void;
  addMember: (member: Member) => void;
  removeMember: (memberId: string) => void;
}

const MembersContext = createContext<MembersContextState | null>(null);

interface MembersProviderProps {
  children: ReactNode;
}

export function MembersProvider({ children }: MembersProviderProps) {
  const [members, setMembers] = useState<Member[]>([]);

  const addMember = (member: Member) => {
    setMembers((prev) => [...prev, member]);
  };

  const removeMember = (memberId: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  return (
    <MembersContext.Provider
      value={{
        members,
        setMembers,
        addMember,
        removeMember,
      }}
    >
      {children}
    </MembersContext.Provider>
  );
}

export function useMembers(): MembersContextState {
  const context = useContext(MembersContext);
  if (!context) {
    throw new Error(
      "useMembers doit être utilisé dans un composant enfant de MembersProvider"
    );
  }
  return context;
}
