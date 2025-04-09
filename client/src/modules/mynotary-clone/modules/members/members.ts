import { IsoDate, MemberId, OrganizationId } from "../../types/common";

export type Member = {
  id: MemberId;
  email: string;
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
