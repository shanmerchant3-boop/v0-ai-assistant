"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { NotificationCenter, type Notification } from "@/components/notification-center"

interface NotificationContextType {
  addNotification: (notification: Omit<Notification, "id">) => string
  removeNotification: (id: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = (notification: Omit<Notification, "id">): string => {
    const id = Math.random().toString(36).substr(2, 9)
    const notif: Notification = { ...notification, id }

    setNotifications((prev) => [...prev, notif])

    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 5000)
    }

    return id
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <NotificationContext.Provider value={{ addNotification, removeNotification }}>
      {children}
      <NotificationCenter notifications={notifications} onDismiss={removeNotification} />
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider")
  }
  return context
}
