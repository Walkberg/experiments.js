import { delay } from "@/utils/delay";
import {
  RecordApi,
  RecordFiltering,
  RecordLink,
  RecordNew,
  Recorde,
  createRandomRecord,
  createRandomRecords,
} from "./record";

export class RecordApiImpl implements RecordApi {
  async createRecord(recordNew: RecordNew): Promise<Recorde> {
    await delay(1000);
    return createRandomRecord();
  }

  async getRecords(filtering: RecordFiltering): Promise<Recorde[]> {
    await delay(300);
    return createRandomRecords();
  }

  async getRecord(recordId: string): Promise<Recorde> {
    await delay(200);
    return createRandomRecord();
  }

 
}


