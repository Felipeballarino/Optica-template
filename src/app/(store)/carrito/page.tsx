'use client'

import { useCart } from "@/hooks/useCart"
import Image from "next/image"
import Link from "next/link"
import { siteConfig } from "@/config/site.config"

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: siteConfig.currency,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function CarritoPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-gray-500 mb-4">Tu carrito está vacío</p>
        <Link
          href="/catalogo"
          className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Ver catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Tu carrito</h1>

      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div key={item.product.id} className="flex gap-4 border rounded-lg p-4">
            <div className="relative w-20 h-20 rounded bg-gray-100 shrink-0 overflow-hidden">
              {item.product.images?.[0] && (
                <Image
                  src={item.product.images[0]}
                  alt={item.product.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium">{item.product.name}</p>
              <p className="text-sm text-gray-500">{item.product.category}</p>
              <p className="font-bold mt-1">{formatPrice(item.product.price)}</p>

              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  className="w-7 h-7 rounded border flex items-center justify-center hover:bg-gray-100"
                >
                  −
                </button>
                <span className="w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  className="w-7 h-7 rounded border flex items-center justify-center hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex flex-col items-end justify-between">
              <button
                onClick={() => removeItem(item.product.id)}
                className="text-gray-400 hover:text-black"
              >
                ×
              </button>
              <p className="font-bold text-sm">
                {formatPrice(item.product.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4 space-y-4">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(total())}</span>
        </div>

        <Link
          href="/checkout"
          className="block w-full bg-black text-white text-center py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Ir al checkout
        </Link>

        <button
          onClick={clearCart}
          className="block w-full text-center text-sm text-gray-500 hover:underline"
        >
          Vaciar carrito
        </button>
      </div>
    </div>
  )
}
