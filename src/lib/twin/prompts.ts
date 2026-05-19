import type { TwinAdjustment, TwinScenarioQuestion } from './types'

export const twinScenarioQuestions: TwinScenarioQuestion[] = [
  {
    id: 'client-follow-up',
    title: 'Client follow-up',
    prompt: 'A useful contact has not replied for 10 days. Write the message you would send.',
    placeholder: 'Write the follow-up in your natural style...',
  },
  {
    id: 'new-opportunity-outreach',
    title: 'New opportunity outreach',
    prompt: 'You have been introduced to someone who could help your business. Write the first message.',
    placeholder: 'Write the first message you would send...',
  },
  {
    id: 'delay-explanation',
    title: 'Delay explanation',
    prompt: 'You promised something by today but need another 48 hours. What do you send?',
    placeholder: 'Explain the delay as you would in real life...',
  },
  {
    id: 'priority-decision',
    title: 'Priority decision',
    prompt: 'You only have time for one important task today. Explain how you decide.',
    placeholder: 'Describe how you choose what matters most...',
  },
  {
    id: 'boundary-pushback',
    title: 'Boundary and pushback',
    prompt: 'Someone is asking for too much without committing properly. Write your response.',
    placeholder: 'Write the response you would actually send...',
  },
  {
    id: 'commercial-close',
    title: 'Commercial close',
    prompt: 'A warm lead likes the idea but has not committed. What would you send?',
    placeholder: 'Write the closing follow-up...',
  },
  {
    id: 'recovery-apology',
    title: 'Recovery and apology',
    prompt: 'You missed an email from an important person. Write the reply.',
    placeholder: 'Write the recovery reply...',
  },
  {
    id: 'delegation',
    title: 'Delegation',
    prompt: 'You need someone to complete something today without sounding aggressive.',
    placeholder: 'Write the delegation message...',
  },
  {
    id: 'calendar-overload',
    title: 'Calendar overload',
    prompt: 'Your day is overloaded. Explain what Atlas should move or protect first.',
    placeholder: 'Tell Atlas how to protect the day...',
  },
  {
    id: 'bad-example',
    title: 'Bad example',
    prompt: 'Show an example of a message style you would NOT want Atlas to send.',
    placeholder: 'Write a style you want Atlas to avoid...',
  },
]

export const twinAdjustmentLabels: Record<TwinAdjustment, string> = {
  warmer: 'Warmer',
  shorter: 'Shorter',
  more_direct: 'More direct',
  less_salesy: 'Less salesy',
  more_professional: 'More professional',
  stronger_close: 'Stronger close',
  protect_focus_time_more: 'Protect focus time more',
}

export function buildTwinSetupPrompt() {
  return 'Atlas learns from practical examples of how you communicate and plan. It does not need personality labels. It uses your scenario responses to prepare drafts and schedule suggestions that still require approval.'
}
