import { createContext, useContext, useState, ReactNode } from "react";
import { Organization } from "../organization";

interface OrganizationsContextState {
  organizations: Organization[];
  setOrganizations: (orgs: Organization[]) => void;
  addOrganization: (org: Organization) => void;
  removeOrganization: (orgId: string) => void;
}

const OrganizationsContext = createContext<OrganizationsContextState | null>(
  null
);

interface OrganizationsProviderProps {
  children: ReactNode;
}

export function OrganizationsProvider({
  children,
}: OrganizationsProviderProps) {
  const [organizations, setOrganizations] = useState<Organization[]>([]);

  const addOrganization = (org: Organization) => {
    setOrganizations((prev) => [...prev, org]);
  };

  const removeOrganization = (orgId: string) => {
    setOrganizations((prev) => prev.filter((o) => o.id !== orgId));
  };

  return (
    <OrganizationsContext.Provider
      value={{
        organizations,
        setOrganizations,
        addOrganization,
        removeOrganization,
      }}
    >
      {children}
    </OrganizationsContext.Provider>
  );
}

export function useOrganizations(): OrganizationsContextState {
  const context = useContext(OrganizationsContext);
  if (!context) {
    throw new Error(
      "useOrganizations doit être utilisé dans un composant enfant de OrganizationsProvider"
    );
  }
  return context;
}
