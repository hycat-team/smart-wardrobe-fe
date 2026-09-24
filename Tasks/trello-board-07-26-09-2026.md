# Smart Wardrobe - Trello Board 07/09/2026 -> 26/09/2026 (Web + Mobile)

> Mục đích: thể hiện khối lượng đã hoàn thành + còn dở để báo cáo. Copy nguyên cấu trúc này lên Trello.
> Quy ước Label: `[Chính]` = Epic/luồng chính, `[Phụ]` = sub-task, `DONE` / `DOING` / `BACKLOG`

## LIST 1: Sprint 1 - 07/09-12/09 - Foundation Web + Mobile (DONE)

### [Chính] WEB-01 Auth + Onboarding - Due 09/09 - DONE
- [Phụ] Login/logout/profile + BFF proxy HttpOnly cookie (`src/app/api/auth/*`, `features/auth/`) - 07/09 DONE
- [Phụ] Register 2 bước + Preferences khảo sát style (`(guest)/auth/register`) - 08/09 DONE
- [Phụ] Forgot-password page (thiếu confirm/reset) - 08/09 DONE 80%
- [Phụ] Middleware silent-refresh 401 + AuthProvider hydrate (`src/middleware.ts`) - 09/09 DONE hotfix 4c144b8

### [Chính] WEB-02 Wardrobe Tủ đồ - Due 12/09 - DONE
- [Phụ] List/filter/sort URL-state + Grid (`wardrobe/page.tsx`, `WardrobeClient`) - 10/09 DONE
- [Phụ] Upload Cloudinary signed (`lib/cloudinary.ts`) - 11/09 DONE
- [Phụ] SSE realtime upload (`useWardrobeSSE.ts`) - 12/09 DONE FE, BE còn thiếu header/heartbeat (Note.md)
- [Phụ] Detail/Edit/Sell + Explore catalog - 12/09 DONE

### [Chính] MOB-01 Foundation Flutter - Due 10/09 - DONE
- [Phụ] `flutter create smart-wardrobe-mobile`, pubspec Dio/go_router/Riverpod/Firebase - 07/09 DONE
- [Phụ] AppColors từ globals.css + ThemeData Material3 + BeVietnamPro - 08/09 DONE
- [Phụ] GoRouter 5 tabs Wardrobe/Outfits/AI/Market/Profile + redirect guard - 10/09 DONE

### [Chính] MOB-02 Auth Mobile - Due 12/09 - DONE 100%
- [Phụ] Login direct BE + SecureStorage + Dio refresh - 10/09 DONE
- [Phụ] Register OTP 6 số + Preferences 10 styles + Forgot 3 bước - 11/09 DONE
- [Phụ] Profile menu + Logout - 12/09 DONE

## LIST 2: Sprint 2 - 13/09-19/09 - Core Value (DONE)

### [Chính] WEB-03 Outfits Studio - Due 14/09 - DONE
- [Phụ] List outfits (`outfits/page.tsx`) - 13/09 DONE
- [Phụ] Canvas drag-drop create (`OutfitCanvasBoard`, `useOutfitCanvas`) - 13/09 DONE
- [Phụ] Detail + Delete (`outfits/[id]`) - 14/09 DONE

### [Chính] WEB-04 AI Stylist - Due 15/09 - DONE
- [Phụ] SSE stream chat + sessions/messages (`features/ai-stylist/`, `GlobalAIChat`) - 14/09 DONE
- [Phụ] Token `[ACTION:REDIRECT_OUTFIT]` accumulate chunks - 15/09 DONE

### [Chính] WEB-05 Marketplace/Commerce - Due 17/09 - DONE UI
- [Phụ] Marketplace feed + Product detail + Search - 15/09 DONE UI
- [Phụ] CartDrawer + Cart + Checkout (`cart/`, `checkout/`) - 16/09 DONE UI
- [Phụ] Purchases + Returns request + Pricing display - 16/09 DONE UI
- [Phụ] Billing vs Wallet trùng nhau - quyết định gộp (BACKLOG -> DOING 23/09)

