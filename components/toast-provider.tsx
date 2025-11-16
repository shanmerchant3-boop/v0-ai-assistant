"use client"

import { Toaster } from "react-hot-toast"

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "#2d3142",
          color: "#e8e9f3",
          border: "1px solid #3d3f4d",
        },
        success: {
          iconTheme: {
            primary: "#7d5fff",
            secondary: "#e8e9f3",
          },
        },
        error: {
          iconTheme: {
            primary: "#ff4ad6",
            secondary: "#e8e9f3",
          },
        },
      }}
    />
  )
}
