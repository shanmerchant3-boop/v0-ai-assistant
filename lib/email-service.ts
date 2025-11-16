export interface EmailTemplate {
  type: "order_confirmation" | "license_key" | "support_reply" | "welcome" | "password_reset" | "abandoned_cart"
  recipientEmail: string
  data: Record<string, any>
}

export async function sendOrderConfirmation(orderId: string, userEmail: string) {
  try {
    // Call email API (Resend, SendGrid, etc.)
    const response = await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "order_confirmation",
        email: userEmail,
        orderId,
      }),
    })

    if (!response.ok) throw new Error("Failed to send email")

    return { success: true }
  } catch (error) {
    console.error("Error sending confirmation email:", error)
    return { success: false, error }
  }
}

export async function sendLicenseKey(userEmail: string, licenseKey: string, productName: string) {
  try {
    const response = await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "license_key",
        email: userEmail,
        licenseKey,
        productName,
      }),
    })

    if (!response.ok) throw new Error("Failed to send license key")

    return { success: true }
  } catch (error) {
    console.error("Error sending license key email:", error)
    return { success: false, error }
  }
}

export async function sendSupportReply(userEmail: string, ticketId: string, message: string) {
  try {
    const response = await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "support_reply",
        email: userEmail,
        ticketId,
        message,
      }),
    })

    if (!response.ok) throw new Error("Failed to send support reply")

    return { success: true }
  } catch (error) {
    console.error("Error sending support reply email:", error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(userEmail: string, userName: string) {
  try {
    const response = await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "welcome",
        email: userEmail,
        userName,
      }),
    })

    if (!response.ok) throw new Error("Failed to send welcome email")

    return { success: true }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return { success: false, error }
  }
}

export async function sendPasswordResetEmail(userEmail: string, resetLink: string) {
  try {
    const response = await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "password_reset",
        email: userEmail,
        resetLink,
      }),
    })

    if (!response.ok) throw new Error("Failed to send password reset email")

    return { success: true }
  } catch (error) {
    console.error("Error sending password reset email:", error)
    return { success: false, error }
  }
}

export async function sendAbandonedCartEmail(userEmail: string, cartItems: any[]) {
  try {
    const response = await fetch("/api/email/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "abandoned_cart",
        email: userEmail,
        cartItems,
      }),
    })

    if (!response.ok) throw new Error("Failed to send abandoned cart email")

    return { success: true }
  } catch (error) {
    console.error("Error sending abandoned cart email:", error)
    return { success: false, error }
  }
}
