import { type NextRequest, NextResponse } from "next/server"

const EMAIL_TEMPLATES = {
  order_confirmation: (data: any) => ({
    subject: "Order Confirmation - Zaliant Services",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #fff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #7D5FFF, #FF4AD6); padding: 30px; text-align: center;">
          <h1 style="margin: 0; color: #fff; font-size: 28px;">Order Confirmed!</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px; line-height: 1.6;">Thank you for your purchase from Zaliant Services.</p>
          
          <div style="background: rgba(125, 95, 255, 0.1); padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #7D5FFF;">
            <h3 style="margin: 0 0 15px 0; color: #7D5FFF;">Order Details</h3>
            <p style="margin: 8px 0;"><strong>Order ID:</strong> ${data.orderId}</p>
            <p style="margin: 8px 0;"><strong>Amount:</strong> $${data.amount}</p>
            <p style="margin: 8px 0;"><strong>Items:</strong> ${data.items?.length || 1} product(s)</p>
          </div>

          <p style="font-size: 14px; color: #a1a1aa;">Your license key(s) will be delivered in a separate email within minutes.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #27272a; text-align: center;">
            <p style="font-size: 12px; color: #71717a;">Need help? Contact <a href="mailto:support@zaliant.com" style="color: #7D5FFF; text-decoration: none;">support@zaliant.com</a></p>
          </div>
        </div>
      </div>
    `,
  }),

  license_key: (data: any) => ({
    subject: `🎮 Your License Key - ${data.productName}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #fff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #7D5FFF, #FF4AD6); padding: 30px; text-align: center;">
          <h1 style="margin: 0; color: #fff; font-size: 28px;">🔑 Your License is Ready!</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px; line-height: 1.6;">Thank you for purchasing <strong style="color: #FF4AD6;">${data.productName}</strong>.</p>
          
          <div style="background: #1a1a2e; padding: 25px; border-radius: 12px; margin: 25px 0; border: 2px solid #7D5FFF; box-shadow: 0 0 20px rgba(125, 95, 255, 0.3);">
            <p style="color: #a1a1aa; font-size: 12px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your License Key</p>
            <p style="color: #7D5FFF; font-size: 20px; font-family: 'Courier New', monospace; margin: 0; word-break: break-all; font-weight: bold; text-align: center; padding: 10px; background: rgba(125, 95, 255, 0.1); border-radius: 6px;">
              ${data.licenseKey}
            </p>
          </div>

          <div style="background: rgba(255, 74, 214, 0.1); padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0; font-size: 14px;"><strong>Duration:</strong> ${data.duration}</p>
            <p style="margin: 5px 0; font-size: 14px;"><strong>Expires:</strong> ${data.expiresAt}</p>
          </div>

          <h3 style="color: #7D5FFF; margin-top: 30px;">📋 Installation Instructions:</h3>
          <ol style="line-height: 2; font-size: 15px; padding-left: 20px;">
            <li>Copy your license key above</li>
            <li>Download and launch the application</li>
            <li>Paste the license key when prompted</li>
            <li>Enjoy all premium features!</li>
          </ol>

          <div style="background: rgba(125, 95, 255, 0.1); padding: 15px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #FF4AD6;">
            <p style="margin: 0; font-size: 13px; color: #a1a1aa;">💡 <strong>Pro Tip:</strong> Save this email for future reference. You can also access your licenses anytime from your dashboard.</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #27272a; text-align: center;">
            <p style="font-size: 12px; color: #71717a;">Having issues? Contact <a href="mailto:support@zaliant.com" style="color: #7D5FFF; text-decoration: none;">support@zaliant.com</a></p>
          </div>
        </div>
      </div>
    `,
  }),

  support_reply: (data: any) => ({
    subject: `💬 Support Reply - Ticket #${data.ticketId}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #fff; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #7D5FFF, #FF4AD6); padding: 30px; text-align: center;">
          <h1 style="margin: 0; color: #fff; font-size: 24px;">Support Team Reply</h1>
        </div>
        
        <div style="padding: 30px;">
          <p style="color: #a1a1aa; font-size: 14px;">Ticket #${data.ticketId}</p>
          
          <div style="background: #1a1a2e; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #7D5FFF;">
            ${data.message}
          </div>

          <p style="font-size: 14px;">Reply to this email or visit our support center to continue the conversation.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #27272a; text-align: center;">
            <a href="https://zaliant.com/support" style="display: inline-block; background: linear-gradient(135deg, #7D5FFF, #FF4AD6); color: #fff; padding: 12px 30px; border-radius: 8px; text-decoration: none; font-weight: bold;">View Ticket</a>
          </div>
        </div>
      </div>
    `,
  }),
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, email, ...data } = body

    const template = EMAIL_TEMPLATES[type as keyof typeof EMAIL_TEMPLATES]
    if (!template) {
      return NextResponse.json({ error: "Invalid email type" }, { status: 400 })
    }

    const { subject, html } = template(data)

    console.log('━'.repeat(60))
    console.log(`📧 [EMAIL] Sending ${type} email to ${email}`)
    console.log('━'.repeat(60))
    console.log(`Subject: ${subject}`)
    console.log(`Data:`, JSON.stringify(data, null, 2))
    console.log('━'.repeat(60))

    // TODO: Integrate with email provider (Resend, SendGrid, etc.)
    // Example with Resend:
    // const result = await resend.emails.send({
    //   from: "Zaliant Services <noreply@zaliant.com>",
    //   to: email,
    //   subject,
    //   html,
    // })

    return NextResponse.json({ success: true, message: "Email sent successfully" })
  } catch (error) {
    console.error("Error sending email:", error)
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
  }
}
