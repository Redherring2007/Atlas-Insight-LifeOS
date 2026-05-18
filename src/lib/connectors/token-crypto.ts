import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 12

function encryptionKey() {
  const raw = process.env.ATLAS_TOKEN_ENCRYPTION_KEY
  if (!raw) {
    throw new Error('ATLAS_TOKEN_ENCRYPTION_KEY is required before Atlas can persist connected account tokens.')
  }

  return createHash('sha256').update(raw).digest()
}

export function encryptToken(value: string) {
  const iv = randomBytes(IV_LENGTH)
  const cipher = createCipheriv(ALGORITHM, encryptionKey(), iv)
  const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()

  return [iv.toString('base64url'), tag.toString('base64url'), encrypted.toString('base64url')].join('.')
}

export function decryptToken(value: string) {
  const [ivText, tagText, encryptedText] = value.split('.')

  if (!ivText || !tagText || !encryptedText) {
    throw new Error('Stored token payload is not in the expected encrypted format.')
  }

  const decipher = createDecipheriv(ALGORITHM, encryptionKey(), Buffer.from(ivText, 'base64url'))
  decipher.setAuthTag(Buffer.from(tagText, 'base64url'))

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedText, 'base64url')),
    decipher.final(),
  ]).toString('utf8')
}

export function tokenEncryptionIsConfigured() {
  return Boolean(process.env.ATLAS_TOKEN_ENCRYPTION_KEY)
}
