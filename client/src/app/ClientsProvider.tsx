import { DbContractClient } from "@/modules/mynotary-clone/modules/contracts/db-contract.client";
import { ContractClientProvider } from "@/modules/mynotary-clone/modules/contracts/providers/ContractClientProvider";
import { DriveClientProvider } from "@/modules/mynotary-clone/modules/drive/providers/DriveClientProvider";
import { MemberClientProvider } from "@/modules/mynotary-clone/modules/members/providers/MemberClientProvider";
import { NotificationClientProvider } from "@/modules/mynotary-clone/modules/notification/providers/NotificationClientProvider";
import { OperationClientProvider } from "@/modules/mynotary-clone/modules/operations/providers/OperationClientProvider";
import { OrganizationClientProvider } from "@/modules/mynotary-clone/modules/organizations/providers/OrganizationClientProvider";
import { RecordClientProvider } from "@/modules/mynotary-clone/modules/records/providers/RecordClientProvider";
import { RecordConfigClientProvider } from "@/modules/mynotary-clone/modules/records/providers/RecordConfigClientProvider";
import { FakeUserPermissionClient } from "@/modules/mynotary-clone/modules/user-permissions/in-memory-user-permission.client";
import { UserPermissionClientProvider } from "@/modules/mynotary-clone/modules/user-permissions/providers/UserPermissionClientProvider";
import { UserClientProvider } from "@/modules/mynotary-clone/modules/user/providers/UserClientProvider";
import { ReactNode } from "react";

interface ClientProviderProps {
  children: ReactNode;
}

export const ClientsProvider = ({ children }: ClientProviderProps) => {
  return (
    <RecordConfigClientProvider>
      <RecordClientProvider>
        <OperationClientProvider>
          <MemberClientProvider>
            <OrganizationClientProvider>
              <ContractClientProvider contractClient={new DbContractClient()}>
                <NotificationClientProvider>
                  <UserPermissionClientProvider
                    userPermissionClient={new FakeUserPermissionClient()}
                  >
                    <UserClientProvider>
                      <DriveClientProvider>{children}</DriveClientProvider>
                    </UserClientProvider>
                  </UserPermissionClientProvider>
                </NotificationClientProvider>
              </ContractClientProvider>
            </OrganizationClientProvider>
          </MemberClientProvider>
        </OperationClientProvider>
      </RecordClientProvider>
    </RecordConfigClientProvider>
  );
};
