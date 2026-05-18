export function displayString(value: string | null | undefined, fallback = 'Not set') {
  return value?.trim() || fallback
}

export function displayDate(value: Date | string | number | null | undefined, fallback = 'No date') {
  if (!value) return fallback

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return fallback

  return date.toLocaleDateString()
}

export function displayTime(value: Date | string | number | null | undefined, fallback = '') {
  if (!value) return fallback

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return fallback

  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

export function toMoneyNumber(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === '') return 0

  const amount = typeof value === 'number' ? value : Number.parseFloat(value)
  return Number.isFinite(amount) ? amount : 0
}

export function formatCurrency(value: string | number | null | undefined) {
  return toMoneyNumber(value).toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
  }

  if (typeof value === 'string') {
    return value.split(',').map((item) => item.trim()).filter(Boolean)
  }

  return []
}
