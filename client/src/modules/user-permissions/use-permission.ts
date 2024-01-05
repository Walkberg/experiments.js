import { useUserPermissions } from "./providers/UserPermissionProvider";

export function usePermission(type: string, subType: string) {
  const permission = useUserPermissions();

  if (permission.permissions == null) {
    return false;
  }

  console.log(permission);

  return (
    permission.permissions.filter(
      (perm) => (perm.type === type && perm.subType === subType)
    ).length !== 0
  );
}
