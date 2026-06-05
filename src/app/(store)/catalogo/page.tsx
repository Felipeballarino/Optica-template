import { createClient } from "@/lib/supabase/server"
import ProductCard from "@/components/store/ProductCard"
import CatalogoFilters from "@/components/store/CatalogoFilters"
import { siteConfig } from "@/config/site.config"
import { Product } from "@/types"
import { Suspense } from "react"

type SearchParams = {
  categoria?: string
  disponible?: string
  precio_min?: string
  precio_max?: string
  q?: string
}

export const metadata = {
  title: `Catálogo — ${siteConfig.name}`,
}

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const filters = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("created_at", { ascending: false })


  if (filters.categoria) {
    query = query.eq("category", filters.categoria)
  }

  if (filters.disponible === "true") {
    query = query.gt("stock", 0)
  }

  if (filters.precio_min) {
    query = query.gte("price", Number(filters.precio_min))
  }

  if (filters.precio_max) {
    query = query.lte("price", Number(filters.precio_max))
  }

  if (filters.q) {
    query = query.ilike("name", `%${filters.q}%`)
  }

  const { data: products, error } = await query

  if (error) {
    return <div className="p-8 text-center text-red-500">Error al cargar productos</div>
  } 

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Catálogo</h1>

      <div className="mb-4">
        <Suspense>
          <CatalogoFilters />
        </Suspense>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        <a
          href="/catalogo"
          className={`px-3 py-1 rounded-full text-sm border ${!filters.categoria ? "bg-black text-white" : "hover:bg-gray-100"}`}
        >
          Todos
        </a>
        {siteConfig.categories.map((cat) => (
          <a
            key={cat}
            href={`/catalogo?categoria=${cat}`}
            className={`px-3 py-1 rounded-full text-sm border ${filters.categoria === cat ? "bg-black text-white" : "hover:bg-gray-100"}`}
          >
            {cat}
          </a>
        ))}
        <a
          href={`/catalogo?${new URLSearchParams({ ...filters, disponible: "true" }).toString()}`}
          className={`px-3 py-1 rounded-full text-sm border ${filters.disponible === "true" ? "bg-black text-white" : "hover:bg-gray-100"}`}
        >
          Con stock
        </a>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          No hay productos que coincidan con los filtros.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {(products as Product[]).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
