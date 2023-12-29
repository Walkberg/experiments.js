import { ReactNode, createContext, useContext, useState } from "react";
import { NotificationClient } from "../notifications";
import { FakeNotificationClient } from "../in-memory-notification.client";

interface NotificationContextState {
  notificationClient: NotificationClient;
}

const NotificationClientContext =
  createContext<NotificationContextState | null>(null);

interface NotificationClientProviderProps {
  children: ReactNode;
}

export const NotificationClientProvider = ({
  children,
}: NotificationClientProviderProps) => {
  //
  const [notificationClient, setNotificationClient] =useState<NotificationClient>(new FakeNotificationClient());

  return (
    <NotificationClientContext.Provider value={{ notificationClient }}>
      {children}
    </NotificationClientContext.Provider>
  );
};

// Hook pour utiliser le NotificationClient dans les composants enfants
export function useNotificationClient() {
  const context = useContext(NotificationClientContext);

  if (context == null) {
    throw new Error(
      "useNotificationClient doit être utilisé dans un composant enfant de NotificationClientProvider"
    );
  }

  return context.notificationClient;
}
