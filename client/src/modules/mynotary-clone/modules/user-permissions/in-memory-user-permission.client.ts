import {
  UserPermissionClient,
  UserPermissionFiltering,
  UserPermission,
} from "./user-permissions";

const initialValues = [
  {
    id: "1",
    type: "contract",
    subType: "create",
    userId: "user-1",
    organizationId: "organization-1",
  },
  {
    id: "2",
    type: "contract",
    subType: "read",
    userId: "user-1",
    organizationId: "organization-1",
  },
  {
    id: "3",
    type: "User",
    subType: "create",
    userId: "user-2",
    organizationId: "organization-1",
  },
  {
    id: "4",
    type: "User",
    subType: "create",
    userId: "user-1",
    organizationId: "organization-2",
  },
];

export class FakeUserPermissionClient implements UserPermissionClient {
  userPermissions: UserPermission[] = initialValues;

  async getUserPermissions(
    filtering: UserPermissionFiltering
  ): Promise<UserPermission[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return this.userPermissions.filter(
      (permission) =>
        permission.userId === filtering.userId &&
        permission.organizationId === filtering.organizationId
    );
  }
}
