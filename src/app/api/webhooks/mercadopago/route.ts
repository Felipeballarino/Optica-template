import { createClient } from "@/lib/supabase/server"
import { mp } from "@/lib/mercadopago"
import { Payment } from "mercadopago"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const body = await request.json()

  if (body.type !== "payment") {
    return NextResponse.json({ received: true })
  }

  const paymentId = body.data?.id
  if (!paymentId) {
    return NextResponse.json({ received: true })
  }

  try {
    const payment = new Payment(mp)
    const paymentData = await payment.get({ id: paymentId })

    const orderId = paymentData.external_reference
    const status = paymentData.status

    if (!orderId) {
      return NextResponse.json({ received: true })
    }

    const supabase = await createClient()

    if (status === "approved") {
      const { data: order } = await supabase
        .from("orders")
        .select("*, order_items(product_id, quantity)")
        .eq("id", orderId)
        .single()

      if (order) {
        await supabase
          .from("orders")
          .update({
            status: "paid",
            mp_payment_id: String(paymentId),
          })
          .eq("id", orderId)

        for (const item of order.order_items) {
          await supabase.rpc("decrement_stock", {
            p_product_id: item.product_id,
            p_quantity: item.quantity,
          })
        }
      }
    } else if (status === "rejected" || status === "cancelled") {
      await supabase
        .from("orders")
        .update({ status: "cancelled" })
        .eq("id", orderId)
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ error: "Error procesando webhook" }, { status: 500 })
  }
}
