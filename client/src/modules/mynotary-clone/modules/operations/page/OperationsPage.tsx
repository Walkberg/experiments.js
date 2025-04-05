import {
  ChangeEvent,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useOperationClient } from "../providers/OperationClientProvider";
import { Operation, OperationNew } from "../operation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePermission } from "../../user-permissions/use-permission";
import { useKey } from "@/modules/mynotary-clone/hooks/useKey";
import { Trash } from "lucide-react";

export function OperationsPage() {
  return (
    <OperationsProvider>
      <div className="flex flex-grow flex-col gap-2">
        <div className="flex items-center justify-between">
          <OperationFilter />
          <OperationSearch />
        </div>
        <div>
          <OperationAdd />
        </div>
        <div>
          <OperationList />
        </div>
      </div>
    </OperationsProvider>
  );
}

function OperationFilter() {
  return <div>Operation Filter</div>;
}

function OperationSearch() {
  return <Input placeholder="Rechercher un dossier" />;
}

export function OperationAdd() {
  const userId = "123";
  const organizationId = "1";

  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("");

  const canCreate = usePermission("operation", "create");
  const { createOperation, status } = useCreateOperation();
  const { addOperation } = useOperations();

  const operationTypes = [
    {
      id: "1",
      type: "vente ancien",
    },
    {
      id: "2",
      type: "viager",
    },
  ];

  useKey(["a"], () => setOpen((open) => !open));

  const handleOperationCreated = async (operation: Operation) => {
    setName("");
    setOpen(false);
    addOperation(operation);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await createOperation(
      {
        name: name,
        type: type,
        organizationId: organizationId,
        creatorId: userId,
      },
      {
        onOperationCreated: handleOperationCreated,
      }
    );
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };
  return (
    <div className="flex items-center justify-between">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger>
          <Button disabled={!canCreate}>Ajouter</Button>
        </DialogTrigger>
        <DialogContent>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <Select onValueChange={setType}>
              <label htmlFor={name}>{"type"}</label>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={"placeholder"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {operationTypes.map((option) => (
                    <SelectItem value={option.id}>{option.type}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            <Input
              autoFocus
              placeholder="nom"
              onChange={handleInputChange}
              value={name}
              disabled={!canCreate || status === "creating"}
            />
            <Button disabled={name.length === 0} type="submit">
              Creer
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface OperationCreationOptions {
  onOperationCreate?: () => Promise<void>;
  onOperationCreated?: (operation: Operation) => Promise<void>;
  onOperationCreationFailed?: () => Promise<void>;
}

type MutateStatus = "idle" | "creating" | "success" | "error";

function useCreateOperation() {
  const client = useOperationClient();

  const [status, setStatus] = useState<MutateStatus>("idle");

  const createOperation = async (
    operationNew: OperationNew,
    options: OperationCreationOptions
  ) => {
    setStatus("creating");
    try {
      options.onOperationCreate?.();
      const operation = await client.createOperation(operationNew);
      options.onOperationCreated?.(operation);
      setStatus("success");
    } catch (e) {
      options.onOperationCreationFailed?.();
      setStatus("error");
    }
  };

  return {
    createOperation,
    status,
  };
}

interface OperationDeleteOptions {
  onOperationDelete?: () => Promise<void>;
  onOperationDeleted?: (operationId: string) => Promise<void>;
  onOperationdeleteFailed?: () => Promise<void>;
}

export function useDeleteOperation() {
  const client = useOperationClient();

  const [status, setStatus] = useState<MutateStatus>("idle");

  const deleteOperation = async (
    operationId: string,
    options: OperationDeleteOptions
  ) => {
    setStatus("creating");
    try {
      options.onOperationDelete?.();
      await client.deleteOperation(operationId);
      options.onOperationDeleted?.(operationId);
      setStatus("success");
    } catch (e) {
      options.onOperationdeleteFailed?.();
      setStatus("error");
    }
  };

  return {
    deleteOperation,
    status,
  };
}

interface OperationDeleteProps {
  operationId: string;
}

export function OperationDelete({ operationId }: OperationDeleteProps) {
  const canDelete = usePermission("operation", "delete");

  const { deleteOperation, status } = useDeleteOperation();
  const { removeOperation } = useOperations();

  const handleOPerationDeleted = async (operationId: string) => {
    removeOperation(operationId);
  };

  const handleDeleteOperation = async (
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    await deleteOperation(operationId, {
      onOperationDeleted: handleOPerationDeleted,
    });
  };

  return (
    <Button
      disabled={!canDelete || status === "creating"}
      variant={"ghost"}
      onClick={handleDeleteOperation}
    >
      <Trash />
    </Button>
  );
}

function OperationList() {
  const navigate = useNavigate();

  const { operations, status } = useOperations();

  const handleClickOperation = (operation: Operation) => {
    navigate(`./${operation.id}/contracts`);
  };

  if (status === "fetching") {
    return <div>Loading...</div>;
  }

  if (operations.length === 0) {
    return <div>No operations found</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {operations.map((operation) => (
        <OperationItem
          operation={operation}
          onClick={() => handleClickOperation(operation)}
        />
      ))}
    </div>
  );
}

function OperationItem({
  operation,
  onClick,
}: {
  operation: Operation;
  onClick?: () => void;
}) {
  return (
    <Card onClick={onClick} className="flex items-center justify-between p-2">
      <div>{operation.name}</div>
      <OperationDelete operationId={operation.id} />
    </Card>
  );
}

interface OperationsContextState {
  operations: Operation[];
  status: FetchStatus;
  fetchOperations: () => Promise<void>;
  addOperation: (operation: Operation) => void;
  removeOperation: (operationId: string) => void;
}

const OperationsContext = createContext<OperationsContextState | null>(null);

interface OperationProviderProps {
  children: React.ReactNode;
}

type FetchStatus = "idle" | "fetching" | "success" | "error";

export function OperationsProvider({ children }: OperationProviderProps) {
  const operationClient = useOperationClient();

  const [operations, setOperations] = useState<Operation[]>([]);
  const [status, setStatus] = useState<FetchStatus>("idle");

  useEffect(() => {
    fetchOperations();
  }, []);

  const fetchOperations = async () => {
    setStatus("fetching");
    try {
      const operations = await operationClient.getOperations({
        organizationId: "1",
      });

      setOperations(operations);
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

  function addOperation(operation: Operation) {
    setOperations((operations) => [...operations, operation]);
  }

  function removeOperation(operationId: string) {
    setOperations((operations) =>
      operations.filter((operation) => operation.id !== operationId)
    );
  }

  return (
    <OperationsContext.Provider
      value={{
        operations,
        status,
        fetchOperations,
        addOperation,
        removeOperation,
      }}
    >
      {children}
    </OperationsContext.Provider>
  );
}

export function useOperations() {
  const context = useContext(OperationsContext);
  if (context == null) {
    throw new Error(
      "useOperations doit être utilisé dans un composant enfant de OperationsProvider"
    );
  }
  return context;
}
