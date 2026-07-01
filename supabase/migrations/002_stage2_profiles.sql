-- Stage 2: Optional user profiles

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  display_name text,
  is_public boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  message text NOT NULL,
  skill_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Profiles: public read for public profiles, users manage own
CREATE POLICY "public_read_profiles" ON profiles
  FOR SELECT TO anon, authenticated
  USING (is_public = true);

CREATE POLICY "users_read_own_profile" ON profiles
  FOR SELECT TO authenticated
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "users_insert_own_profile" ON profiles
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "users_update_own_profile" ON profiles
  FOR UPDATE TO authenticated
  USING ((SELECT auth.uid()) = id)
  WITH CHECK ((SELECT auth.uid()) = id);

CREATE POLICY "service_all_profiles" ON profiles
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Contact messages: users insert own, service reads all
CREATE POLICY "users_insert_contact" ON contact_messages
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT auth.uid()) = user_id);

CREATE POLICY "service_all_contact" ON contact_messages
  FOR ALL TO service_role USING (true) WITH CHECK (true);

GRANT SELECT ON profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON profiles TO authenticated;
GRANT INSERT ON contact_messages TO authenticated;

-- User skill stats view (for profiles)
CREATE OR REPLACE VIEW user_skill_stats AS
SELECT
  user_id,
  skill_id,
  COUNT(*) FILTER (WHERE event_type = 'copy')::int AS copies,
  COUNT(*) FILTER (WHERE event_type = 'github_click')::int AS github_clicks,
  COUNT(*) FILTER (WHERE event_type = 'install_yes')::int AS installs_yes,
  COUNT(*) FILTER (WHERE event_type = 'install_no')::int AS installs_no
FROM skill_events
WHERE user_id IS NOT NULL
GROUP BY user_id, skill_id;

GRANT SELECT ON user_skill_stats TO authenticated, service_role;

-- Function to link session events to user on login
CREATE OR REPLACE FUNCTION link_session_to_user(p_session_id text, p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (SELECT auth.uid()) IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  UPDATE skill_events SET user_id = p_user_id
  WHERE session_id = p_session_id AND user_id IS NULL;

  UPDATE skill_feedback SET user_id = p_user_id
  WHERE session_id = p_session_id AND user_id IS NULL;
END;
$$;

REVOKE ALL ON FUNCTION link_session_to_user(text, uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION link_session_to_user(text, uuid) TO authenticated;
