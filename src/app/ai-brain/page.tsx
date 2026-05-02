import { ModulePage } from '@/components/module-page'
import { Bot, History, Lightbulb, MessageSquare, Sparkles } from 'lucide-react'

export default function AIBrainPage() {
  return (
    <ModulePage
      title="AI Brain"
      subtitle="Ask ATLAS, capture decisions, and keep learning signals close."
      primaryAction="Ask ATLAS"
      privacy
      stats={[
        { label: 'Prompts', value: '6', detail: 'ready', icon: MessageSquare },
        { label: 'Decisions', value: '4', detail: 'recent', icon: History },
        { label: 'Signals', value: '9', detail: 'learned', icon: Lightbulb },
        { label: 'Memory', value: 'On', detail: 'permissioned', icon: Bot },
        { label: 'Focus', value: '2h', detail: 'suggested', icon: Sparkles },
      ]}
      sections={[
        { title: 'Ask ATLAS', items: ['What needs my attention today?', 'Draft a reply to the contract revision.', 'Summarise the finance approvals.'], action: 'Start prompt' },
        { title: 'Suggested Prompts', items: ['Plan the next three moves for ABC Corp.', 'Find anything blocked by me.', 'Prepare a short meeting brief.'], action: 'Use prompt' },
        { title: 'Recent Decisions', items: ['Moved invoice follow-up to today.', 'Kept AI Assistant included for all team members.', 'Marked private calendar as owner-only.'], action: 'View log' },
        { title: 'Learning Signals', items: ['Morning decisions are faster.', 'Contract work needs focused blocks.', 'Finance approval copy should stay concise.'], action: 'Apply signal' },
      ]}
      quickSetup={[
        { title: 'Ask a question', description: 'Start with one clear decision or summary.', action: 'Ask', icon: MessageSquare },
        { title: 'Save decision', description: 'Keep a short record of what changed.', action: 'Save', icon: History },
        { title: 'Review signals', description: 'Accept only useful learning patterns.', action: 'Review', icon: Lightbulb },
      ]}
    />
  )
}
