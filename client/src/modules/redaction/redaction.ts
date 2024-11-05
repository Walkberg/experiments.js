export interface OperationConfig {
  availableLinks: LinkConfig[];
}

export interface LinkConfig {
  id: string;
  type: string;
  acceptedTemplateIds: string[];
  creation: BranchConfigCreation;
}

export interface BranchConfigCreation {
  maxRecordCount: number;
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

export const fakeRedaction: OperationConfig = {
  availableLinks: [vendeurConfig, acquereurConfig, bienConfig],
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
