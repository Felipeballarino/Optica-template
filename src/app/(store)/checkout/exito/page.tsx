'use client'

import Link from "next/link"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useCart } from "@/hooks/useCart"

export default function ExitoPage() {
  const searchParams = useSearchParams()
  const order_id = searchParams.get("order_id")
  const { clearCart } = useCart()

  useEffect(() => {
    clearCart()
  }, [clearCart])

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">✓</div>
      <h1 className="text-2xl font-bold mb-2">¡Pago exitoso!</h1>
      <p className="text-gray-500 mb-2">Tu pedido fue confirmado.</p>
      {order_id && (
        <p className="text-xs text-gray-400 mb-6">Pedido #{order_id}</p>
      )}
      <div className="space-y-3">
        <Link
          href="/cliente/mis-pedidos"
          className="block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Ver mis pedidos
        </Link>
        <Link
          href="/catalogo"
          className="block text-sm text-gray-500 hover:underline"
        >
          Seguir comprando
        </Link>
      </div>
    </div>
  )
}
