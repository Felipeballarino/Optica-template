import CartDrawer from "@/components/store/cart/CartDrawer"
import { siteConfig } from "@/config/site.config"
import Link from "next/link"

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl">
            {siteConfig.name}
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/catalogo" className="hover:underline">
              Catálogo
            </Link>
            <Link href="/auth/login" className="hover:underline">
              Mi cuenta
            </Link>
            <CartDrawer />
          </nav>
        </div>
      </header>

      <main className="flex-1">
        {children}
      </main>

      <footer className="border-t bg-white py-6 text-center text-sm text-gray-500">
        {siteConfig.name} — {siteConfig.contact.address}
      </footer>
    </div>
  )
}
