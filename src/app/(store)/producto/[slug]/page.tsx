import { createClient } from "@/lib/supabase/server"
import Image from "next/image"
import { notFound } from "next/navigation"
import { siteConfig } from "@/config/site.config"
import { fieldsConfig } from "@/config/fields.config"
import { Product } from "@/types"
import AddToCartButton from "@/components/store/cart/AddToCartButton"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("name, description")
    .eq("slug", slug)
    .single()

  if (!data) return {}

  return {
    title: `${data.name} — ${siteConfig.name}`,
    description: data.description,
  }
}

export default async function ProductoPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .eq("active", true)
    .single()

  if (!product) notFound()

  const p = product as Product

  function formatPrice(price: number) {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: siteConfig.currency,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 gap-8">

        <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
          {p.images?.[0] ? (
            <Image
              src={p.images[0]}
              alt={p.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Sin imagen
            </div>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-sm text-gray-500">{p.category}</p>
          <h1 className="text-2xl font-bold">{p.name}</h1>
          <p className="text-3xl font-bold">{formatPrice(p.price)}</p>

          {p.description && (
            <p className="text-gray-600">{p.description}</p>
          )}

          <div className="pt-2">
            {p.stock > 0 ? (
              <span className="text-green-600 text-sm font-medium">
                En stock ({p.stock} disponibles)
              </span>
            ) : (
              <span className="text-red-500 text-sm font-medium">Sin stock</span>
            )}
          </div>

          {p.extra_fields && Object.keys(p.extra_fields).length > 0 && (
            <div className="border rounded-lg p-4 space-y-2">
              {fieldsConfig.productExtraFields.map((field) => {
                const value = p.extra_fields?.[field.key]
                if (!value) return null
                return (
                  <div key={field.key} className="flex justify-between text-sm">
                    <span className="text-gray-500">{field.label}</span>
                    <span className="font-medium">{value}</span>
                  </div>
                )
              })}
            </div>
          )}

         <AddToCartButton product={p} />

        </div>
      </div>
    </div>
  )
}
