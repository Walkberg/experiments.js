import { db } from "../local-db/db";
import { v4 as uuidv4 } from "uuid";
import { Recorde, RecordApi, RecordFiltering, RecordNew } from "./record";
import { RecordDb } from "../local-db/db.type";

export class DbRecordClient implements RecordApi {
  async getRecords(filtering: RecordFiltering): Promise<Recorde[]> {
    let records = await db.records.toArray();

    if (filtering.search) {
      const lowerSearch = filtering.search.toLowerCase();
      records = records.filter((record) =>
        record.type.toLowerCase().includes(lowerSearch)
      );
    }

    return records.map(convertRecordDbToRecorde);
  }

  async createRecord(recordNew: RecordNew): Promise<Recorde> {
    const now = new Date().toISOString();

    const recordDb: RecordDb = {
      ...recordNew,
      id: uuidv4(),
      creationDate: now,
      lastUpdateDate: now,
    };

    await db.records.add(recordDb);

    return convertRecordDbToRecorde(recordDb);
  }
}

function convertRecordDbToRecorde(recordDb: RecordDb): Recorde {
  return {
    ...recordDb,
  };
}
