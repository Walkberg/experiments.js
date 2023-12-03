import { delay } from "@/utils/delay";
import { BranchApi, BranchesFiltering, RecordBranchNew, ShortBranch, createApiBranches } from "./branch";

export class BranchApiImpl implements BranchApi {
   async getBranches (filtering: BranchesFiltering) : Promise<ShortBranch[]> {
    await delay(1000);
    return createApiBranches();
   }

  
  async createBranchRecord(branchRecordNew: RecordBranchNew) {
    await delay(1000);
  }
}
