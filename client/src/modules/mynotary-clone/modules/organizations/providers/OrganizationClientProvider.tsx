import { createContext, useContext, ReactNode } from "react";
import { OrganizationClient } from "../organization";
import { DbOrganizationClient } from "../db-organization.client";

const OrganizationClientContext = createContext<OrganizationClient | null>(
  null
);

interface OrganizationClientProviderProps {
  children: ReactNode;
  client?: OrganizationClient;
}

export function OrganizationClientProvider({
  children,
  client = new DbOrganizationClient(),
}: OrganizationClientProviderProps) {
  return (
    <OrganizationClientContext.Provider value={client}>
      {children}
    </OrganizationClientContext.Provider>
  );
}

export function useOrganizationClient(): OrganizationClient {
  const context = useContext(OrganizationClientContext);
  if (!context) {
    throw new Error(
      "useOrganizationClient doit être utilisé dans un OrganizationClientProvider"
    );
  }
  return context;
}
