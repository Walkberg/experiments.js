import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Room } from "@/modules/presence/Room";
import { RoomProvider } from "@/modules/presence/room-provider";
import { RedactionProvider } from "../providers/RedactionProvider";
import { OperationLinkConfigs } from "../components/OperationLinkConfigs";

export const RedactionPage = () => {
  return (
    <RedactionProvider templateId={"vente-ancien"}>
      <RoomProvider roomId={"roome-cool"}>
        <div className="flex row items-center content-center w-full h-full">
          <div className="flex flex-col w-[700px]">
            <Tabs defaultValue="account">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="account">Questions</TabsTrigger>
                <TabsTrigger value="password">Documents</TabsTrigger>
              </TabsList>
              <div className="flex flex-col flex-auto scroll-auto">
                <TabsContent value="account">
                  {/* <BranchesProvider operationId="operation-1">
                  <Branches />
                </BranchesProvider> */}
                  <OperationLinkConfigs />
                </TabsContent>
                <TabsContent value="password">Documents</TabsContent>
              </div>
            </Tabs>
          </div>
          <div>
            Redaction
            {/* <Button onClick={updatePresence}>Update presence</Button> */}
            <Room />
          </div>
        </div>
      </RoomProvider>
    </RedactionProvider>
  );
};
