import {
  BranchConfigCreation,
  LinkConfig,
  ContractConfig,
  ContractConfigNew,
} from "@/modules/redaction/redaction";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { FakeOperationConfigClient } from "../in-memory-operation-configs.client";
import { OperationConfigsClient } from "../operation";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import { Card } from "@/components/ui/card";

export function ConfigManager() {
  const navigate = useNavigate();

  const {
    configs,
    status,
    forceRefresh,
    addLinkToConfig,
    removeLinkFromConfig,
  } = useContractConfigs();
  const { createConfig } = useOperationConfigCreation();

  const [newConfig, setNewConfig] = useState<LinkConfig>({
    id: "",
    type: "",
    acceptedTemplateIds: [],
    creation: {},
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof LinkConfig
  ) => {
    setNewConfig({ ...newConfig, [field]: e.target.value });
  };

  const handleCreationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof BranchConfigCreation
  ) => {
    setNewConfig({
      ...newConfig,
      creation: {
        ...newConfig.creation,
        [field]:
          e.target.type === "checkbox"
            ? e.target.checked
            : Number(e.target.value),
      },
    });
  };

  const addConfig = () => {
    if (newConfig.id && newConfig.type) {
      createConfig(newConfig, async () => forceRefresh());
      setNewConfig({ id: "", type: "", acceptedTemplateIds: [], creation: {} });
    }
  };

  const updateConfig = (index: number, updatedConfig: LinkConfig) => {
    const updatedConfigs = [...configs];
    //updatedConfigs[index] = updatedConfig;
    //setConfigs(updatedConfigs);
  };

  return (
    <div className="p-4">
      <Button onClick={() => navigate("../operation/1/contracts")}>
        Go to Redaction
      </Button>
      <h2 className="text-xl font-bold mb-4">Gérer les Configurations</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="ID"
          value={newConfig.id}
          onChange={(e) => handleChange(e, "id")}
          className="border p-2 mr-2"
        />
        <input
          type="text"
          placeholder="Type"
          value={newConfig.type}
          onChange={(e) => handleChange(e, "type")}
          className="border p-2 mr-2"
        />

        <button onClick={addConfig} className="ml-4 bg-blue-500 text-white p-2">
          Ajouter
        </button>
      </div>
      <ul>
        {configs.map((config, index) => (
          <li key={config.id} className="border p-2 mb-2">
            <strong>{config.id}</strong> ({config.type})
            <Card>
              <ManageLinkConfig
                configId={config.id}
                links={config.availableLinks}
                addLinkToConfig={addLinkToConfig}
                removeLinkFromConfig={removeLinkFromConfig}
              />
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ManageLinkConfigProps {
  configId: string;
  links: LinkConfig[];
  addLinkToConfig: (configId: string, newLink: LinkConfig) => Promise<void>;
  removeLinkFromConfig: (configId: string, linkId: string) => Promise<void>;
}

export function ManageLinkConfig({
  configId,
  links,
  addLinkToConfig,
  removeLinkFromConfig,
}: ManageLinkConfigProps) {
  const [newLink, setNewLink] = useState<LinkConfig>({
    id: "",
    type: "",
    acceptedTemplateIds: [],
    creation: {},
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof LinkConfig
  ) => {
    setNewLink({ ...newLink, [field]: e.target.value });
  };

  const handleCreationChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof BranchConfigCreation
  ) => {
    setNewLink({
      ...newLink,
      creation: {
        ...newLink.creation,
        [field]:
          e.target.type === "checkbox"
            ? e.target.checked
            : Number(e.target.value),
      },
    });
  };

  const addLink = async () => {
    if (newLink.id && newLink.type) {
      await addLinkToConfig(configId, newLink);
      setNewLink({ id: "", type: "", acceptedTemplateIds: [], creation: {} });
    }
  };

  const removeLink = async (linkId: string) => {
    await removeLinkFromConfig(configId, linkId);
  };

  return (
    <div>
      <h3>Gérer les liens</h3>
      <input
        type="text"
        placeholder="ID"
        value={newLink.id}
        onChange={(e) => handleChange(e, "id")}
        className="border p-2 mr-2"
      />
      <input
        type="text"
        placeholder="Type"
        value={newLink.type}
        onChange={(e) => handleChange(e, "type")}
        className="border p-2 mr-2"
      />
      <input
        type="number"
        placeholder="Max Record Count"
        value={newLink.creation.maxRecordCount || ""}
        onChange={(e) => handleCreationChange(e, "maxRecordCount")}
        className="border p-2 mr-2"
      />
      <label>
        Auto Create:
        <input
          type="checkbox"
          checked={newLink.creation.isAutoCreate || false}
          onChange={(e) => handleCreationChange(e, "isAutoCreate")}
          className="ml-2"
        />
      </label>
      <Button onClick={addLink} className="ml-4 bg-blue-500 text-white p-2">
        Ajouter un lien
      </Button>
      <ul>
        {links.map((link) => (
          <li key={link.id} className="border p-2 mb-2">
            <strong>{link.id}</strong> ({link.type})
            <Button
              onClick={() => removeLink(link.id)}
              className="ml-2 bg-red-500 text-white p-1"
            >
              Supprimer
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Status = "idle" | "fetching" | "error" | "success";

export function useContractConfigs() {
  const [configs, setConfigs] = useState<ContractConfig[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [refresh, setRefresh] = useState(false);

  const client = useOperationConfigClient();

  useEffect(() => {
    const fetchConfigs = async () => {
      try {
        setStatus("fetching");
        const data = await client.getOperationConfigs();
        setConfigs(data);
        setStatus("success");
      } catch (err) {
        setStatus("error");
      }
    };

    fetchConfigs();
  }, [refresh, client]);

  const addLinkToConfig = async (configId: string, newLink: LinkConfig) => {
    try {
      setStatus("fetching");
      await client.addLinkConfig(configId, newLink);
      setStatus("success");
      setRefresh((prev) => !prev);
    } catch (err) {
      setStatus("error");
    }
  };

  const removeLinkFromConfig = async (configId: string, linkId: string) => {
    try {
      setStatus("fetching");
      await client.removeLinkConfig(configId, linkId);
      setStatus("success");
      setRefresh((prev) => !prev);
    } catch (err) {
      setStatus("error");
    }
  };

  const forceRefresh = useCallback(() => setRefresh((prev) => !prev), []);

  return {
    configs,
    status,
    forceRefresh,
    addLinkToConfig,
    removeLinkFromConfig,
  };
}

const ContractConfigClientContext = createContext<
  OperationConfigsClient | undefined
>(undefined);

export const ContractConfigClientProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [client, setClient] = useState<OperationConfigsClient>(
    new FakeOperationConfigClient()
  );

  return (
    <ContractConfigClientContext.Provider value={client}>
      {children}
    </ContractConfigClientContext.Provider>
  );
};

export function useOperationConfigCreation() {
  const [status, setStatus] = useState<Status>("idle");
  const client = useOperationConfigClient();

  const createConfig = async (
    newConfig: ContractConfigNew,
    onOprationConfigCreated: (operationConfig: ContractConfig) => Promise<void>
  ) => {
    try {
      setStatus("fetching");
      const operationConfig = await client.createOperationConfig(newConfig);
      onOprationConfigCreated(operationConfig);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  return { createConfig, status };
}

export const useOperationConfigClient = () => {
  const client = useContext(ContractConfigClientContext);

  if (!client) {
    throw new Error(
      "useOperationConfigClient doit être utilisé dans un OperationConfigClientProvider"
    );
  }

  return client;
};
