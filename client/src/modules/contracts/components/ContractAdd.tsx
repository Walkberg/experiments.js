import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { usePermission } from "@/modules/user-permissions/use-permission";

interface ContractAddProps {}

export const ContractAdd = ({}) => {
  const canCreate = usePermission("contract", "create");

  return (
    <Dialog>
      <DialogTrigger asChild={true}>
        <Button disabled={!canCreate}>Crree un contract</Button>
      </DialogTrigger>
    </Dialog>
  );
};
