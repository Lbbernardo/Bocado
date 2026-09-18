'use client'

import { useState, useEffect } from 'react'
import { Plus, Loader2, Trash2, X, UserCog, Eye, EyeOff } from 'lucide-react'

interface AdminUser {
  id: string
  email: string | null
  created_at: string
  last_sign_in_at: string | null
}

export default function UsuariosAdminPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    setLoading(true)
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    setUsers(data.users ?? [])
    setLoading(false)
  }

  async function handleDelete(u: AdminUser) {
    const confirmed = window.confirm(
      `¿Eliminar el acceso de "${u.email}"? Ya no podrá entrar al panel.`
    )
    if (!confirmed) return

    setDeletingId(u.id)
    const res = await fetch(`/api/admin/users?id=${u.id}`, { method: 'DELETE' })
    const data = await res.json()
    setDeletingId(null)

    if (!res.ok) {
      window.alert(data.error || 'Error al eliminar el usuario')
      return
    }
    fetchUsers()
  }

  function formatDate(d: string | null) {
    if (!d) return 'Nunca'
    return new Date(d).toLocaleDateString('es', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="text-bocado-orange animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-8 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-white font-black text-3xl">Usuarios administrativos</h1>
          <p className="text-gray-500 text-sm mt-1">
            {users.length} {users.length === 1 ? 'usuario con acceso' : 'usuarios con acceso'} al panel
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-bocado-orange hover:bg-orange-500 text-white font-bold px-5 py-3 rounded-xl transition-all"
        >
          <Plus size={18} />
          Nuevo usuario
        </button>
      </div>

      {/* Users list */}
      <div className="bg-bocado-dark border border-white/5 rounded-2xl overflow-hidden max-w-3xl">
        {users.map((u) => (
          <div
            key={u.id}
            className="flex items-center justify-between px-6 py-4 border-b border-white/5 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-bocado-orange/10 rounded-full flex items-center justify-center">
                <UserCog size={18} className="text-bocado-orange" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{u.email}</p>
                <p className="text-gray-500 text-xs mt-0.5">
                  Creado {formatDate(u.created_at)} · Último acceso {formatDate(u.last_sign_in_at)}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDelete(u)}
              disabled={deletingId === u.id}
              className="flex items-center gap-1.5 text-gray-500 hover:text-red-500 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {deletingId === u.id ? (
                <Loader2 size={13} className="animate-spin" />
              ) : (
                <Trash2 size={13} />
              )}
              Eliminar
            </button>
          </div>
        ))}
      </div>

      {showForm && (
        <NewUserModal
          onClose={() => setShowForm(false)}
          onCreated={() => {
            setShowForm(false)
            fetchUsers()
          }}
        />
      )}
    </div>
  )
}

function NewUserModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate() {
    setSaving(true)
    setError('')
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    setSaving(false)

    if (!res.ok) {
      setError(data.error || 'Error al crear el usuario')
      return
    }
    onCreated()
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-bocado-dark border border-white/10 rounded-3xl w-full max-w-sm">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-white font-black text-xl">Nuevo usuario</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white rounded-xl hover:bg-white/10 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="text-gray-400 text-sm font-medium block mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nuevo@bocado.com"
              className="w-full bg-bocado-darker border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-bocado-orange/50 transition-colors"
            />
          </div>
          <div>
            <label className="text-gray-400 text-sm font-medium block mb-2">Contraseña</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full bg-bocado-darker border border-white/10 rounded-xl px-4 py-3 pr-12 text-white text-sm focus:outline-none focus:border-bocado-orange/50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <p className="text-gray-600 text-xs">
            Al crear el usuario, le llegará un correo a esa dirección con el email y la contraseña para entrar al panel.
          </p>
        </div>

        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleCreate}
            disabled={saving || !email || password.length < 8}
            className="w-full bg-bocado-orange hover:bg-orange-500 disabled:opacity-60 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 size={18} className="animate-spin" /> : 'Crear usuario'}
          </button>
        </div>
      </div>
    </div>
  )
}
