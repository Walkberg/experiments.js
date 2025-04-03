import { ReactNode, createContext, useContext } from "react";
import { UserPermissionClient } from "../user-permissions";

const UserPermissionClientContext = createContext<UserPermissionClient | null>(
  null
);

interface UserClientProviderProps {
  userPermissionClient: UserPermissionClient;
  children: ReactNode;
}

export const UserPermissionClientProvider = ({
  userPermissionClient,
  children,
}: UserClientProviderProps) => {
  return (
    <UserPermissionClientContext.Provider value={userPermissionClient}>
      {children}
    </UserPermissionClientContext.Provider>
  );
};

export const useUserPermissionClient = (): UserPermissionClient => {
  const client = useContext(UserPermissionClientContext);

  if (client == null) {
    throw new Error(
      "useUserPermissionClient doit être utilisé dans un composant enfant de UserPermissionClientProvider"
    );
  }

  return client;
};
