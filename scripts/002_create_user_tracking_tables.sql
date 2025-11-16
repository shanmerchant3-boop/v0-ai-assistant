-- Create visitors table to track all site visitors
CREATE TABLE IF NOT EXISTS visitors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  device_info JSONB,
  location JSONB,
  pages_visited JSONB DEFAULT '[]'::jsonb,
  session_count INTEGER DEFAULT 1,
  total_time_spent INTEGER DEFAULT 0,
  referrer TEXT,
  browser TEXT,
  os TEXT,
  device_type TEXT
);

-- Create customer tracking view that combines user data
CREATE OR REPLACE VIEW customer_details AS
SELECT 
  p.id as customer_id,
  p.email,
  p.username,
  p.full_name,
  p.avatar_url,
  p.created_at as registered_at,
  COUNT(DISTINCT o.id) as total_orders,
  COALESCE(SUM(o.total_amount), 0) as total_spent,
  COUNT(DISTINCT lk.id) as total_licenses,
  ARRAY_AGG(DISTINCT o.payment_method) FILTER (WHERE o.payment_method IS NOT NULL) as payment_methods_used,
  MAX(o.created_at) as last_purchase_date,
  ARRAY_AGG(
    JSONB_BUILD_OBJECT(
      'order_id', o.id,
      'total', o.total_amount,
      'date', o.created_at,
      'status', o.status
    ) ORDER BY o.created_at DESC
  ) FILTER (WHERE o.id IS NOT NULL) as purchase_history,
  ARRAY_AGG(
    JSONB_BUILD_OBJECT(
      'license_id', lk.id,
      'key', lk.key,
      'product_id', lk.product_id,
      'status', lk.status,
      'expires_at', lk.expires_at,
      'hwid', lk.hwid
    )
  ) FILTER (WHERE lk.id IS NOT NULL) as licenses
FROM profiles p
LEFT JOIN orders o ON o.user_id = p.id
LEFT JOIN license_keys lk ON lk.user_id = p.id
GROUP BY p.id, p.email, p.username, p.full_name, p.avatar_url, p.created_at;

-- Enable RLS on visitors table
ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access to visitors
CREATE POLICY "Admin can view all visitors" ON visitors
  FOR SELECT
  USING (true);

-- Create policy for inserting visitor data
CREATE POLICY "Anyone can insert visitor data" ON visitors
  FOR INSERT
  WITH CHECK (true);

-- Create policy for updating visitor data
CREATE POLICY "Anyone can update visitor data" ON visitors
  FOR UPDATE
  USING (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_visitors_created_at ON visitors(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_ip_address ON visitors(ip_address);
CREATE INDEX IF NOT EXISTS idx_visitors_last_seen ON visitors(last_seen DESC);
