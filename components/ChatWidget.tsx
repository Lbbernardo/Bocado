'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Bot, Phone } from 'lucide-react'
import type { StoreConfig } from '@/lib/types'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface QuickTopic {
  question: string
  answer: (config: Partial<StoreConfig> | null) => string
}

const QUICK_TOPICS: QuickTopic[] = [
  {
    question: '¿Cómo hago un pedido?',
    answer: () =>
      'Fácil: 1) elige tus productos en /productos y agrégalos al carrito 2) ve al carrito y llena tus datos 3) elige retiro o delivery y paga 4) te llega un número de pedido y un correo de confirmación. ¡Listo! 🧀',
  },
  {
    question: '¿Tienen delivery?',
    answer: (config) => {
      if (!config?.delivery_enabled) {
        return 'Por ahora no tenemos delivery activo, solo retiro en punto. ¡Pero pronto puede que sí! 📦'
      }
      const fee = config.delivery_fee ? ` con un costo de $${config.delivery_fee}` : ''
      const zones = config.delivery_zones ? ` Zonas: ${config.delivery_zones}.` : ''
      return `¡Sí! Hacemos delivery${fee}.${zones}`.trim()
    },
  },
  {
    question: '¿Cuándo puedo retirar?',
    answer: (config) => {
      if (!config?.pickup_enabled) {
        return 'El retiro en punto está desactivado por ahora. Escríbenos por WhatsApp para más info.'
      }
      const parts: string[] = []
      if (config.pickup_date) parts.push(`📅 ${config.pickup_date}`)
      if (config.pickup_start_time) parts.push(`🕐 ${config.pickup_start_time}${config.pickup_end_time ? ` – ${config.pickup_end_time}` : ''}`)
      if (config.pickup_address) parts.push(`📍 ${config.pickup_address}`)
      return parts.length
        ? `Puedes retirar tu pedido aquí: ${parts.join(' · ')}`
        : 'La info de retiro está en el banner de la página principal.'
    },
  },
  {
    question: '¿Cómo sigo mi pedido?',
    answer: () =>
      'Entra a /pedido/buscar y pon tu número de teléfono o el número de pedido (BOC-AÑO-XXXX) para ver el estado en tiempo real. 📦',
  },
]

const KEYWORDS: { match: RegExp; topic: number }[] = [
  { match: /pedid|compr|orden|carrito/i, topic: 0 },
  { match: /deliver|envio|env[íi]o/i, topic: 1 },
  { match: /retir|recog|pickup|busc.*direcc/i, topic: 2 },
  { match: /segui|tracking|estado|d[óo]nde.*pedido/i, topic: 3 },
]

function findAnswer(text: string, config: Partial<StoreConfig> | null): string | null {
  const hit = KEYWORDS.find((k) => k.match.test(text))
  return hit ? QUICK_TOPICS[hit.topic].answer(config) : null
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [started, setStarted] = useState(false)
  const [config, setConfig] = useState<Partial<StoreConfig> | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    fetch('/api/config')
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => {})
  }, [])

  useEffect(() => {
    if (open && !started) {
      setMessages([
        {
          role: 'assistant',
          content: '¡Hola! Soy Cheddar, el asistente de BOCADO 🧀 ¿En qué te puedo ayudar?',
        },
      ])
      setStarted(true)
    }
  }, [open, started])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  const whatsapp = config?.support_whatsapp_number ?? null
  const whatsappHref = whatsapp
    ? `https://wa.me/${whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent('¡Hola! Tengo una pregunta sobre BOCADO 🧀')}`
    : null

  function fallbackMessage() {
    return whatsapp
      ? 'No tengo una respuesta exacta para eso — escríbenos por WhatsApp y te ayudamos enseguida. 💬'
      : 'No tengo una respuesta exacta para eso. Prueba con una de las preguntas rápidas de arriba.'
  }

  function sendMessage(text: string) {
    if (!text.trim()) return
    const userMsg: Message = { role: 'user', content: text.trim() }
    const answer = findAnswer(text, config) ?? fallbackMessage()
    setMessages((prev) => [...prev, userMsg, { role: 'assistant', content: answer }])
    setInput('')
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  return (
    <>
      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-[340px] max-w-[calc(100vw-2rem)] flex flex-col rounded-2xl shadow-2xl overflow-hidden border border-gray-100 bg-white animate-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-bocado-dark px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-bocado-orange flex items-center justify-center flex-shrink-0">
              <Bot size={18} className="text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-bold text-sm leading-tight">Cheddar</p>
              <p className="text-gray-400 text-xs">Asistente BOCADO</p>
            </div>
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                title="Escríbenos por WhatsApp"
                className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:scale-110 transition-transform flex-shrink-0"
              >
                <Phone size={14} />
              </a>
            )}
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-bocado-cream min-h-[280px] max-h-[360px]">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-bocado-orange text-white rounded-br-sm'
                      : 'bg-white text-bocado-dark shadow-sm rounded-bl-sm'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Quick questions (show only at start) */}
          {messages.length === 1 && (
            <div className="px-3 pb-2 pt-1 bg-bocado-cream border-t border-gray-100 flex flex-wrap gap-1.5">
              {QUICK_TOPICS.map((t) => (
                <button
                  key={t.question}
                  onClick={() => sendMessage(t.question)}
                  className="text-xs bg-white border border-bocado-orange text-bocado-orange rounded-full px-3 py-1 hover:bg-bocado-orange hover:text-white transition-colors font-medium"
                >
                  {t.question}
                </button>
              ))}
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs bg-[#25D366] border border-[#25D366] text-white rounded-full px-3 py-1 hover:bg-[#1eb958] transition-colors font-medium flex items-center gap-1"
                >
                  <Phone size={11} /> Hablar por WhatsApp
                </a>
              )}
            </div>
          )}

          {/* Input */}
          <div className="px-3 py-3 bg-white border-t border-gray-100 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Escribe tu pregunta..."
              className="flex-1 text-sm bg-bocado-cream rounded-full px-4 py-2.5 outline-none placeholder:text-gray-400 text-bocado-dark"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full bg-bocado-orange flex items-center justify-center text-white hover:bg-orange-500 transition-colors disabled:opacity-40 flex-shrink-0"
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-4 z-50 w-14 h-14 rounded-full bg-bocado-orange shadow-bocado flex items-center justify-center text-white hover:bg-orange-500 hover:scale-110 transition-all duration-200"
        aria-label="Abrir chat"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </>
  )
}
