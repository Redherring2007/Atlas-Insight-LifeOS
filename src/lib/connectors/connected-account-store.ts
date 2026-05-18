import { and, eq } from 'drizzle-orm'
import { db } from '@/db'
import { connectedAccounts, connectedAccountSignals } from '@/db/schema'
import { decryptToken, encryptToken } from './token-crypto'
import type { ConnectorSignal } from './types'

export interface PersistConnectedAccountInput {
  userId: string
  provider: string
  providerAccountId: string
  accountEmail?: string
  displayName?: string
  scopes: string[]
  accessToken: string
  refreshToken?: string
  tokenExpiresAt?: Date
}

export async function persistConnectedAccount(input: PersistConnectedAccountInput) {
  const encryptedAccessToken = encryptToken(input.accessToken)
  const encryptedRefreshToken = input.refreshToken ? encryptToken(input.refreshToken) : undefined
  const now = new Date()

  const rows = await db.insert(connectedAccounts).values({
    userId: input.userId,
    provider: input.provider,
    providerAccountId: input.providerAccountId,
    accountEmail: input.accountEmail,
    displayName: input.displayName,
    scopes: input.scopes,
    encryptedAccessToken,
    encryptedRefreshToken,
    tokenExpiresAt: input.tokenExpiresAt,
    status: 'connected',
    lastHealthCheckAt: now,
    updatedAt: now,
  }).onConflictDoUpdate({
    target: [connectedAccounts.userId, connectedAccounts.provider, connectedAccounts.providerAccountId],
    set: {
      accountEmail: input.accountEmail,
      displayName: input.displayName,
      scopes: input.scopes,
      encryptedAccessToken,
      encryptedRefreshToken,
      tokenExpiresAt: input.tokenExpiresAt,
      status: 'connected',
      lastHealthCheckAt: now,
      updatedAt: now,
    },
  }).returning()

  return rows[0] ?? null
}

export async function getConnectedAccountForUser(userId: string, connectedAccountId: string) {
  const rows = await db.select().from(connectedAccounts).where(and(
    eq(connectedAccounts.userId, userId),
    eq(connectedAccounts.id, connectedAccountId),
  )).limit(1)

  return rows[0] ?? null
}

export async function listConnectedAccountsForUser(userId: string) {
  return db.select({
    id: connectedAccounts.id,
    provider: connectedAccounts.provider,
    providerAccountId: connectedAccounts.providerAccountId,
    accountEmail: connectedAccounts.accountEmail,
    displayName: connectedAccounts.displayName,
    scopes: connectedAccounts.scopes,
    status: connectedAccounts.status,
    tokenExpiresAt: connectedAccounts.tokenExpiresAt,
    lastHealthCheckAt: connectedAccounts.lastHealthCheckAt,
    lastSignalSyncAt: connectedAccounts.lastSignalSyncAt,
    createdAt: connectedAccounts.createdAt,
    updatedAt: connectedAccounts.updatedAt,
  }).from(connectedAccounts).where(eq(connectedAccounts.userId, userId))
}

export function decryptConnectedAccountAccessToken(account: { encryptedAccessToken: string }) {
  return decryptToken(account.encryptedAccessToken)
}

export async function storeConnectedAccountSignals(connectedAccountId: string, signals: ConnectorSignal[]) {
  if (signals.length === 0) return []

  const rows = await db.insert(connectedAccountSignals).values(signals.map((signal) => ({
    connectedAccountId,
    signalType: signal.type,
    sourceType: signal.id.includes('gmail') ? 'gmail' : 'calendar',
    sourceRef: signal.id,
    title: signal.title,
    summary: signal.summary,
    confidence: signal.confidence.toFixed(2),
    occurredAt: new Date(signal.occurredAt),
    metadataJson: {
      suggestedQueueAction: signal.suggestedQueueAction,
      sourceAccountId: signal.accountId,
    },
  }))).returning()

  await db.update(connectedAccounts).set({
    lastSignalSyncAt: new Date(),
    updatedAt: new Date(),
  }).where(eq(connectedAccounts.id, connectedAccountId))

  return rows
}
