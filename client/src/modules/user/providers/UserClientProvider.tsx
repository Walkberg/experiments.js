import { ReactNode, createContext, useContext, useState } from "react";
import { User, UserClient } from "../user";
import { FakeUserClient } from "../in-memory-user.client";

interface UserContextState {
  userClient: UserClient;
}

const UserClientContext = createContext<UserContextState | null>(null);

interface UserClientProviderProps {
  children: ReactNode;
}

export const UserClientProvider = ({ children }: UserClientProviderProps) => {
  const [userClient, setUserClient] = useState<UserClient>(
    new FakeUserClient()
  );

  return (
    <UserClientContext.Provider value={{ userClient }}>
      {children}
    </UserClientContext.Provider>
  );
};

export function useUserClient() {
  const context = useContext(UserClientContext);

  if (context == null) {
    throw new Error();
  }

  return context.userClient;
}

export const userData: User = {
  firstname: "test",
  lastname: "test",
  email: "test@test.fr",
  id: "user-1",
  avatarUrl: "test",
};
