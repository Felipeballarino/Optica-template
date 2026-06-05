import Link from "next/link"

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>
}) {
  const { order_id } = await searchParams

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">✗</div>
      <h1 className="text-2xl font-bold mb-2">El pago no se completó</h1>
      <p className="text-gray-500 mb-6">Podés intentarlo de nuevo o contactarnos.</p>
      {order_id && (
        <p className="text-xs text-gray-400 mb-6">Pedido #{order_id}</p>
      )}
      <div className="space-y-3">
        <Link
          href="/carrito"
          className="block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Volver al carrito
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
