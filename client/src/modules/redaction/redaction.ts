export interface ContractConfig {
  id: string;
  type: string;
  availableLinks: LinkConfig[];
}

export interface ContractConfigNew {
  id: string;
  type: string;
}

export interface ContractConfigUpdate {
  id: string;
  type: string;
}

export interface LinkConfig {
  id: string;
  type: string;
  acceptedTemplateIds: string[];
  creation: BranchConfigCreation;
}

export interface BranchConfigCreation {
  maxRecordCount?: number;
  isAutoCreate?: boolean;
}

export const vendeurConfig: LinkConfig = {
  id: "branch-vendeur",
  type: "vendeur",
  acceptedTemplateIds: [],
  creation: { maxRecordCount: 3 },
};

const acquereurConfig: LinkConfig = {
  id: "branch-acquereur",
  type: "acquereur",
  acceptedTemplateIds: [],
  creation: { maxRecordCount: 3 },
};

const bienConfig: LinkConfig = {
  id: "branch-bien",
  type: "bien",
  acceptedTemplateIds: [],
  creation: { maxRecordCount: 3 },
};

const autreConfig: LinkConfig = {
  id: "branch-autre",
  type: "autre",
  acceptedTemplateIds: [],
  creation: { isAutoCreate: true },
};

export const fakeConfig: ContractConfig = {
  id: "vente-ancien",
  type: "vente-ancien",
  availableLinks: [vendeurConfig, acquereurConfig, bienConfig, autreConfig],
};

export interface OperationLink {
  id: string;
  type: string; // templateId;
  operationId: string;
  recordId: string;
}

export const fakeOperationLinks: OperationLink[] = [
  {
    id: "operation-1",
    type: "acquereur",
    operationId: "operation-1",
    recordId: "record-1",
  },
  {
    id: "operation-2",
    type: "acquereur",
    operationId: "operation-1",
    recordId: "record-2",
  },
  {
    id: "operation-3",
    type: "vendeur",
    operationId: "operation-1",
    recordId: "record-3",
  },
];
