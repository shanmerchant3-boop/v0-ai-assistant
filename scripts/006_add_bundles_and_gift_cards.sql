-- Bundle Deals table
CREATE TABLE IF NOT EXISTS public.bundles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  product_ids UUID[] NOT NULL,
  original_price DECIMAL(10, 2) NOT NULL,
  bundle_price DECIMAL(10, 2) NOT NULL,
  discount_percent DECIMAL(5, 2),
  active BOOLEAN DEFAULT TRUE,
  valid_until TIMESTAMP,
  max_purchases INT,
  current_purchases INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Gift Cards table
CREATE TABLE IF NOT EXISTS public.gift_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  balance DECIMAL(10, 2) NOT NULL,
  purchased_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  used_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'active',
  expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  used_at TIMESTAMP
);

-- Gift Card Transactions
CREATE TABLE IF NOT EXISTS public.gift_card_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gift_card_id UUID REFERENCES public.gift_cards(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID REFERENCES public.orders(id) ON DELETE SET NULL,
  amount DECIMAL(10, 2) NOT NULL,
  transaction_type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.bundles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gift_card_transactions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Bundles are viewable by everyone"
  ON public.bundles FOR SELECT
  USING (active = true);

CREATE POLICY "Users can view their own gift cards"
  ON public.gift_cards FOR SELECT
  USING (auth.uid() = purchased_by OR auth.uid() = used_by);

CREATE POLICY "Users can view their gift card transactions"
  ON public.gift_card_transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Function to generate gift card code
CREATE OR REPLACE FUNCTION generate_gift_card_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := 'GC-';
  i INTEGER;
BEGIN
  FOR i IN 1..16 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    IF i % 4 = 0 AND i < 16 THEN
      result := result || '-';
    END IF;
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;
