import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { createAdminClient, createClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const authClient = createClient()
  const { data: { user } } = await authClient.auth.getUser()
  return user
}

export async function GET() {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const supabase = createAdminClient()
  const { data, error } = await supabase.auth.admin.listUsers()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const users = data.users
    .map((u) => ({
      id: u.id,
      email: u.email,
      created_at: u.created_at,
      last_sign_in_at: u.last_sign_in_at,
    }))
    .sort((a, b) => (a.created_at < b.created_at ? 1 : -1))

  return NextResponse.json({ users })
}

const createUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),
})

export async function POST(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await request.json()
  const parsed = createUserSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0].message }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data, error } = await supabase.auth.admin.createUser({
    email: parsed.data.email,
    password: parsed.data.password,
    email_confirm: true,
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // Send login credentials to the new admin — awaited so it isn't killed when the
  // serverless function freezes right after the response is returned.
  await sendCredentialsEmail(parsed.data.email, parsed.data.password).catch(console.error)

  return NextResponse.json({ id: data.user.id, email: data.user.email }, { status: 201 })
}

async function sendCredentialsEmail(email: string, password: string) {
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: `${process.env.RESEND_FROM_NAME ?? 'BOCADO'} <${process.env.RESEND_FROM_EMAIL ?? 'pedidos@bocado.com'}>`,
    to: email,
    subject: 'Tu acceso al panel administrativo de BOCADO',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #111; color: #fff; border-radius: 16px; overflow: hidden;">
        <div style="background: #FFA600; padding: 32px; text-align: center;">
          <h1 style="margin: 0; font-size: 36px; font-weight: 900; color: white;">BOCADO</h1>
          <p style="margin: 4px 0 0; color: rgba(255,255,255,0.8); font-size: 12px; letter-spacing: 3px; text-transform: uppercase;">· PANEL ADMINISTRATIVO ·</p>
        </div>
        <div style="padding: 32px;">
          <p style="color: #888;">Se creó un acceso administrativo para ti. Estos son tus datos para entrar:</p>
          <div style="background: #1a1a1a; border-radius: 12px; padding: 16px; margin: 20px 0; border: 1px solid #222;">
            <p style="color: #555; margin: 0 0 4px; font-size: 11px;">EMAIL</p>
            <p style="color: white; font-size: 16px; font-weight: 700; margin: 0 0 16px;">${email}</p>
            <p style="color: #555; margin: 0 0 4px; font-size: 11px;">CONTRASEÑA</p>
            <p style="color: #FFA600; font-size: 16px; font-weight: 700; margin: 0;">${password}</p>
          </div>
          <a href="https://bocado.store/admin/login" style="display: inline-block; background: #FFA600; color: white; font-weight: 700; padding: 14px 28px; border-radius: 10px; text-decoration: none; margin-bottom: 16px;">Entrar al panel →</a>
          <p style="color: #555; font-size: 13px; margin-top: 20px;">
            Por seguridad, te recomendamos cambiar esta contraseña después de tu primer inicio de sesión.
          </p>
        </div>
      </div>
    `,
  })
}

export async function DELETE(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Falta el id del usuario' }, { status: 400 })

  if (id === user.id) {
    return NextResponse.json({ error: 'No puedes eliminar tu propia cuenta' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { data: listData } = await supabase.auth.admin.listUsers()
  if (listData && listData.users.length <= 1) {
    return NextResponse.json({ error: 'No puedes eliminar el último usuario administrativo' }, { status: 400 })
  }

  const { error } = await supabase.auth.admin.deleteUser(id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
