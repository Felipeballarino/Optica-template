export const siteConfig = {
  name: "Óptica Ejemplo",
  tagline: "Tu visión, nuestra prioridad",
  logo: "/logo.svg",
  contact: {
    phone: "+54 9 351 000-0000",
    email: "info@optica-ejemplo.com.ar",
    address: "Av. Siempreviva 742, Villa María",
    instagram: "@optica_ejemplo",
    whatsapp: "+5493510000000",
  },
  categories: ["Marcos", "Lentes de contacto", "Lentes de sol", "Accesorios"],
  currency: "ARS",
  mercadopago: {
    publicKey: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY!,
  },
}
