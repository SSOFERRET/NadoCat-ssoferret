import { create } from "zustand";

interface INotificationStore {
  hasNewNotification: boolean,
  setHasNewNotification: (hasNewNotification: boolean) => void
}

const notificationStore = create<INotificationStore>((set) => ({
  hasNewNotification: false,
  setHasNewNotification: (hasNewNotification: boolean) => {
    set(() => ({
      hasNewNotification
    }))
  }
}))

export default notificationStore;

