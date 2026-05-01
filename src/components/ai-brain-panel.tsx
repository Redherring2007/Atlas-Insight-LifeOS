'use client'

import { useState } from 'react'
import { MessageCircle, Sparkles, ArrowRight, Zap } from 'lucide-react'

const suggestions = [
  'What should I do next?',
  'Draft a reply to my investor update',
  'Review today’s priorities',
  'Check financial impact for this week',
  'Prepare me for this meeting'
]

export function AIBrainPanel() {
  const [input, setInput] = useState('')
  const [activeSuggestion, setActiveSuggestion] = useState('What should I do next?')

  const handlePrompt = (prompt: string) => {
    setInput(prompt)
    setActiveSuggestion(prompt)
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-[#121C28]/80 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#00D9FF]">ATLAS AI Brain</p>
          <h2 className="mt-2 text-3xl font-semibold text-[#EAF2F8]">Always learning. Always connecting patterns.</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#8FA3B8]">Every user gets the AI Assistant by default. It learns from your work, your decisions, and your approvals.</p>
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-[#8FA3B8]">
          <p className="font-semibold text-[#00D9FF]">AI Assistant: Included by default</p>
          <p className="mt-2">Context depends on user permissions.</p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-3xl border border-white/10 bg-[#0F1620]/90 p-4">
          <label className="text-sm text-[#8FA3B8]">Ask the AI</label>
          <div className="mt-3 flex gap-3">
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={3}
              placeholder="Ask the AI to review priorities, craft a message, or assess impact..."
              className="w-full resize-none rounded-3xl border border-white/10 bg-[#121C28] px-4 py-3 text-sm text-[#EAF2F8] outline-none focus:border-[#00AFFF] focus:ring-2 focus:ring-[#00AFFF]/20"
            />
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            {suggestions.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handlePrompt(prompt)}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-[#8FA3B8] transition hover:border-[#00AFFF] hover:text-[#EAF2F8]"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-[#0F1620]/90 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8FA3B8]">Assistant</p>
            <p className="mt-3 text-lg font-semibold text-[#EAF2F8]">What should I do next?</p>
            <p className="mt-2 text-sm text-[#8FA3B8]">Receive a concise plan for the day and the next intelligent action.</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0F1620]/90 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8FA3B8]">Draft</p>
            <p className="mt-3 text-lg font-semibold text-[#EAF2F8]">Draft a reply</p>
            <p className="mt-2 text-sm text-[#8FA3B8]">Have ATLAS write email or message drafts from your current context.</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-[#0F1620]/90 p-4">
            <p className="text-xs uppercase tracking-[0.3em] text-[#8FA3B8]">Impact</p>
            <p className="mt-3 text-lg font-semibold text-[#EAF2F8]">Review financial impact</p>
            <p className="mt-2 text-sm text-[#8FA3B8]">Quickly assess how decisions change budget and runway.</p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-[#8FA3B8]">
        <Sparkles className="h-5 w-5 text-[#00D9FF]" />
        <p>AI context is always learning from tasks, calendar activity, approvals, and decisions.</p>
      </div>
    </section>
  )
}
