-- Migration 003: Tighten profile RLS to prevent role self-elevation

-- Drop the old blanket policy
DROP POLICY IF EXISTS "Own profile" ON profiles;

-- Allow users to read their own profile
CREATE POLICY "profiles_select_own"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Allow users to insert their own profile (needed for trigger fallback path)
CREATE POLICY "profiles_insert_own"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- Allow users to update their own profile, but role must not change
-- USING: row being updated must belong to this user
-- WITH CHECK: after update, role must equal the pre-update role
CREATE POLICY "profiles_update_own_no_role_change"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (
    id = auth.uid()
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- No DELETE policy — users cannot delete their own profile
-- (deletion happens via cascade from auth.users if user is deleted)
