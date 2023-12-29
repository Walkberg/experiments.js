export interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  avatarUrl: string;
}

export interface UserClient {
  getUser: (email: string) => Promise<User>;
}
