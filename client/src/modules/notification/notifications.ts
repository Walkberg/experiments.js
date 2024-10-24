export interface Notification {
  id: string;
  creatorId: string;
  userId: string;
  name: string;
  type: string;
  description: string;
  viewed: boolean;
  creationDate: Date;
  archived: boolean;
}

export interface NotificationFiltering {
  userId: string;
  archived?: boolean;
  viewed?: boolean;
  page: P;
}

export interface P {
  page: number;
  itemByPage: number;
}

export interface NotificationUpdate {
  id: string;
  viewed: boolean;
  archive: boolean;
}

export interface Page<T> {
  items: T[];
  pagination: Pagination;
}

export interface Pagination {
  page: number;
  count: number;
}

export interface NotificationClient {
  getNotifications: (
    filtering: NotificationFiltering
  ) => Promise<Page<Notification>>;
  updateNotification: (update: NotificationUpdate) => Promise<void>;
}
