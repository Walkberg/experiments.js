import { createContext, useContext, useState, ReactNode } from "react";
import { User } from "../user";

interface UsersContextState {
  users: User[];
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
}

const UsersContext = createContext<UsersContextState | null>(null);

interface UsersProviderProps {
  children: ReactNode;
}

export function UsersProvider({ children }: UsersProviderProps) {
  const [users, setUsers] = useState<User[]>([]);

  const addUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
  };

  const removeUser = (userId: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== userId));
  };

  return (
    <UsersContext.Provider
      value={{
        users,
        setUsers,
        addUser,
        removeUser,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
}

export function useUsers(): UsersContextState {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error(
      "useUsers doit être utilisé dans un composant enfant de UsersProvider"
    );
  }
  return context;
}
