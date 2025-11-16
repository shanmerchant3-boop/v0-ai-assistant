-- Insert products
INSERT INTO public.products (name, slug, description, long_description, price, category, image_url, features, variants, stock_count, active) VALUES
(
  'Valorant Pro',
  'valorant-pro',
  'Enhanced Valorant gameplay with advanced features',
  'The ultimate tool for competitive Valorant play. Features include aim assist, radar hacks, and advanced settings customization.',
  49.99,
  'Gaming Tools',
  '/valorant-pro-gaming-tool.jpg',
  '["Enhanced Gameplay", "Advanced Settings", "24/7 Support", "Monthly Updates"]'::jsonb,
  '["Monthly", "Yearly"]'::jsonb,
  999,
  TRUE
),
(
  'Permanent HWID Spoofer',
  'permanent-hwid-spoofer',
  'Hardware ID spoofing tool for account security',
  'Mask your HWID and stay undetected. Perfect for players who need to protect their accounts.',
  39.99,
  'Security Tools',
  '/hwid-spoofer-security-tool.jpg',
  '["Undetected", "Instant Delivery", "Lifetime License", "24/7 Support"]'::jsonb,
  '["Lifetime", "6-Month", "3-Month"]'::jsonb,
  999,
  TRUE
)
ON CONFLICT (slug) DO NOTHING;
