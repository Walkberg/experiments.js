export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  creationDate: string;
  lastUpdateDate: string;
}

export interface UserNew {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
}

export interface UserClient {
  getUser: (email: string) => Promise<User>;

  getUsers: () => Promise<User[]>;

  createUser: (user: UserNew) => Promise<User>;
}
