-- Profiles policies
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "profiles_select_public" ON public.profiles FOR SELECT USING (TRUE);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "profiles_delete_own" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- Products policies (public read, admin write)
CREATE POLICY "products_select_all" ON public.products FOR SELECT USING (TRUE);
CREATE POLICY "products_insert_admin" ON public.products FOR INSERT WITH CHECK (FALSE);
CREATE POLICY "products_update_admin" ON public.products FOR UPDATE USING (FALSE);
CREATE POLICY "products_delete_admin" ON public.products FOR DELETE USING (FALSE);

-- Orders policies (users can see their own)
CREATE POLICY "orders_select_own" ON public.orders FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "orders_insert_own" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Order Items policies
CREATE POLICY "order_items_select_own" ON public.order_items FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- Promo codes policies
CREATE POLICY "promo_codes_select_active" ON public.promo_codes FOR SELECT USING (active = TRUE);

-- Reviews policies
CREATE POLICY "reviews_select_all" ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "reviews_insert_own" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "reviews_delete_own" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- Wishlist policies
CREATE POLICY "wishlist_select_own" ON public.wishlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "wishlist_insert_own" ON public.wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "wishlist_delete_own" ON public.wishlist FOR DELETE USING (auth.uid() = user_id);

-- Support tickets policies
CREATE POLICY "tickets_select_own" ON public.support_tickets FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "tickets_insert_own" ON public.support_tickets FOR INSERT WITH CHECK (auth.uid() = user_id);
