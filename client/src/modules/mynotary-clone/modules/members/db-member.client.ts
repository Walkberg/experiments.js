import { db } from "../local-db/db";
import { v4 as uuidv4 } from "uuid";
import {
  ExistingMember,
  InvitedMember,
  Member,
  MemberClient,
  MemberNew,
} from "./members";
import { MemberDb } from "../local-db/db.type";

export class DbMemberClient implements MemberClient {
  async getMember(memberId: string): Promise<Member> {
    const member = await db.members.get(memberId);

    if (!member) throw new Error(`Member ${memberId} not found`);

    return convertMemberDbToMember(member);
  }

  async getMembers(organizationId: string): Promise<Member[]> {
    const members = await db.members
      // .where("organizationId")
      // .equals(organizationId)
      .toArray();

    return await Promise.all(
      members.map((member) => this.convertMemberDbToMember(member))
    );
  }

  async createMember(memberNew: MemberNew): Promise<Member> {
    const now = new Date().toISOString();
    const member: MemberDb = {
      ...memberNew,
      id: uuidv4(),
      creationDate: now,
      lastUpdateDate: now,
    };

    await db.members.add(member);

    return this.convertMemberDbToMember(member);
  }

  private async convertMemberDbToMember(memberDb: MemberDb): Promise<Member> {
    const user = await db.users.where("email").equals(memberDb.email).first();

    if (user) {
      const existingMember: ExistingMember = {
        ...memberDb,
        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        },
      };
      return existingMember;
    }

    const invitedMember: InvitedMember = {
      ...memberDb,
    };
    return invitedMember;
  }
}

function convertMemberDbToMember(memberDb: MemberDb): Member {
  return {
    ...memberDb,
  };
}
