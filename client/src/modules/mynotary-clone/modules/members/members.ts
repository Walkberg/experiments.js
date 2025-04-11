import { IsoDate, MemberId, OrganizationId, UserId } from "../../types/common";

export type Member = InvitedMember | ExistingMember;

export type InvitedMember = {
  id: MemberId;
  email: string;
  organizationId: OrganizationId;
  creationDate: IsoDate;
  lastUpdateDate: IsoDate;
};

export type ExistingMember = {
  id: MemberId;
  email: string;
  organizationId: OrganizationId;
  creationDate: IsoDate;
  lastUpdateDate: IsoDate;
  user: {
    id: UserId;
    firstname: string;
    lastname: string;
    email: string;
  };
};

export function isExistingMember(member: Member): member is ExistingMember {
  return (member as ExistingMember).user !== undefined;
}

export type MemberNew = {
  email: string;
  organizationId: OrganizationId;
};

export interface MemberClient {
  getMember: (memberId: MemberId) => Promise<Member>;

  getMembers: (organizationId: OrganizationId) => Promise<Member[]>;

  createMember: (member: MemberNew) => Promise<Member>;
}
