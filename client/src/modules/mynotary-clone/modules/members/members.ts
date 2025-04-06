import { IsoDate, MemberId, OrganizationId, UserId } from "../../types/common";

export type Member = {
  id: MemberId;
  email: string;
  userId: UserId;
  organizationId: OrganizationId;
  creationDate: IsoDate;
  lastUpdateDate: IsoDate;
};

export type MemberNew = {
  email: string;
  organizationId: OrganizationId;
};

export interface MemberClient {
  getMember: (memberId: MemberId) => Promise<Member>;

  getMembers: (organizationId: OrganizationId) => Promise<Member[]>;

  createMember: (member: MemberNew) => Promise<Member>;
}
