import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../user";
import { useUserClient } from "./UserClientProvider";

type Status = "fetching" | "init" | "succeed" | "error";

interface UserContextState {
  status: Status;
  user?: User;
}

const UserContext = createContext<UserContextState | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
  const [status, setStatus] = useState<Status>("init");
  const [user, setUser] = useState<User>();

  const client = useUserClient();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setStatus("fetching");
        setUser(await client.getUser("john@example.com"));
        setStatus("succeed");
      } catch (e) {
        setStatus("error");
      }
    };

    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, status }}>
      {children}
    </UserContext.Provider>
  );
};

export function useUser() {
  const context = useContext(UserContext);

  if (context == null) {
    throw new Error();
  }

  return context;
}

export const userData: User = {
  firstname: "test",
  lastname: "test",
  email: "test@test.fr",
  id: "user-1",
  avatarUrl: "test",
};
