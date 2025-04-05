import { useUserPermissions } from "./providers/UserPermissionProvider";

export function usePermission(entity: string, permissionType: string) {
  const permission = useUserPermissions();

  if (permission.permissions == null) {
    return false;
  }

  return (
    permission.permissions.filter(
      (perm) => perm.type === entity && perm.subType === permissionType
    ).length !== 0
  );
}
