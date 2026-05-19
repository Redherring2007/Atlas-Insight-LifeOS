import type { TwinAdjustment, TwinDraftGuidance, TwinProfile, TwinProfileTraits, TwinScenarioResponse, TwinTraitLevel } from './types'

const nowIso = () => new Date().toISOString()

function countMatches(text: string, words: string[]) {
  const lower = text.toLowerCase()
  return words.reduce((count, word) => count + (lower.includes(word) ? 1 : 0), 0)
}

function traitFromScore(score: number): TwinTraitLevel {
  if (score <= 0) return 'low'
  if (score >= 3) return 'high'
  return 'balanced'
}

function averageLength(responses: TwinScenarioResponse[]) {
  const completed = responses.filter((item) => item.response.trim().length > 0)
  if (completed.length === 0) return 0
  const total = completed.reduce((sum, item) => sum + item.response.trim().split(/\s+/).length, 0)
  return total / completed.length
}

export function createDefaultTwinProfile(userId?: string): TwinProfile {
  const createdAt = nowIso()

  return {
    id: 'default-twin-profile',
    userId,
    status: 'default',
    summary: 'Atlas will use balanced, professional defaults until your communication examples are added.',
    traits: {
      writingDirectness: 'balanced',
      warmthLevel: 'balanced',
      formalityLevel: 'balanced',
      messageLengthPreference: 'balanced',
      commercialAssertiveness: 'balanced',
      apologyStyle: 'brief_accountable',
      followUpPressure: 'balanced',
      decisionBias: 'balanced',
      delegationStyle: 'clear_owner_deadline',
      calendarProtectionStyle: 'balanced',
      phrasesToUse: ['clear next step', 'thanks', 'appreciate it'],
      phrasesToAvoid: ['just checking in', 'urgent!!!'],
      confidenceThresholdForDrafts: 0.72,
      rewritePreferences: ['keep it calm', 'make the next step clear'],
    },
    scenarioResponses: [],
    createdAt,
    updatedAt: createdAt,
  }
}

export function inferTwinProfile(responses: TwinScenarioResponse[], userId?: string): TwinProfile {
  const combined = responses.map((item) => item.response).join('\n')
  const wordAverage = averageLength(responses)
  const directScore = countMatches(combined, ['next step', 'by ', 'please confirm', 'i suggest', 'let us decide']) - countMatches(combined, ['perhaps', 'maybe', 'whenever'])
  const warmthScore = countMatches(combined, ['thanks', 'appreciate', 'hope', 'warm', 'understand', 'glad'])
  const formalScore = countMatches(combined, ['regards', 'sincerely', 'appreciated', 'available', 'confirm'])
  const commercialScore = countMatches(combined, ['commit', 'proposal', 'commercial', 'next step', 'close', 'move forward'])
  const followUpScore = countMatches(combined, ['checking', 'follow up', 'confirm', 'close this', 'next step'])

  const delayText = responses.find((item) => item.scenarioId === 'delay-explanation')?.response.toLowerCase() ?? ''
  const apologyText = responses.find((item) => item.scenarioId === 'recovery-apology')?.response.toLowerCase() ?? ''
  const priorityText = responses.find((item) => item.scenarioId === 'priority-decision')?.response.toLowerCase() ?? ''
  const delegationText = responses.find((item) => item.scenarioId === 'delegation')?.response.toLowerCase() ?? ''
  const calendarText = responses.find((item) => item.scenarioId === 'calendar-overload')?.response.toLowerCase() ?? ''
  const badExample = responses.find((item) => item.scenarioId === 'bad-example')?.response ?? ''

  const traits: TwinProfileTraits = {
    writingDirectness: traitFromScore(directScore),
    warmthLevel: traitFromScore(warmthScore),
    formalityLevel: traitFromScore(formalScore),
    messageLengthPreference: wordAverage < 45 ? 'short' : wordAverage > 95 ? 'detailed' : 'balanced',
    commercialAssertiveness: traitFromScore(commercialScore),
    apologyStyle: apologyText.includes('sorry') || delayText.includes('sorry') ? 'warm_repair' : 'brief_accountable',
    followUpPressure: traitFromScore(followUpScore),
    decisionBias: priorityText.includes('evidence') || priorityText.includes('impact') ? 'evidence' : priorityText.includes('relationship') || priorityText.includes('client') ? 'relationship' : priorityText.includes('fast') || priorityText.includes('quick') ? 'speed' : 'balanced',
    delegationStyle: delegationText.includes('could you') || delegationText.includes('can you') ? 'collaborative' : delegationText.includes('today') || delegationText.includes('by') ? 'clear_owner_deadline' : 'direct_priority',
    calendarProtectionStyle: calendarText.includes('focus') || calendarText.includes('deep work') ? 'protect_focus_first' : calendarText.includes('meeting') ? 'protect_meetings_first' : 'balanced',
    phrasesToUse: extractUsefulPhrases(combined),
    phrasesToAvoid: extractAvoidedPhrases(badExample),
    confidenceThresholdForDrafts: 0.74,
    rewritePreferences: ['sound like me', 'keep the next action clear'],
  }

  const createdAt = nowIso()

  return {
    id: `twin-profile-${createdAt}`,
    userId,
    status: 'inferred',
    summary: 'Atlas has learned your preferred communication and planning style.',
    traits,
    scenarioResponses: responses,
    createdAt,
    updatedAt: createdAt,
  }
}

