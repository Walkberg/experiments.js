import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { Notification, NotificationUpdate } from "../notifications"; // Assurez-vous d'importer correctement vos types
import { useNotificationClient } from "./NotificationClientProvider";

type NotificationStatus = "fetching" | "init" | "succeed" | "error";

interface NotificationContextState {
  status: NotificationStatus;
  notifications: Notification[];
  updateNotification: (update: NotificationUpdate) => void;
}

const NotificationContext = createContext<NotificationContextState | null>(
  null
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const [status, setStatus] = useState<NotificationStatus>("init");
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const client = useNotificationClient();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setStatus("fetching");
        const filtering = {
          userId: "user-1",
          page: { page: 1, itemByPage: 20 },
        };
        const page = await client.getNotifications(filtering);
        console.log(page);
        setNotifications(page.items);
        setStatus("succeed");
      } catch (e) {
        setStatus("error");
      }
    };

    fetchNotifications();
  }, []);

  const updateNotification = async (update: NotificationUpdate) => {
    try {
      await client.updateNotification(update);

      const updatedNotifications = notifications?.map((notification) => {
        if (notification.id === update.id) {
          return {
            ...notification,
            viewed: update.viewed,
            archived: update.archive,
          };
        }
        return notification;
      });
      setNotifications(updatedNotifications);
    } catch (e) {
      // Gérez l'erreur de mise à jour ici si nécessaire
    }
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, status, updateNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (context == null) {
    throw new Error(
      "useNotifications doit être utilisé dans un composant enfant de NotificationProvider"
    );
  }

  return context;
}

export function useUpdateNotifications() {
  const context = useContext(NotificationContext);

  if (context == null) {
    throw new Error(
      "useNotifications doit être utilisé dans un composant enfant de NotificationProvider"
    );
  }

  return context.updateNotification;
}
