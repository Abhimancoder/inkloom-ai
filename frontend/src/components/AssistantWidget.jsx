import { useState } from 'react'
import { Bot, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { sendAssistantMessage } from '../services/assistantApi'

const starterMessage = {
  role: 'assistant',
  content: 'Hi! I’m Inkloom Guide. I can explain the audit workflow, visual checks, rewrite suggestions, review queue, and integrations. What would you like to learn?'
}

const quickQuestions = [
  'How do I run my first content audit?',
  'What does the review queue do?',
  'Explain the visual brand checks.'
]

export default function AssistantWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([starterMessage])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const ask = async (question = input) => {
    const content = question.trim()
    if (!content || loading) return

    const nextMessages = [...messages, { role: 'user', content }]
    setMessages(nextMessages)
    setInput('')
    setError('')
    setLoading(true)

    try {
      const answer = await sendAssistantMessage(nextMessages)
      setMessages([...nextMessages, { role: 'assistant', content: answer }])
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'The assistant is unavailable. Check the backend and GROQ_API_KEY.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {open && (
        <section className="fixed bottom-20 right-4 z-50 flex h-[min(620px,calc(100vh-7rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[#DCE4EC] bg-white shadow-2xl">
          <header className="flex items-center justify-between bg-[#142B4A] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#176B59]"><Bot className="h-5 w-5" /></span>
              <div><p className="text-sm font-bold">Inkloom Guide</p><p className="text-[11px] text-white/70">Your product walkthrough assistant</p></div>
            </div>
            <button aria-label="Close assistant" onClick={() => setOpen(false)} className="rounded-lg p-1.5 text-white/70 hover:bg-white/10 hover:text-white"><X className="h-5 w-5" /></button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto bg-[#F5F7FA] p-3">
            {messages.map((message, index) => (
              <div key={`${message.role}-${index}`} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-5 ${message.role === 'user' ? 'rounded-br-md bg-[#176B59] text-white' : 'rounded-bl-md border border-[#E4EAF0] bg-white text-[#202833]'}`}>
                  {message.content}
                </div>
              </div>
            ))}
            {loading && <div className="flex items-center gap-2 text-xs text-gray-500"><Sparkles className="h-4 w-4 animate-pulse text-[#176B59]" /> Inkloom Guide is thinking…</div>}
            {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}
            {messages.length === 1 && <div className="space-y-2 pt-1">{quickQuestions.map((question) => <button key={question} onClick={() => ask(question)} className="block w-full rounded-lg border border-[#DCE4EC] bg-white px-3 py-2 text-left text-xs text-[#142B4A] hover:border-[#176B59]">{question}</button>)}</div>}
          </div>

          <form onSubmit={(event) => { event.preventDefault(); ask() }} className="flex gap-2 border-t border-[#E5EAF0] bg-white p-3">
            <input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about Inkloom…" className="min-w-0 flex-1 rounded-xl border border-[#DCE4EC] px-3 py-2 text-sm outline-none focus:border-[#176B59]" disabled={loading} />
            <button aria-label="Send message" type="submit" disabled={loading || !input.trim()} className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#176B59] text-white disabled:cursor-not-allowed disabled:opacity-50"><Send className="h-4 w-4" /></button>
          </form>
        </section>
      )}

      <button aria-label="Open Inkloom Guide" onClick={() => setOpen((value) => !value)} className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full bg-[#176B59] px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#125845]">
        {open ? <X className="h-5 w-5" /> : <MessageCircle className="h-5 w-5" />}<span className="hidden sm:inline">Inkloom Guide</span>
      </button>
    </>
  )
}
