
# Design Marketplace (Free + Paid)

Enable users to list their certificate/card designs for sale (free or paid). Buyers pay via the existing Stripe integration; sellers accumulate earnings in an in-app wallet.

## Database (new tables)

- **marketplace_listings**
  - `design_id` (FK → designs), `seller_id`, `title`, `description`, `type` (card/certificate), `preview_url`, `price_cents` (0 = free), `is_published`, `sales_count`
- **purchases**
  - `buyer_id`, `listing_id`, `seller_id`, `price_cents`, `seller_earning_cents` (price minus 20% platform fee), `stripe_session_id`, `status`
  - On success: clones the listing's `design_data` into a new row in `designs` owned by the buyer (editable copy + downloadable).
- **wallets**
  - `user_id` (unique), `balance_cents`, `lifetime_earnings_cents`
- **wallet_transactions**
  - `user_id`, `amount_cents`, `type` (sale/payout_request/adjustment), `purchase_id`, `note`
- **payout_requests**
  - `user_id`, `amount_cents`, `status` (pending/approved/rejected/paid), `payout_method`, `notes`

RLS: sellers manage own listings; published listings readable by all authenticated users; purchases/wallets visible only to owner; service_role writes wallet/purchases.

## Edge Functions

- `create-marketplace-checkout` — creates a Stripe Checkout session for a paid listing (free listings skip Stripe and go straight to clone).
- `marketplace-webhook` — on `checkout.session.completed`: insert purchase, clone design to buyer, credit seller wallet (80%), insert wallet_transaction. (Reuse existing Stripe secret.)
- `request-payout` — validates balance ≥ minimum (e.g. 1000¢), deducts balance, creates payout_request.

## Frontend (new pages/components)

- **/marketplace** — browse grid, filter by type (cards/certificates), sort by newest/popular, free/paid toggle, search.
- **/marketplace/:id** — listing detail with preview, price, "Get free" or "Buy" button, seller name.
- **/marketplace/sell** — seller dashboard:
  - "List a design" modal: pick from user's existing designs, set title/description/price.
  - Manage listings (edit price, unpublish, view sales count).
- **/wallet** — balance, lifetime earnings, transaction history, "Request payout" form.
- **My Purchases** section in dashboard — shows cloned editable copies.
- Add **"Sell this design"** quick-action in the Card and Certificate editors.

## Pricing model

- Free listings allowed (price_cents = 0). Buyers click "Get" → instant clone.
- Paid: 80% to seller wallet, 20% platform fee. Min payout 1000¢.

## Out of scope (v1)

- Automatic payouts (Stripe Connect) — handled manually from admin for now.
- Reviews/ratings, refunds UI, featured listings.

## Files to add (high level)

- `supabase/migrations/<ts>_marketplace.sql`
- `supabase/functions/create-marketplace-checkout/index.ts`
- `supabase/functions/marketplace-webhook/index.ts`
- `supabase/functions/request-payout/index.ts`
- `src/pages/Marketplace.tsx`, `MarketplaceListing.tsx`, `SellerDashboard.tsx`, `Wallet.tsx`
- `src/components/marketplace/*` (ListingCard, ListDesignDialog, PayoutDialog)
- Routes in `App.tsx`, nav links in main layout, "Sell" buttons in card/certificate editors.

Approve to proceed and I'll implement.
