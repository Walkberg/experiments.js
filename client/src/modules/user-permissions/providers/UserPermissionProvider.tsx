import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { UserPermission, UserPermissionFiltering } from "../user-permissions";
import { useUserPermissionClient } from "./UserPermissionClientProvider";

type Status = "fetching" | "init" | "succeed" | "error";

interface UserPermissionContextState {
  status: Status;
  permissions: UserPermission[];
}

const UserPermissionContext = createContext<UserPermissionContextState | null>(
  null
);

interface UserPermissionProviderProps {
  children: ReactNode;
}

export const UserPermissionProvider = ({
  children,
}: UserPermissionProviderProps) => {
  const client = useUserPermissionClient();

  const [userId] = useState<string>("user-1");
  const [organizationId] = useState<string>("organization-1");

  const [status, setStatus] = useState<Status>("init");
  const [permissions, setPermissions] = useState<UserPermission[]>([]);

  useEffect(() => {
    const fetchPermissions = async () => {
      try {
        setStatus("fetching");
        const filtering: UserPermissionFiltering = { userId, organizationId };
        const fetchedPermissions = await client.getUserPermissions(filtering);
        setPermissions(fetchedPermissions);
        setStatus("succeed");
      } catch (error) {
        setStatus("error");
      }
    };

    fetchPermissions();
  }, [userId, organizationId, client]);

  return (
    <UserPermissionContext.Provider value={{ permissions, status }}>
      {children}
    </UserPermissionContext.Provider>
  );
};

export function useUserPermissions() {
  const context = useContext(UserPermissionContext);

  if (context === null) {
    throw new Error(
      "useUserPermissions doit être utilisé dans un composant enfant de UserPermissionProvider"
    );
  }

  return context;
}
