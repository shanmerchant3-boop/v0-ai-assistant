import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: "Contact form submitted successfully",
      data: { name, email, subject, message, timestamp: new Date() },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Contact submission failed" }, { status: 500 })
  }
}
