GRANT SELECT ON public.marketplace_listings TO anon;

CREATE POLICY "Public can view published listings"
ON public.marketplace_listings
FOR SELECT
TO anon
USING (is_published = true);