-- KANIRA Data API grants. RLS remains the row-level security boundary.
-- Apply only to the dedicated KANIRA project.
grant usage on schema public to anon, authenticated;
grant select on public.categories, public.products, public.product_variants, public.product_images to anon, authenticated;
grant select on public.product_prices to anon, authenticated;
grant select, insert, update on public.profiles, public.addresses to authenticated;
grant select on public.orders, public.order_items, public.payment_transactions to authenticated;
grant select, insert on public.return_requests, public.product_reviews to authenticated;
grant select on public.store_settings to anon, authenticated;
grant select, insert, update, delete on public.categories, public.products, public.product_prices, public.product_variants, public.product_images to authenticated;
grant select, insert on public.inventory_movements to authenticated;
grant update on public.orders, public.return_requests, public.product_reviews, public.store_settings to authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.set_updated_at() from public, anon, authenticated;
revoke execute on function public.guard_profile_privileges() from public, anon, authenticated;
grant execute on function public.is_admin() to anon, authenticated;
