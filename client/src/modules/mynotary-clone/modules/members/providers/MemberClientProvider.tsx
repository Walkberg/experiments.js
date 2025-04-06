import { createContext, useContext, useState, ReactNode } from "react";
import { MemberClient } from "../members";
import { DbMemberClient } from "../db-member.client";

interface MemberClientContextState {
  memberClient: MemberClient;
}

const MemberClientContext = createContext<MemberClientContextState | null>(
  null
);

interface MemberClientProviderProps {
  children: ReactNode;
}

export const MemberClientProvider = ({
  children,
}: MemberClientProviderProps) => {
  const [memberClient] = useState<MemberClient>(new DbMemberClient());

  return (
    <MemberClientContext.Provider value={{ memberClient }}>
      {children}
    </MemberClientContext.Provider>
  );
};

export function useMemberClient(): MemberClient {
  const context = useContext(MemberClientContext);

  if (context == null) {
    throw new Error(
      "useMemberClient doit être utilisé dans un composant enfant de MemberClientProvider"
    );
  }

  return context.memberClient;
}
