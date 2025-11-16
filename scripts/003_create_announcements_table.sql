-- Create announcements table to store site-wide announcements
CREATE TABLE IF NOT EXISTS announcements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  message text NOT NULL,
  link_text text NOT NULL DEFAULT 'Learn More',
  link_url text NOT NULL,
  subtitle text,
  is_active boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read active announcements
DROP POLICY IF EXISTS "announcements_select_active" ON announcements;
CREATE POLICY "announcements_select_active" ON announcements
  FOR SELECT
  USING (is_active = true);

-- Insert default announcement
INSERT INTO announcements (message, link_text, link_url, subtitle, is_active)
VALUES (
  'Join our Discord community for exclusive updates and support! 🎮',
  'discord.gg/zaliantud',
  'https://discord.gg/zaliantud',
  'get exclusive perks and early access to new products',
  true
)
ON CONFLICT DO NOTHING;
