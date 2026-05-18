import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

const STATE_TTL_MS = 10 * 60 * 1000

interface OAuthStatePayload {
  provider: string
  userId: string
  nonce: string
  createdAt: number
}

function stateSecret() {
  return process.env.NEXTAUTH_SECRET ?? process.env.ATLAS_TOKEN_ENCRYPTION_KEY ?? ''
}

function encode(value: string) {
  return Buffer.from(value, 'utf8').toString('base64url')
}

function decode(value: string) {
  return Buffer.from(value, 'base64url').toString('utf8')
}

function sign(payload: string) {
  const secret = stateSecret()
  if (!secret) throw new Error('NEXTAUTH_SECRET is required to sign OAuth state.')
  return createHmac('sha256', secret).update(payload).digest('base64url')
}

export function createSignedOAuthState(provider: string, userId: string) {
  const payload: OAuthStatePayload = {
    provider,
    userId,
    nonce: randomBytes(16).toString('base64url'),
    createdAt: Date.now(),
  }
  const encoded = encode(JSON.stringify(payload))
  return `${encoded}.${sign(encoded)}`
}

export function verifySignedOAuthState(value: string | null, provider: string) {
  if (!value) return { ok: false as const, error: 'Missing OAuth state.' }

  const [encoded, signature] = value.split('.')
  if (!encoded || !signature) return { ok: false as const, error: 'OAuth state is malformed.' }

  const expected = sign(encoded)
  const suppliedBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)

  if (suppliedBuffer.length !== expectedBuffer.length || !timingSafeEqual(suppliedBuffer, expectedBuffer)) {
    return { ok: false as const, error: 'OAuth state signature is invalid.' }
  }

  const payload = JSON.parse(decode(encoded)) as OAuthStatePayload

  if (payload.provider !== provider) {
    return { ok: false as const, error: 'OAuth state provider mismatch.' }
  }

  if (Date.now() - payload.createdAt > STATE_TTL_MS) {
    return { ok: false as const, error: 'OAuth state has expired.' }
  }

  return { ok: true as const, payload }
}
