# API Endpoints Documentation

The application exposes a robust set of RESTful APIs configured via Next.js App Router route handlers. All routes are located in `src/app/api/`. 
All secured endpoints expect a valid NextAuth session context initialized via a Bearer Token/Cookie.

## Prefix: `/api`

### 1. **Authentication:** `/auth/[...nextauth]`
- **`GET / POST /api/auth/*`**: Standard NextAuth endpoints (`/signin`, `/signout`, `/session`, `/providers`).
- Handles local credentials and attaches the `userId`, `storeId`, and `planCode` to the JWT.

### 2. **User Profiles:** `/user`
- **`GET /api/user`**: Retrieve active user context.
- **`POST /api/user/register`**: Custom credential signup (hashes password via bcryptjs).

### 3. **Stores:** `/stores`
- **`GET /api/stores`**: Locate store tied to the active session.
- **`POST /api/stores`**: Initialize a new seller profile (Store). Requires `storeType` (business/personal).
- **`PUT /api/stores`**: Update banner and logo via Cloudinary uploads.

### 4. **Products (Marketplace Listings):** `/products`
- **`GET /api/products`**: Fetch all active products. Supports query parameters for `?category`, `?region`, `?search`, `?isUrgent`.
- **`POST /api/products`**: Create a new product. Subject to the `UserSubscription` inventory limits.
- **`GET /api/products/[id]`**: Detail view for a dynamic listing.
- **`PUT /api/products/[id]`**: Modify existing metadata on a product.
- **`DELETE /api/products/[id]`**: Remove listing from indexing.

### 5. **Subscriptions & Payments:** `/subscriptions`
- **`GET /api/subscriptions/plans`**: Free/Pro/Enterprise lists.
- **`POST /api/subscriptions/checkout`**: Initiates a Chapa payment transaction over Telebirr/CBE-Birr/M-Pesa. Returns `tx_ref` and simulated `checkout_url`.
- **`GET /api/subscriptions/verify?tx_ref=[id]`**: Chapa callback receiver to promote the `UserSubscription` status to 'active' and log the generic Webhook parameters.

### 6. **Chat (Pusher Integrated):** `/chat`
- **`GET /api/chat/conversations`**: Grab a list of open messaging channels (p2p) associated with `userId`.
- **`POST /api/chat/conversations`**: Initialize a new `Conversation` thread referencing a `productId`.
- **`GET /api/chat/conversations/[id]`**: Load Chat history.
- **`POST /api/chat/message`**: Inject a new message into the channel context. Triggers a `pusher.trigger()` event for real-time socket propagation.

### 7. **Notifications:** `/notifications`
- **`GET /api/notifications`**: Load all system/payment unread notifications.
- **`PUT /api/notifications/read`**: Bulk updates `isRead: true`.

### 8. **Search / Data Aggregation:** `/search` & `/analytics`
- **`GET /api/search`**: Advanced marketplace querying interface with fallback indexing logic.
- **`GET /api/analytics`**: Fetch store performance dashboard metric arrays.
- **`GET /api/favorites`**: Manage user bookmarked elements (POST/DELETE actions attached directly in dynamic routes).

### 9. **Admin Panel:** `/admin`
- **`GET /api/admin/*`**: Root verification routes for checking total system users, pending transactions, and active enterprise subscriptions lock logic.

## Standard Error Conventions
All failed API requests yield a uniform error format with appropriate HTTP Status codes:
```json
{
  "error": "Reason text."
}
```
