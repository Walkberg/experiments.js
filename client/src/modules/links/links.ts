export interface Link {
  fromId: string;
  toId: string;
}

export interface LinkFiltering {
  fromId?: string;
  toId?: string;
}

export interface LinkApi {
  getLinks(filtering: LinkFiltering): Promise<Link[]>;
}
