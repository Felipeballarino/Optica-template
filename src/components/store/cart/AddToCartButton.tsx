'use client'

import { useCart } from "@/hooks/useCart"
import { Product } from "@/types"
import { toast } from "sonner"

type Props = {
  product: Product
  variant?: "full" | "icon"
}

export default function AddToCartButton({ product, variant = "full" }: Props) {
  const addItem = useCart((state) => state.addItem)

  function handleClick(e: React.MouseEvent) {
    e.preventDefault()
    addItem(product)
    toast.success(`${product.name} agregado al carrito`)
  }

  if (variant === "icon") {
    return (
      <button
        onClick={handleClick}
        disabled={product.stock === 0}
        className="bg-black text-white rounded-full w-8 h-8 flex items-center justify-center text-lg disabled:opacity-40 hover:bg-gray-800 transition-colors"
        title="Agregar al carrito"
      >
        +
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={product.stock === 0}
      className="w-full bg-black text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
    >
      {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
    </button>
  )
}
