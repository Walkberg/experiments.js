import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BranchesProvider } from "@/modules/branches/branches-context";
import { Branches } from "@/modules/branches/components/Branches";
import { Room } from "@/modules/presence/Room";
import { RoomProvider } from "@/modules/presence/room-provider";

export const RedactionPage = () => {
  return (
    <RoomProvider roomId={"roome-cool"}>
      <div className="flex row items-center content-center w-full h-full">
        <div className="flex flex-col bg-slate-100 w-[700px]">
          <Tabs defaultValue="account">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="account">Questions</TabsTrigger>
              <TabsTrigger value="password">Documents</TabsTrigger>
            </TabsList>
            <div className="flex flex-col flex-auto scroll-auto">
              <TabsContent value="account">
                <BranchesProvider operationId="operation-1">
                  <Branches />
                </BranchesProvider>
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
  );
};
