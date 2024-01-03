import { FakeContractClient } from "@/modules/contracts/in-memory-contract.client";
import { ContractClientProvider } from "@/modules/contracts/providers/ContractClientProvider";
import { DriveClientProvider } from "@/modules/drive/providers/DriveClientProvider";
import { NotificationClientProvider } from "@/modules/notification/providers/NotificationClientProvider";
import { OperationClientProvider } from "@/modules/operations/providers/OperationClientProvider";
import { FakeUserPermissionClient } from "@/modules/user-permissions/in-memory-user-permission.client";
import { UserPermissionClientProvider } from "@/modules/user-permissions/providers/UserPermissionClientProvider";
import { UserClientProvider } from "@/modules/user/providers/UserClientProvider";
import { ReactNode } from "react";

interface ClientProviderProps {
  children: ReactNode;
}

export const ClientsProvider = ({ children }: ClientProviderProps) => {
  return (
    <OperationClientProvider>
      <ContractClientProvider contractClient={new FakeContractClient()}>
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
    </OperationClientProvider>
  );
};
