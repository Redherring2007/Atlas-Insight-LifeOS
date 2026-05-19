CREATE TABLE IF NOT EXISTS twin_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  status text NOT NULL DEFAULT 'default',
  summary text,
  traits_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  scenario_responses_json jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS twin_feedback_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  twin_profile_id uuid REFERENCES twin_profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  target_type text NOT NULL,
  target_id text NOT NULL,
  instruction text,
  before_text text,
  after_text text,
  created_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS command_queue_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  action_type text NOT NULL,
  section text NOT NULL,
  title text NOT NULL,
  context text,
  proposed_output text,
  confidence decimal(3, 2) DEFAULT '0.50',
  urgency text NOT NULL DEFAULT 'medium',
  risk_level text NOT NULL DEFAULT 'low',
  source_signal text,
  suggested_next_step text,
  status text NOT NULL DEFAULT 'ready',
  metadata_json jsonb DEFAULT '{}'::jsonb,
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS draft_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  command_queue_action_id uuid REFERENCES command_queue_actions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  draft_type text NOT NULL,
  recipient_ref text,
  subject text,
  body text NOT NULL,
  source_signal text,
  status text NOT NULL DEFAULT 'prepared',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS schedule_suggestions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  command_queue_action_id uuid REFERENCES command_queue_actions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  title text NOT NULL,
  reason text,
  proposed_window text,
  confidence decimal(3, 2) DEFAULT '0.50',
  risk_level text NOT NULL DEFAULT 'low',
  status text NOT NULL DEFAULT 'proposed',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

CREATE TABLE IF NOT EXISTS approval_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  command_queue_action_id uuid REFERENCES command_queue_actions(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id),
  approval_event text NOT NULL,
  instruction text,
  created_at timestamp DEFAULT now()
);

CREATE INDEX IF NOT EXISTS twin_profiles_user_idx
  ON twin_profiles(user_id, status);

CREATE INDEX IF NOT EXISTS twin_feedback_user_target_idx
  ON twin_feedback_events(user_id, target_type, target_id);

CREATE INDEX IF NOT EXISTS command_queue_actions_user_status_idx
  ON command_queue_actions(user_id, status, section);

CREATE INDEX IF NOT EXISTS draft_messages_action_idx
  ON draft_messages(command_queue_action_id, status);

CREATE INDEX IF NOT EXISTS schedule_suggestions_action_idx
  ON schedule_suggestions(command_queue_action_id, status);

CREATE INDEX IF NOT EXISTS approval_actions_action_idx
  ON approval_actions(command_queue_action_id, created_at DESC);
