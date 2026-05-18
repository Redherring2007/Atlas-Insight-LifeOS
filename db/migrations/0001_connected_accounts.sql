CREATE TABLE IF NOT EXISTS connected_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  provider text NOT NULL,
  provider_account_id text NOT NULL,
  account_email text,
  display_name text,
  scopes jsonb NOT NULL DEFAULT '[]'::jsonb,
  encrypted_access_token text NOT NULL,
  encrypted_refresh_token text,
  token_expires_at timestamp,
  status text NOT NULL DEFAULT 'connected',
  last_health_check_at timestamp,
  last_signal_sync_at timestamp,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now(),
  UNIQUE (user_id, provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS connected_account_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connected_account_id uuid REFERENCES connected_accounts(id) ON DELETE CASCADE,
  signal_type text NOT NULL,
  source_type text NOT NULL,
  source_ref text,
  title text NOT NULL,
  summary text,
  confidence decimal(3, 2) DEFAULT '0.50',
  occurred_at timestamp,
  metadata_json jsonb,
  created_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS connected_accounts_user_provider_idx
  ON connected_accounts(user_id, provider, status);

CREATE INDEX IF NOT EXISTS connected_account_signals_account_idx
  ON connected_account_signals(connected_account_id, occurred_at DESC);