function extractUsefulPhrases(text: string) {
  const phrases = ['thanks', 'appreciate it', 'next step', 'happy to', 'let me know', 'I suggest']
  return phrases.filter((phrase) => text.toLowerCase().includes(phrase.toLowerCase())).slice(0, 5)
}

function extractAvoidedPhrases(text: string) {
  if (!text.trim()) return ['overly aggressive pressure', 'vague check-ins']
  return text.split(/[.!?\n]/).map((item) => item.trim()).filter(Boolean).slice(0, 3)
}

export function applyTwinAdjustment(profile: TwinProfile, adjustment: TwinAdjustment): TwinProfile {
  const traits = { ...profile.traits }

  if (adjustment === 'warmer') traits.warmthLevel = 'high'
  if (adjustment === 'shorter') traits.messageLengthPreference = 'short'
  if (adjustment === 'more_direct') traits.writingDirectness = 'high'
  if (adjustment === 'less_salesy') traits.commercialAssertiveness = 'low'
  if (adjustment === 'more_professional') traits.formalityLevel = 'high'
  if (adjustment === 'stronger_close') traits.followUpPressure = 'high'
  if (adjustment === 'protect_focus_time_more') traits.calendarProtectionStyle = 'protect_focus_first'

  return {
    ...profile,
    status: 'adjusted',
    traits: {
      ...traits,
      rewritePreferences: [...traits.rewritePreferences, adjustment.replace(/_/g, ' ')].slice(-6),
    },
    updatedAt: nowIso(),
  }
}

export function buildTwinDraftGuidance(profile: TwinProfile): TwinDraftGuidance {
  return {
    toneInstruction: `Use ${profile.traits.warmthLevel} warmth, ${profile.traits.formalityLevel} formality, and ${profile.traits.writingDirectness} directness.`,
    lengthInstruction: `Prefer ${profile.traits.messageLengthPreference} messages with a clear next step.`,
    pressureInstruction: `Use ${profile.traits.followUpPressure} follow-up pressure and ${profile.traits.commercialAssertiveness} commercial assertiveness.`,
    safetyInstruction: 'Prepare drafts only. Do not send, schedule, delete, archive, or modify external systems without approval.',
    rewritePreferences: profile.traits.rewritePreferences,
  }
}

export function summarizeTwinProfile(profile: TwinProfile) {
  return [
    `Communication: ${profile.traits.messageLengthPreference}, ${profile.traits.warmthLevel} warmth, ${profile.traits.writingDirectness} directness.`,
    `Planning: ${profile.traits.decisionBias} decisions with ${profile.traits.calendarProtectionStyle.replace(/_/g, ' ')}.`,
    `Draft confidence threshold: ${Math.round(profile.traits.confidenceThresholdForDrafts * 100)}%.`,
  ]
}
