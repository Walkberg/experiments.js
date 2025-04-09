import {
  ChangeEvent,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useOperationClient } from "../providers/OperationClientProvider";
import { Operation, OperationFiltering, OperationNew } from "../operation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocation, useNavigate } from "react-router";
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
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Checkbox } from "@/components/ui/checkbox";
import { useSearchParams } from "react-router-dom";
import {
  OperationTypesProvider,
  useOperationTypes,
} from "../components/OperationTypes/OperationTypes";
import { useCurrentMember } from "../../members/pages/MembersPage";

export function OperationsPage() {
  return (
    <OperationTypesProvider>
      <OperationsProvider>
        <OperationsFilterProvider>
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
        </OperationsFilterProvider>
      </OperationsProvider>
    </OperationTypesProvider>
  );
}

function OperationFilter() {
  const [open, setOpen] = useState(false);

  const { operationTypes } = useOperationTypes();

  const { filter, updateTemplate } = useOperationFilter();

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger>
          <Button>type</Button>
        </PopoverTrigger>
        <PopoverContent>
          <Card>
            {operationTypes.map((option) => (
              <div>
                <label htmlFor={option.type}>{option.type}</label>
                <Checkbox
                  checked={filter.templateIds?.includes(option.type)}
                  onClick={() => updateTemplate([option.id])}
                />
              </div>
            ))}
          </Card>
        </PopoverContent>
      </Popover>
    </div>
  );
}

function OperationSearch() {
  const { updateSearch, filter } = useOperationFilter();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    updateSearch(e.target.value);
  };

  return (
    <Input
      placeholder="Rechercher un dossier"
      onChange={handleChange}
      value={filter.search}
    />
  );
}

export function OperationAdd() {
  const { userId, organizationId } = useCurrentMember();

  const [open, setOpen] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [type, setType] = useState<string>("");

  const canCreate = usePermission("operation", "create");
  const { createOperation, status } = useCreateOperation();
  const { addOperation } = useOperations();

  const { operationTypes } = useOperationTypes();

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

  const { fetchOperations, status } = useFetchOperations();

  const { operations, setOperations } = useOperations();
  const { filter } = useOperationFilter();

  useEffect(() => {
    fetchOperations(filter, {
      onOperationFetched: async (operations) => setOperations(operations),
    });
  }, [fetchOperations, setOperations, filter]);

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
      <div className=" grid grid-cols-[1fr_1fr_1fr_auto] gap-4 font-semibold px-2">
        <div>name</div>
        <div>type</div>
        <div>createur</div>
        <div>actions</div>
      </div>
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
    <Card
      onClick={onClick}
      className="grid grid-cols-[1fr_1fr_1fr_auto] gap-4 items-center p-2 cursor-pointer hover:bg-gray-50 transition"
    >
      <div>{operation.name}</div>
      <div>{operation.type}</div>
      <div>{operation.creatorId}</div>
      <OperationDelete operationId={operation.id} />
    </Card>
  );
}

type FetchStatus = "idle" | "fetching" | "success" | "error";

interface OperationFetchOptions {
  onOperationFetch?: () => Promise<void>;
  onOperationFetched?: (operations: Operation[]) => Promise<void>;
  onOperationFetchFailed?: () => Promise<void>;
}

export function useFetchOperations() {
  const operationClient = useOperationClient();
  const [status, setStatus] = useState<FetchStatus>("idle");

  const fetchOperations = useCallback(
    async (filter: OperationFiltering, options?: OperationFetchOptions) => {
      setStatus("fetching");
      try {
        options?.onOperationFetch?.();
        const operations = await operationClient.getOperations(filter);
        options?.onOperationFetched?.(operations);
        setStatus("success");
      } catch (error) {
        options?.onOperationFetchFailed?.();
        setStatus("error");
      }
    },
    [operationClient]
  );

  return {
    fetchOperations,
    status,
  };
}

interface OperationsFilterContextState {
  filter: OperationFiltering;
  updateSearch: (search?: string) => void;
  updateTemplate: (templateIds?: string[]) => void;
}

const OperationsFilter = createContext<OperationsFilterContextState | null>(
  null
);

export function OperationsFilterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { organizationId } = useCurrentMember();

  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState<OperationFiltering>({
    organizationId: organizationId,
    search: searchParams.get("search") || undefined,
    templateIds: searchParams.get("templateIds")?.split(",") || undefined,
  });

  const location = useLocation();

  const updateSearch = (search?: string) => {
    const next = new URLSearchParams(searchParams);
    if (search) {
      next.set("search", search);
    } else {
      next.delete("search");
    }
    setSearchParams(next);
  };

  const updateTemplate = (templateIds?: string[]) => {
    const next = new URLSearchParams(searchParams);
    if (templateIds && templateIds.length > 0) {
      next.set("templateIds", templateIds.join(","));
    } else {
      next.delete("templateIds");
    }
    setSearchParams(next);
  };

  useEffect(() => {
    const search = searchParams.get("search") || undefined;
    const templateIds =
      searchParams.get("templateIds")?.split(",") || undefined;

    setFilter({
      organizationId,
      search,
      templateIds,
    });
  }, [location.search]);

  return (
    <OperationsFilter.Provider value={{ filter, updateSearch, updateTemplate }}>
      {children}
    </OperationsFilter.Provider>
  );
}

export function useOperationFilter() {
  const context = useContext(OperationsFilter);
  if (context == null) {
    throw new Error(
      "useOperationFilter doit être utilisé dans un composant enfant de OperationsFilterProvider"
    );
  }
  return context;
}

interface OperationsContextState {
  operations: Operation[];
  setOperations: (operations: Operation[]) => void;
  addOperation: (operation: Operation) => void;
  removeOperation: (operationId: string) => void;
}

const OperationsContext = createContext<OperationsContextState | null>(null);

interface OperationProviderProps {
  children: React.ReactNode;
}

export function OperationsProvider({ children }: OperationProviderProps) {
  const [operations, setOperations] = useState<Operation[]>([]);

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
        addOperation,
        removeOperation,
        setOperations,
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
