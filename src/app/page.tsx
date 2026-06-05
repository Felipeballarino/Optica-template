import Link from "next/link"
import { siteConfig } from "@/config/site.config"
import { createClient } from "@/lib/supabase/server"
import ProductCard from "@/components/store/ProductCard"
import { Product } from "@/types"

export default async function HomePage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .gt("stock", 0)
    .order("created_at", { ascending: false })
    .limit(4)

  return (
    <div>
      <section className="bg-black text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-3">{siteConfig.name}</h1>
        <p className="text-gray-300 text-lg mb-8">{siteConfig.tagline}</p>
        <Link
          href="/catalogo"
          className="bg-white text-black px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
        >
          Ver catálogo
        </Link>
      </section>

      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Productos destacados</h2>
          <Link href="/catalogo" className="text-sm hover:underline">
            Ver todos →
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product as Product} />
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-12 px-4 text-center">
        <h2 className="text-xl font-bold mb-2">¿Necesitás asesoramiento?</h2>
        <p className="text-gray-500 mb-6">
          Contactanos por WhatsApp y te ayudamos a elegir.
        </p>
        <a
          href={`https://wa.me/${siteConfig.contact.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
        >
          Escribinos por WhatsApp
        </a>
      </section>
    </div>
  )
}
