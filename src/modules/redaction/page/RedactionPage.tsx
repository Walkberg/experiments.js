import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Branches } from "@/modules/branches/components/Branches";

export const RedactionPage = () => {

  return (
    <div className="flex row items-center content-center">
      <div className="bg-slate-100 w-96">
        <Tabs defaultValue="account">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Questions</TabsTrigger>
            <TabsTrigger value="password">Documents</TabsTrigger>
          </TabsList>
          <TabsContent value="account">
           <Branches operationId={"operation-1"}/>
          </TabsContent>
          <TabsContent value="password">Documents</TabsContent>
        </Tabs>
      </div>
      <div>Redaction</div>
    </div>
  );
};
