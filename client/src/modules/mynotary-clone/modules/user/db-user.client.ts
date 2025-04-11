import { db } from "../local-db/db";
import { v4 as uuidv4 } from "uuid";
import { User, UserClient, UserNew } from "./user";
import { UserDb } from "../local-db/db.type";

export class DbUserClient implements UserClient {
  async getUser(userId: string): Promise<User> {
    const user = await db.users.get(userId);
    if (!user) throw new Error(`User ${userId} not found`);
    return convertUserDbToUser(user);
  }

  async getUsers(): Promise<User[]> {
    const users = await db.users.toArray();
    return users.map(convertUserDbToUser);
  }

  async createUser(userNew: UserNew): Promise<User> {
    const now = new Date().toISOString();
    const user: UserDb = {
      ...userNew,
      id: uuidv4(),
      creationDate: now,
      lastUpdateDate: now,
    };

    await db.users.add(user);

    return convertUserDbToUser(user);
  }
}

function convertUserDbToUser(userDb: UserDb): User {
  return {
    ...userDb,
  };
}
