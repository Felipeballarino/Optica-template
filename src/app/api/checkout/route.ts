import { createClient } from "@/lib/supabase/server"
import { mp } from "@/lib/mercadopago"
import { Preference } from "mercadopago"
import { NextResponse } from "next/server"
import { CartItem } from "@/types"

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 })
  }

  const { items, shippingAddress } = await request.json() as {
    items: CartItem[]
    shippingAddress: {
      full_name: string
      phone: string
      street: string
      city: string
      province: string
      zip_code: string
    }
  }

  if (!items?.length) {
    return NextResponse.json({ error: "Carrito vacío" }, { status: 400 })
  }

  const total = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity, 0
  )

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: user.id,
      status: "pending",
      total,
      shipping_address: shippingAddress,
    })
    .select()
    .single()

  if (orderError || !order) {
    return NextResponse.json({ error: "Error creando pedido" }, { status: 500 })
  }

  await supabase.from("order_items").insert(
    items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.product.price,
      product_snapshot: item.product,
    }))
  )

  const preference = new Preference(mp)
  const result = await preference.create({
    body: {
      items: items.map((item) => ({
        id: item.product.id,
        title: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
        currency_id: "ARS",
      })),
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/exito?order_id=${order.id}`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/error?order_id=${order.id}`,
        pending: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/exito?order_id=${order.id}`,
      },
      external_reference: order.id,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
    },
  })

  await supabase
    .from("orders")
    .update({ mp_preference_id: result.id })
    .eq("id", order.id)

  return NextResponse.json({ url: result.init_point })
}
