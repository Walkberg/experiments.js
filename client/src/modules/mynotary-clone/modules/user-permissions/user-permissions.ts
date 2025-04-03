export interface UserPermission {
  id: string;
  type: string;
  subType:string;
  userId: string;
  organizationId: string;
}

export interface UserPermissionFiltering {
  userId: string;
  organizationId: string;
}

export interface UserPermissionClient {
  getUserPermissions: (
    filtering: UserPermissionFiltering
  ) => Promise<UserPermission[]>;
}
