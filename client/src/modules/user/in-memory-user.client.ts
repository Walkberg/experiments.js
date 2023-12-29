import { User, UserClient } from "./user";

export class FakeUserClient implements UserClient {
  // Utilisation d'une fausse base de données pour stocker les utilisateurs
  private users: User[] = [
    {
      id: "1",
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      phone: "123-456-7890",
      avatarUrl: "https://example.com/avatar/john",
    },
    // ... Ajoutez d'autres utilisateurs ici si nécessaire
  ];

  // Méthode pour récupérer un utilisateur en fonction de l'email
  async getUser(email: string): Promise<User> {
    const user = this.users.find((u) => u.email === email);

    if (!user) {
      throw new Error("Utilisateur non trouvé");
    }

    return user;
  }
}
