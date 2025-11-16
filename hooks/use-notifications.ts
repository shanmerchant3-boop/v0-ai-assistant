"use client"

import { useState, useCallback } from "react"
import type { Notification } from "@/components/notification-center"

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([])

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substr(2, 9)
    const notif: Notification = { ...notification, id }

    setNotifications((prev) => [...prev, notif])

    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id)
      }, notification.duration || 5000)
    }

    return id
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const success = useCallback(
    (title: string, message: string, duration?: number) => {
      return addNotification({ type: "success", title, message, duration })
    },
    [addNotification],
  )

  const error = useCallback(
    (title: string, message: string, duration?: number) => {
      return addNotification({ type: "error", title, message, duration })
    },
    [addNotification],
  )

  const info = useCallback(
    (title: string, message: string, duration?: number) => {
      return addNotification({ type: "info", title, message, duration })
    },
    [addNotification],
  )

  return {
    notifications,
    addNotification,
    removeNotification,
    success,
    error,
    info,
  }
}
