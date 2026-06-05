'use client'

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCart } from "@/hooks/useCart"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/config/site.config"

const checkoutSchema = z.object({
  full_name: z.string().min(2, "Ingresá tu nombre"),
  phone: z.string().min(8, "Teléfono inválido"),
  street: z.string().min(3, "Ingresá la calle y número"),
  city: z.string().min(2, "Ingresá la ciudad"),
  province: z.string().min(2, "Ingresá la provincia"),
  zip_code: z.string().min(4, "Ingresá el código postal"),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: siteConfig.currency,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total } = useCart()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
  })

  useEffect(() => {
    if (items.length === 0) {
      router.push("/carrito")
    }
  }, [items.length, router])

  if (items.length === 0) return null

  async function onSubmit(data: CheckoutForm) {
    setLoading(true)

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items, shippingAddress: data }),
    })

    const json = await res.json()

    if (!res.ok) {
      toast.error(json.error ?? "Error al procesar el pedido")
      setLoading(false)
      return
    }

    window.location.assign(json.url)
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <h2 className="font-semibold text-lg">Datos de envío</h2>

          <div className="space-y-1">
            <Label>Nombre completo</Label>
            <Input {...register("full_name")} />
            {errors.full_name && <p className="text-red-500 text-xs">{errors.full_name.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Teléfono</Label>
            <Input {...register("phone")} />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
          </div>

          <div className="space-y-1">
            <Label>Calle y número</Label>
            <Input {...register("street")} />
            {errors.street && <p className="text-red-500 text-xs">{errors.street.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label>Ciudad</Label>
              <Input {...register("city")} />
              {errors.city && <p className="text-red-500 text-xs">{errors.city.message}</p>}
            </div>
            <div className="space-y-1">
              <Label>Provincia</Label>
              <Input {...register("province")} />
              {errors.province && <p className="text-red-500 text-xs">{errors.province.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Código postal</Label>
            <Input {...register("zip_code")} />
            {errors.zip_code && <p className="text-red-500 text-xs">{errors.zip_code.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Procesando..." : "Pagar con MercadoPago"}
          </Button>
        </form>

        <div>
          <h2 className="font-semibold text-lg mb-4">Resumen</h2>
          <div className="border rounded-lg p-4 space-y-3">
            {items.map((item) => (
              <div key={item.product.id} className="flex justify-between text-sm">
                <span>{item.product.name} x{item.quantity}</span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
            <div className="border-t pt-3 flex justify-between font-bold">
              <span>Total</span>
              <span>{formatPrice(total())}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
