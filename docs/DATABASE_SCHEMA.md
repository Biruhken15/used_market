# Database Schema Reference

This document maps all the active Mongoose models found in `src/lib/models`.
The application uses **MongoDB** via `mongoose` as its primary persistence mechanism.

## ERD (Entity Relationships) Overview
- **User** 1:1 **Store** (A store requires an `ownerId`).
- **Store** 1:M **Product** (Store has multiple listings).
- **User** 1:M **Conversation** (Multi-party participant system).
- **Conversation** 1:M **Message** (Chats).
- **Store** 1:1 **SubscriptionPlan / UserSubscription**.
- **User** 1:M **Favorite** (Bookmarked products).
- **Store** 1:M **Analytics** (View tracking).

## Table Reference

### 1. `User` Schema
Handles core authenticated accounts, managed via NextAuth and credentials provider.
- **Fields**: `name`, `email` (unique index), `password`, `image`, `role` (enum: user, admin), `createdAt`, `updatedAt`

### 2. `Store` Schema
Represents the seller profile. All sellers must create a store to list a product.
- **Fields**: `ownerId` (ref `User`), `storeType` (enum: personal, business, broker), `sellerName`, `email`, `phone`, `region`, `accountStatus`, `storeLogo`, `storeBanner`. Virtual mapping to the `Product` table via the `storeId`.

### 3. `Product` Schema
Represents market listings. Extensively index-heavy for geo-spatial querying (regions) and marketplace searches.
- **Fields**: `storeId` (ref `Store`), `title`, `description`, `price` (number), `priceType` (fixed, negotiable), `category`, `condition`, `images`, `thumbnail`, `status` (active, sold, inactive), `urgent`, `urgentSetAt`.
- **Note**: Urgent listings have TTL conditions modeled alongside the subscription Tier of the owner.

### 4. `SubscriptionPlan` Schema
Handles premium gates such as Urgent tags or maximum inventory limits.
- **Fields**: `planCode` (FREE_TRIAL, PRO, ENTERPRISE, PLATINUM), `planName`, `price`, `durationMonths`, `features` (limitProducts, activeUrgentTags, verifyBadge).

### 5. `UserSubscription` Schema
Associates a store to an active plan timeframe.
- **Fields**: `userId`, `storeId`, `planId` (ref `SubscriptionPlan`), `status` (active, expired, pending), `currentPeriodStart`, `currentPeriodEnd`.

### 6. `Transaction` Schema
Logs interactions with the payment gateway (Chapa).
- **Fields**: `userId`, `storeId`, `subscriptionPlanId`, `amount`, `paymentMethod` (telebirr, cbe_birr, mpesa), `referenceId` (tx_ref unique string), `status` (pending, completed, failed).

### 7. `Conversation` Schema
Represents a P2P messaging session over a specific listing.
- **Fields**: `participants` (array ref `User`), `productId` (optional ref `Product`), `lastMessage` (ref `Message`), `updatedAt`.

### 8. `Message` Schema
Tracks the individual chat body via Pusher channels.
- **Fields**: `conversationId` (ref `Conversation`), `senderId` (ref `User`), `body`, `readBy` (array ref `User`), `createdAt`.

### 9. `Notification` Schema
Web-based alerts for new messages, system updates, or subscriptions.
- **Fields**: `userId`, `storeId`, `type` (payment_success, generic, system), `title`, `message`, `isRead`, `createdAt`.

### 10. `Favorite` Schema
Allows users to save/bookmark products.
- **Fields**: `userId` (ref `User`), `productIds` (array ref `Product`).

### 11. `Review` Schema
Feedback mechanism between store/buyer.
- **Fields**: `storeId`, `reviewerId`, `rating` (1-5), `comment`.

### 12. `Analytics` Schema
Aggregated tracking matrix.
- **Fields**: `storeId`, `totalViews`, `uniqueVisitors`, `productClicks`, `period` (date map).
