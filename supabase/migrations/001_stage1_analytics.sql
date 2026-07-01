-- Stage 1: Global analytics (anonymous OK)

CREATE TABLE IF NOT EXISTS skill_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id text NOT NULL,
  event_type text NOT NULL CHECK (event_type IN ('copy', 'github_click', 'install_yes', 'install_no')),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skill_events_skill_id ON skill_events(skill_id);
CREATE INDEX IF NOT EXISTS idx_skill_events_created_at ON skill_events(created_at);
CREATE INDEX IF NOT EXISTS idx_skill_events_user_id ON skill_events(user_id);
CREATE INDEX IF NOT EXISTS idx_skill_events_session_id ON skill_events(session_id);

CREATE TABLE IF NOT EXISTS skill_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id text NOT NULL,
  vote smallint NOT NULL CHECK (vote IN (-1, 1)),
  session_id text NOT NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (skill_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_skill_feedback_skill_id ON skill_feedback(skill_id);

-- Aggregated stats view
CREATE OR REPLACE VIEW skill_stats_agg AS
SELECT
  skill_id,
  COUNT(*) FILTER (WHERE event_type = 'copy')::int AS copies,
  COUNT(*) FILTER (WHERE event_type = 'github_click')::int AS github_clicks,
  COUNT(*) FILTER (WHERE event_type = 'install_yes')::int AS installs_yes,
  COUNT(*) FILTER (WHERE event_type = 'install_no')::int AS installs_no
FROM skill_events
GROUP BY skill_id;

CREATE OR REPLACE VIEW skill_feedback_agg AS
SELECT
  skill_id,
  COUNT(*) FILTER (WHERE vote = 1)::int AS likes,
  COUNT(*) FILTER (WHERE vote = -1)::int AS dislikes
FROM skill_feedback
GROUP BY skill_id;

-- RLS
ALTER TABLE skill_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_feedback ENABLE ROW LEVEL SECURITY;

-- Service role / API routes insert via service key; anon reads aggregates via API only.
-- Direct anon insert blocked — all writes go through API routes with service role.

CREATE POLICY "service_insert_events" ON skill_events
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "service_select_events" ON skill_events
  FOR SELECT TO service_role USING (true);

CREATE POLICY "service_insert_feedback" ON skill_feedback
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "service_update_feedback" ON skill_feedback
  FOR UPDATE TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "service_select_feedback" ON skill_feedback
  FOR SELECT TO service_role USING (true);

GRANT SELECT ON skill_stats_agg TO service_role;
GRANT SELECT ON skill_feedback_agg TO service_role;
