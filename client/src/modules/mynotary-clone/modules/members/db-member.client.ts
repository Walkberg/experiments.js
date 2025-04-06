import { db } from "../local-db/db";
import { v4 as uuidv4 } from "uuid";
import { Member, MemberClient, MemberNew } from "./members";

export class DbMemberClient implements MemberClient {
  async getMember(memberId: string): Promise<Member> {
    const member = await db.members.get(memberId);
    if (!member) throw new Error(`Member ${memberId} not found`);
    return member;
  }

  async getMembers(organizationId: string): Promise<Member[]> {
    return await db.members
      .where("organizationId")
      .equals(organizationId)
      .toArray();
  }

  async createMember(memberNew: MemberNew): Promise<Member> {
    const now = new Date().toISOString();
    const member: Member = {
      ...memberNew,
      id: uuidv4(),
      creationDate: now,
      lastUpdateDate: now,
    };

    await db.members.add(member);
    return member;
  }
}
