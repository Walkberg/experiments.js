import { delay } from "@/utils/delay";
import { Link, LinkApi, LinkFiltering } from "./links";
import { getRandomInt } from "@/utils/random";

export class LinkApiImpl implements LinkApi {
  async getLinks(filtering: LinkFiltering): Promise<Link[]> {
    await delay(200);
    return createRecordLinks();
  }
}

export function createRecordLinks(): Link[] {
  const count = getRandomInt(4);

  return Array.from(Array(count).keys()).map(createRecordLink);
}

export function createRecordLink(): Link {
  return {
    fromId: "personne-physique",
    toId: "personne-physique",
  };
}
