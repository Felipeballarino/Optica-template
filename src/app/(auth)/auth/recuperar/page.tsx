'use client'

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Link from "next/link"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { siteConfig } from "@/config/site.config"

const recuperarSchema = z.object({
  email: z.string().email("Email inválido"),
})

type RecuperarForm = z.infer<typeof recuperarSchema>

export default function RecuperarPage() {
  const [loading, setLoading] = useState(false)
  const [enviado, setEnviado] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<RecuperarForm>({
    resolver: zodResolver(recuperarSchema),
  })

  async function onSubmit(data: RecuperarForm) {
    setLoading(true)
    const supabase = createClient()

    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback?next=/auth/nueva-password`,
    })

    if (error) {
      toast.error("Ocurrió un error, intentá de nuevo")
      setLoading(false)
      return
    }

    setEnviado(true)
  }

  if (enviado) {
    return (
      <div className="w-full max-w-sm space-y-4 p-8 bg-white rounded-lg shadow text-center">
        <h2 className="text-xl font-bold">Revisá tu email</h2>
        <p className="text-gray-500 text-sm">
          Te enviamos un link para restablecer tu contraseña.
        </p>
        <Link href="/auth/login" className="text-sm font-medium hover:underline block">
          Volver al login
        </Link>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm space-y-6 p-8 bg-white rounded-lg shadow">
      <div className="text-center">
        <h1 className="text-2xl font-bold">{siteConfig.name}</h1>
        <p className="text-gray-500 text-sm mt-1">Recuperá tu contraseña</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500 text-xs">{errors.email.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Enviando..." : "Enviar link"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <Link href="/auth/login" className="text-gray-500 hover:underline">
          Volver al login
        </Link>
      </div>
    </div>
  )
}
