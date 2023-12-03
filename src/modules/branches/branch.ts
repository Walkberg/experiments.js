import { getRandomInt } from "@/utils/random";

export interface Branch {
  id: string;
  name: string;
  recordIds: string[];
  config: BranchConfig;
}

export interface ShortBranch {
  id: string;
  name: string;
  recordIds: string[];
  configId: string;
}

interface BranchConfig {
  id: string;
  type: string;
  acceptedTemplateIds: string[];
  creation: BranchConfigCreation;
}

interface BranchConfigCreation {
  maxRecordCount: number;
}

export function createBranch(): Branch {
  return {
    id: "test",
    name: "Vendeur",
    recordIds: ["record-1", "record-1"],
    config: vendeurConfig,
  };
}

export function createApiBranches(): ShortBranch[] {
  const count = getRandomInt(10);
  return Array.from(Array(count).keys()).map(createApiBranch);
}

export function createApiBranch(): ShortBranch {
  return {
    id: "test",
    name: "Vendeur",
    recordIds: ["record-fdsfds", "record-1"],
    configId: "config-1",
  };
}

export interface RecordBranchNew {
  recordId: string;
  branchId: string;
}

export interface BranchesFiltering {
  operationId: string;
}

export interface BranchApi {
  getBranches: (filtering: BranchesFiltering) => Promise<ShortBranch[]>;

  createBranchRecord: (branchRecordNew: RecordBranchNew) => Promise<void>;
}

export const vendeurConfig: BranchConfig = {
  id: "branch-vendeur",
  type: "vendeur",
  acceptedTemplateIds: [],
  creation: { maxRecordCount: 3 },
}

const acquereurConfig: BranchConfig = {
  id: "branch-acquereur",
  type: "acquereur",
  acceptedTemplateIds: [],
  creation: { maxRecordCount: 3 },
}

const bienConfig: BranchConfig = {
  id: "branch-bien",
  type: "bien",
  acceptedTemplateIds: [],
  creation: { maxRecordCount: 3 },
}
