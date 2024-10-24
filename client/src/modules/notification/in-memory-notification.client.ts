import {
  NotificationClient,
  Notification,
  NotificationFiltering,
  NotificationUpdate,
  Page,
} from "./notifications";

const initialNotifications = [
  {
    id: "1",
    creatorId: "user-1",
    userId: "user-1",
    name: "Notification 1",
    type: "info",
    description: "Description de la notification 1",
    viewed: false,
    creationDate: new Date(),
    archived: false,
  },
  {
    id: "2",
    creatorId: "user-2",
    userId: "user-1",
    name: "Notification 2",
    type: "alert",
    description: "Description de la notification 2",
    viewed: true,
    creationDate: new Date(),
    archived: true,
  },
  {
    id: "3",
    creatorId: "user-1",
    userId: "user-1",
    name: "Notification 1",
    type: "info",
    description: "Description de la notification 1",
    viewed: false,
    creationDate: new Date(),
    archived: false,
  },
];

export class FakeNotificationClient implements NotificationClient {
  private notifications: Notification[] = initialNotifications;

  async getNotifications(
    filtering: NotificationFiltering
  ): Promise<Page<Notification>> {
    let filteredNotifications = this.notifications.filter((notification) => {
      let matchesFilter = true;
      if (filtering.userId && notification.userId !== filtering.userId) {
        matchesFilter = false;
      }
      if (
        filtering.viewed !== undefined &&
        notification.viewed !== filtering.viewed
      ) {
        matchesFilter = false;
      }
      if (filtering.archived !== undefined) {
        matchesFilter = false;
      }
      return matchesFilter;
    });

    const page = filtering.page.page || 1;
    const pageSize = 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginatedNotifications = filteredNotifications.slice(start, end);

    return {
      items: paginatedNotifications,
      pagination: {
        page,
        count: filteredNotifications.length,
      },
    };
  }

  async updateNotification(update: NotificationUpdate): Promise<void> {
    const notificationToUpdate = this.notifications.find(
      (notification) => notification.id === update.id
    );
    if (notificationToUpdate) {
      notificationToUpdate.viewed = update.viewed;
      // Gérer l'archivage de la notification si nécessaire
    } else {
      throw new Error("Notification non trouvée");
    }
  }
}
