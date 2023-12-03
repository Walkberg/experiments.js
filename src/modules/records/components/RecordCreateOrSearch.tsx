import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { RecordSearch } from "@/modules/records/components/RecordSearch";
import { RecordCreate } from "@/modules/records/components/RecordCreate";
import { RecordCreationProps } from "../record";

export const RecordCreateOrSearch = ({
  acceptedTemplateIds,
  onValidate,
}: RecordCreationProps) => {
  return (
    <Tabs defaultValue="record-create">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="record-create">
          Creer une nouvelle fiche
        </TabsTrigger>
        <TabsTrigger value="record-search">Chercher une fiche</TabsTrigger>
      </TabsList>
      <TabsContent value="record-create">
        <RecordCreate
          onValidate={onValidate}
          acceptedTemplateIds={acceptedTemplateIds}
        />
      </TabsContent>
      <TabsContent value="record-search">
        <RecordSearch
          onValidate={onValidate}
          acceptedTemplateIds={acceptedTemplateIds}
        />
      </TabsContent>
    </Tabs>
  );
};
