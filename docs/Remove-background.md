# SMART WARDROBE — IMAGE BACKGROUND REMOVAL PIPELINE

# Overview

This document describes the production-ready image upload and background removal pipeline for the Smart Wardrobe project using:

* Next.js
* Cloudinary
* remove.bg API
* PostgreSQL
* Queue Processing (BullMQ or Inngest)

The goal is to:

* Upload clothing images
* Remove image background automatically
* Store optimized transparent PNG/WebP images
* Serve images efficiently via CDN
* Minimize API costs
* Support scalable production architecture

---

# Recommended Architecture

```txt
Frontend (Next.js)
        ↓
Upload API Route
        ↓
Cloudinary Store Original Image
        ↓
Background Removal Queue
        ↓
remove.bg API
        ↓
Processed Transparent Image
        ↓
Cloudinary CDN
        ↓
Save URLs into PostgreSQL
```

---

# Tech Stack

| Component          | Technology                |
| ------------------ | ------------------------- |
| Frontend           | Next.js App Router        |
| Backend API        | Next.js Route Handlers    |
| Image Storage      | Cloudinary                |
| Background Removal | remove.bg                 |
| Database           | PostgreSQL                |
| Queue System       | BullMQ / Redis OR Inngest |
| Deployment         | Vercel                    |
| ORM                | Prisma                    |

---

# Folder Structure

```txt
src/
├── app/
│   ├── api/
│   │   ├── upload/
│   │   │   └── route.ts
│   │   ├── remove-bg/
│   │   │   └── route.ts
│
├── lib/
│   ├── cloudinary.ts
│   ├── removeBg.ts
│   ├── queue.ts
│
├── services/
│   ├── image.service.ts
│
├── prisma/
│   ├── schema.prisma
```

---

# Environment Variables

```env
# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# remove.bg
REMOVE_BG_API_KEY=

# Database
DATABASE_URL=

# Redis (BullMQ)
REDIS_URL=
```

---

# Step 1 — Upload Original Image

User uploads:

* shirt
* pants
* dress
* outfit image

The frontend sends image to:

```txt
POST /api/upload
```

---

# Upload Flow

```txt
User Upload
    ↓
Validate file
    ↓
Resize image
    ↓
Upload original image to Cloudinary
    ↓
Save original URL
    ↓
Push queue job for background removal
```

---

# Recommended Upload Validation

## Allowed Types

```txt
image/png
image/jpeg
image/webp
```

---

## Max Size

```txt
10MB
```

---

# Recommended Preprocessing

Before sending image to remove.bg:

## Resize Image

Recommended max width:

```txt
1024px
```

Reason:

* Faster upload
* Lower API cost
* Faster processing
* Enough quality for wardrobe UI

---

# Step 2 — Queue Background Removal

DO NOT process background removal directly during upload request.

Bad:

```txt
Upload → Wait 10 seconds
```

Good:

```txt
Upload → Return success immediately
        → Process asynchronously
```

---

# Queue Payload

```ts
{
  itemId: string,
  originalImageUrl: string
}
```

---

# Step 3 — Remove Background

Worker receives queue job:

```txt
Original Image URL
        ↓
Download image
        ↓
Send to remove.bg API
        ↓
Receive transparent PNG
```

---

# remove.bg API Endpoint

```txt
https://api.remove.bg/v1.0/removebg
```

---

# Recommended remove.bg Settings

| Setting | Value |
| ------- | ----- |
| size    | auto  |
| format  | png   |
| type    | auto  |

---

# Step 4 — Upload Processed Image to Cloudinary

After remove.bg processing:

```txt
Transparent PNG
      ↓
Upload to Cloudinary
      ↓
Enable CDN optimization
```

---

# Recommended Cloudinary Folder Structure

```txt
smart-wardrobe/
├── original/
├── processed/
```

Example:

```txt
smart-wardrobe/original/shirt-001.jpg
smart-wardrobe/processed/shirt-001.png
```

---

# Step 5 — Optimize Final Image

Use Cloudinary transformations:

```txt
f_auto,q_auto
```

Benefits:

* Automatic WebP/AVIF conversion
* Reduced bandwidth
* Faster loading

---

# Final CDN URL Example

```txt
https://res.cloudinary.com/xxx/image/upload/f_auto,q_auto/v123/shirt.png
```

---

# Database Design

## WardrobeItem Table

```prisma
model WardrobeItem {
  id                 String   @id @default(uuid())
  name               String
  originalImageUrl   String
  processedImageUrl  String?
  processingStatus   String
  createdAt          DateTime @default(now())
}
```

---

# Processing Status

| Status     | Meaning                 |
| ---------- | ----------------------- |
| pending    | Waiting for queue       |
| processing | remove.bg is processing |
| completed  | Finished successfully   |
| failed     | Processing failed       |

---

# Recommended Frontend UX

## Upload Phase

Show:

* loading spinner
* upload progress

---

## Processing Phase

Show:

```txt
Processing image...
Removing background...
```

---

## Completed Phase

Display:

* transparent wardrobe item
* success animation
* preview card

---

# Cost Optimization Strategies

# 1. Process Only Once

DO NOT call remove.bg repeatedly.

Bad:

```txt
Every page refresh → remove.bg
```

Good:

```txt
Upload once
Process once
Cache forever
```

---

# 2. Resize Before Processing

Recommended:

```txt
1024px max width
```

NOT:

```txt
4000px original image
```

---

# 3. Use Queue System

Avoid:

* server timeout
* blocking requests
* bad UX

---

# 4. Cache Processed Images

Store:

* processed URL
* transparent image permanently

Never regenerate unless needed.

---

# 5. Use CDN Delivery

Cloudinary CDN reduces:

* bandwidth
* latency
* server load

---

# Error Handling

## Common Failures

| Error             | Solution                       |
| ----------------- | ------------------------------ |
| remove.bg timeout | Retry queue job                |
| invalid image     | Validate MIME type             |
| upload failed     | Retry Cloudinary upload        |
| quota exceeded    | Disable processing temporarily |

---

# Recommended Retry Strategy

```txt
Max retries: 3
Delay: exponential backoff
```

---

# Security Recommendations

## Validate Uploads

Always validate:

* MIME type
* file size
* image dimensions

---

## Rate Limiting

Prevent abuse:

```txt
10 uploads / minute / user
```

---

## Protect API Keys

Never expose:

* remove.bg API key
* Cloudinary secret

Use server-side environment variables only.

---

# Scalability Plan

## MVP Stage

Use:

* remove.bg
* Cloudinary
* simple queue

---

## Growth Stage

Add:

* Redis queue
* worker server
* image analytics

---

## Large Scale Stage

Replace remove.bg with:

* self-hosted segmentation model
* BiRefNet
* custom GPU service

---

# Final Recommendation

For Smart Wardrobe student production project:

## Best Combination

| Purpose            | Technology       |
| ------------------ | ---------------- |
| Upload & CDN       | Cloudinary       |
| Background Removal | remove.bg        |
| Frontend           | Next.js          |
| Queue              | BullMQ / Inngest |
| Database           | PostgreSQL       |

This architecture provides:

* fast implementation
* production-like workflow
* scalable image processing
* professional deployment architecture
* excellent demo quality
