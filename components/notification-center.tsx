"use client"
import { motion, AnimatePresence } from "framer-motion"
import { X, CheckCircle, AlertCircle, InfoIcon } from "lucide-react"

export interface Notification {
  id: string
  type: "success" | "error" | "info"
  title: string
  message: string
  duration?: number
}

interface NotificationCenterProps {
  notifications: Notification[]
  onDismiss: (id: string) => void
}

export function NotificationCenter({ notifications, onDismiss }: NotificationCenterProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-3 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 10, x: 100 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -10, x: 100 }}
            className="pointer-events-auto"
          >
            <div
              className={`flex items-start gap-3 p-4 rounded-lg border backdrop-blur-sm ${
                notification.type === "success"
                  ? "bg-green-500/10 border-green-500/30 text-green-100"
                  : notification.type === "error"
                    ? "bg-red-500/10 border-red-500/30 text-red-100"
                    : "bg-primary/10 border-primary/30 text-primary"
              }`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {notification.type === "success" && <CheckCircle className="w-5 h-5" />}
                {notification.type === "error" && <AlertCircle className="w-5 h-5" />}
                {notification.type === "info" && <InfoIcon className="w-5 h-5" />}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-sm">{notification.title}</h3>
                <p className="text-xs opacity-90 mt-1">{notification.message}</p>
              </div>

              <button
                onClick={() => onDismiss(notification.id)}
                className="flex-shrink-0 opacity-70 hover:opacity-100 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