### [Chính] WEB-06 Community - Due 18/09 - DONE
- [Phụ] Feed + BrandDiscovery + CreatePostModal - 17/09 DONE
- [Phụ] Post detail like/comment/share (`posts/[postPublicId]`) - 18/09 DONE

### [Chính] MOB-03 Wardrobe Mobile - Due 16/09 - DONE
- [Phụ] SliverGrid 2 cột + FilterChip + RefreshIndicator - 14/09 DONE
- [Phụ] Camera image_picker + Cloudinary MultipartFile + SSE progress - 15/09 DONE
- [Phụ] Detail SliverAppBar + Edit/Sell - 16/09 DONE

### [Chính] MOB-04 Outfits + AI Mobile - Due 19/09 - DONE
- [Phụ] OutfitsList + BottomSheet detail + Mở Trên Studio + Delete - 18/09 DONE
- [Phụ] Auto-redirect sau lưu ai-studio -> /outfits - 19/09 DONE
- [Phụ] AI chat ListView reverse + OutfitSuggestionCard, quota 5/5 - 19/09 DONE

## LIST 3: Sprint 3 - 20/09-26/09 - Brand/Admin/Mobile Finish (DOING)

### [Chính] WEB-07 Brand Portal + Loyalty/Benefits - Due 21/09 - DOING 85%
- [Phụ] Dashboard/orders/products/posts/profile/members/customers/chat - 20/09 DONE
- [Phụ] task02 breaking: `data.items`, `brand.id/name/slug/logo`, bỏ status/totalCustomer - 20/09 DONE code, cần regression
- [Phụ] task.md Benefit tách point_redemption vs tier_privilege + paginated - 21/09 DONE 90%
- [Phụ] task01 Loyalty 12 màn user+brand, POS earn/FIFO/expire/Tier recalc - 21/09 DOING
- [Phụ] Digital Sample Lab upload/cohort/report (`digital-sample-lab/*`) - BACKLOG, mới route

### [Chính] WEB-08 Admin - Due 22/09 - DONE 70%
- [Phụ] Dashboard KPI/AI-margin/PayOS/AIEvents - DONE
- [Phụ] Users/sessions, Brands approval, Category, System wardrobe, Moderation, Trends - DONE
- [Phụ] Thiếu: plans CRUD, transactions resolve, AI pricing/grants/usage, audit-logs (ROUTE.md có, FE chưa) - BACKLOG

### [Chính] MOB-05 Marketplace/Cart/Community/Profile Mobile - Due 24/09 - DONE UI
- [Phụ] Marketplace infinite scroll + Product PageView + haptic - 22/09 DONE
- [Phụ] Cart + Checkout WebView + Orders + Search + Wallet - 23/09 DONE UI
- [Phụ] Community double-tap like + comment sheet - 23/09 DONE

### [Chính] WEB-09 Ghost Closet + UI System - Due 26/09 - DOING
- [Phụ] Toggle Mix with Brands + GhostItemBadge + ImpactPanel (mock) - 23/09 DOING
- [Phụ] Sample Lab report charts + variant compare - 24/09 BACKLOG
- [Phụ] Rounded refactor BeVietnamPro rounded-2xl/full/xl (plan.md) - 25-26/09 DOING dở
- [Phụ] Gộp billing/wallet, xóa users/ rỗng, update rout-fe.md drift, xóa scratch.js - 26/09 DOING

### [Chính] QA/Test - Due 26/09 - DOING
- [Phụ] Jest hiện có: axios, wardrobe, dashboard, brand-dashboard, OutfitCanvas - DONE
- [Phụ] Thiếu: loyalty, community, outfits, auth - BACKLOG
- [Phụ] Mobile Patrol Auth/Outfit CRUD 4/4 pass + manual Pixel8/iPhone15/3G/offline - 25/09 DOING

## Cách đưa lên Trello
1. Tạo Board "Smart Wardrobe 07-26/09/2026"
2. Tạo 3 Lists đúng tên Sprint 1/2/3 ở trên
3. Mỗi `[Chính]` = 1 Card, `[Phụ]` = Checklist trong Card
4. Set Due date + Label DONE (xanh)/DOING (vàng)/BACKLOG (xám)
5. Attach file này + CSV kèm theo để reviewer kiểm chứng route/file
