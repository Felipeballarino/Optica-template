import Image from "next/image"
import Link from "next/link"
import { Product } from "@/types"
import { siteConfig } from "@/config/site.config"
import AddToCartButton from "@/components/store/cart/AddToCartButton"

function formatPrice(price: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: siteConfig.currency,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/producto/${product.slug}`}>
      <div className="bg-white rounded-lg border hover:shadow-md transition-shadow overflow-hidden">
        <div className="relative aspect-square bg-gray-100">
          {product.images?.[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
              Sin imagen
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-black text-xs font-medium px-2 py-1 rounded">
                Sin stock
              </span>
            </div>
          )}
        </div>
        <div className="p-3">
          <p className="text-xs text-gray-500">{product.category}</p>
          <h3 className="font-medium text-sm mt-0.5 line-clamp-2">{product.name}</h3>
          <div className="flex items-center justify-between mt-1">
            <p className="font-bold">{formatPrice(product.price)}</p>
            <AddToCartButton product={product} variant="icon" />
          </div>
        </div>
      </div>
    </Link>
  )
}
