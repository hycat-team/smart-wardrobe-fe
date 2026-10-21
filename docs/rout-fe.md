# Danh sÃ¡ch cÃ¡c Route trong Smart Wardrobe Frontend

TÃ i liá»‡u nÃ y tá»•ng há»£p toÃ n bá»™ cÃ¡c route (Ä‘Æ°á»ng dáº«n URL) hiá»‡n cÃ³ trong dá»± Ã¡n Next.js App Router (náº±m trong thÆ° má»¥c `src/app`).

*(LÆ°u Ã½: CÃ¡c pháº§n trong ngoáº·c Ä‘Æ¡n nhÆ° `(guest)` hay `(user)` lÃ  Route Groups cá»§a Next.js, chÃºng khÃ´ng xuáº¥t hiá»‡n trÃªn Ä‘Æ°á»ng dáº«n URL thá»±c táº¿).*

---

## 1. NhÃ³m Route cho KhÃ¡ch / CÃ´ng khai (Guest & Public)
CÃ¡c trang khÃ´ng yÃªu cáº§u xÃ¡c thá»±c hoáº·c cÃ¡c trang trong luá»“ng Ä‘Äƒng nháº­p, Ä‘Äƒng kÃ½ tÃ i khoáº£n.

| ÄÆ°á»ng dáº«n URL | File mÃ£ nguá»“n | MÃ´ táº£ / Chá»©c nÄƒng |
| :--- | :--- | :--- |
| `/` | [page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(guest)/page.tsx) | Trang chá»§ (Landing Page) |
| `/auth/login` | [login/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(guest)/auth/login/page.tsx) | Trang Ä‘Äƒng nháº­p |
| `/auth/register` | [register/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(guest)/auth/register/page.tsx) | Trang Ä‘Äƒng kÃ½ tÃ i khoáº£n |
| `/auth/register/preferences` | [preferences/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(guest)/auth/register/preferences/page.tsx) | Thiáº¿t láº­p sá»Ÿ thÃ­ch cÃ¡ nhÃ¢n khi Ä‘Äƒng kÃ½ |
| `/auth/forgot-password` | [forgot-password/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(guest)/auth/forgot-password/page.tsx) | YÃªu cáº§u khÃ´i phá»¥c máº­t kháº©u |

---

## 2. NhÃ³m Route cho NgÆ°á»i dÃ¹ng (User / Customer)
CÃ¡c tÃ­nh nÄƒng cá»‘t lÃµi dÃ nh cho ngÆ°á»i dÃ¹ng cÃ¡ nhÃ¢n Ä‘á»ƒ quáº£n lÃ½ tá»§ Ä‘á»“, phá»‘i Ä‘á»“, mua sáº¯m vÃ  tÆ°Æ¡ng tÃ¡c cá»™ng Ä‘á»“ng.

### Trang cÃ¡ nhÃ¢n & Mua sáº¯m
| ÄÆ°á»ng dáº«n URL | File mÃ£ nguá»“n | MÃ´ táº£ / Chá»©c nÄƒng |
| :--- | :--- | :--- |
| `/dashboard` | [dashboard/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/dashboard/page.tsx) | Báº£ng Ä‘iá»u khiá»ƒn ngÆ°á»i dÃ¹ng |
| `/profile` | [profile/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/profile/page.tsx) | Trang thÃ´ng tin cÃ¡ nhÃ¢n |
| `/profile/update` | [update/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/profile/update/page.tsx) | Cáº­p nháº­t thÃ´ng tin cÃ¡ nhÃ¢n |
| `/profile/purchases` | [purchases/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/profile/purchases/page.tsx) | Danh sÃ¡ch Ä‘Æ¡n hÃ ng Ä‘Ã£ mua |
| `/cart` | [cart/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/cart/page.tsx) | Giá» hÃ ng mua sáº¯m |
| `/checkout` | [checkout/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/checkout/page.tsx) | Trang thanh toÃ¡n |
| `/returns/request/[orderId]` | [returns/request/[orderId]/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/returns/request/[orderId]/page.tsx) | YÃªu cáº§u Ä‘á»•i tráº£ Ä‘Æ¡n hÃ ng |
| `/settings/wallet` | [wallet/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/settings/wallet/page.tsx) | Quáº£n lÃ½ vÃ­ cÃ¡ nhÃ¢n |

### Quáº£n lÃ½ Tá»§ Ä‘á»“ (Wardrobe)
| ÄÆ°á»ng dáº«n URL | File mÃ£ nguá»“n | MÃ´ táº£ / Chá»©c nÄƒng |
| :--- | :--- | :--- |
| `/wardrobe` | [wardrobe/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/wardrobe/page.tsx) | Tá»§ Ä‘á»“ cÃ¡ nhÃ¢n |
| `/wardrobe/explore` | [explore/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/wardrobe/explore/page.tsx) | KhÃ¡m phÃ¡ & gá»£i Ã½ Ä‘á»“ |
| `/wardrobe/upload` | [upload/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/wardrobe/upload/page.tsx) | Táº£i sáº£n pháº©m lÃªn tá»§ Ä‘á»“ |
| `/wardrobe/item/[id]` | [wardrobe/item/[id]/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/wardrobe/item/[id]/page.tsx) | Chi tiáº¿t má»™t mÃ³n Ä‘á»“ thá»i trang |
| `/wardrobe/item/[id]/edit` | [edit/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/wardrobe/item/[id]/edit/page.tsx) | Sá»­a thÃ´ng tin mÃ³n Ä‘á»“ |
| `/wardrobe/item/[id]/sell` | [sell/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/wardrobe/item/[id]/sell/page.tsx) | ÄÄƒng bÃ¡n mÃ³n Ä‘á»“ lÃªn chá»£ |

### Phá»‘i Ä‘á»“ & Gá»£i Ã½ AI (Outfits & AI Stylist)
| ÄÆ°á»ng dáº«n URL | File mÃ£ nguá»“n | MÃ´ táº£ / Chá»©c nÄƒng |
| :--- | :--- | :--- |
| `/ai-stylist` | [ai-stylist/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/ai-stylist/page.tsx) | Trá»£ lÃ½ phá»‘i Ä‘á»“ áº£o AI |
| `/outfits` | [outfits/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/outfits/page.tsx) | Danh sÃ¡ch bá»™ phá»‘i Ä‘á»“ cá»§a ngÆ°á»i dÃ¹ng |
| `/outfits/create` | [create/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/outfits/create/page.tsx) | SÃ n táº¡o outfit má»›i |
| `/outfits/[id]` | [outfits/[id]/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/outfits/[id]/page.tsx) | Xem chi tiáº¿t má»™t outfit |

### Chá»£ thá»i trang & Cá»™ng Ä‘á»“ng (Marketplace & Community)
| ÄÆ°á»ng dáº«n URL | File mÃ£ nguá»“n | MÃ´ táº£ / Chá»©c nÄƒng |
| :--- | :--- | :--- |
| `/marketplace` | [marketplace/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/marketplace/page.tsx) | SÃ n mua bÃ¡n sáº£n pháº©m |
| `/marketplace/my-listings` | [my-listings/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/marketplace/my-listings/page.tsx) | CÃ¡c sáº£n pháº©m cá»§a tÃ´i Ä‘ang Ä‘Äƒng bÃ¡n |
| `/brands/[id]` | [brands/[id]/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/brands/[id]/page.tsx) | Trang thÃ´ng tin thÆ°Æ¡ng hiá»‡u Ä‘á»‘i tÃ¡c |
| `/products/[id]` | [products/[id]/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/products/[id]/page.tsx) | Trang chi tiáº¿t sáº£n pháº©m thá»i trang |
| `/community` | [community/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/community/page.tsx) | Diá»…n Ä‘Ã n cá»™ng Ä‘á»“ng thá»i trang |
| `/posts/[postPublicId]` | [posts/[postPublicId]/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/(user)/posts/[postPublicId]/page.tsx) | BÃ i viáº¿t chi tiáº¿t trÃªn máº¡ng xÃ£ há»™i |

---

## 3. NhÃ³m Route cho ThÆ°Æ¡ng hiá»‡u / NhÃ£n hÃ ng (Brand)
Cá»•ng quáº£n lÃ½ vÃ  tiáº¿p cáº­n ngÆ°á»i dÃ¹ng dÃ nh cho nhÃ£n hÃ ng thá»i trang.

| ÄÆ°á»ng dáº«n URL | File mÃ£ nguá»“n | MÃ´ táº£ / Chá»©c nÄƒng |
| :--- | :--- | :--- |
| `/brand/dashboard` | [brand/dashboard/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/brand/dashboard/page.tsx) | Báº£ng Ä‘iá»u khiá»ƒn thÆ°Æ¡ng hiá»‡u |
| `/brand/profile` | [brand/profile/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/brand/profile/page.tsx) | Quáº£n lÃ½ há»“ sÆ¡ thÆ°Æ¡ng hiá»‡u |
| `/brand/products` | [brand/products/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/brand/products/page.tsx) | Quáº£n lÃ½ sáº£n pháº©m cá»§a hÃ£ng |
| `/brand/posts` | [brand/posts/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/brand/posts/page.tsx) | Quáº£n lÃ½ bÃ i Ä‘Äƒng truyá»n thÃ´ng thÆ°Æ¡ng hiá»‡u |
| `/brand/customer-care` | [customer-care/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/brand/customer-care/page.tsx) | Cá»•ng há»— trá»£ & ChÄƒm sÃ³c khÃ¡ch hÃ ng |
| `/brand/digital-sample-lab` | [digital-sample-lab/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/brand/digital-sample-lab/page.tsx) | Quáº£n lÃ½ máº«u thiáº¿t káº¿ ká»¹ thuáº­t sá»‘ |
| `/brand/digital-sample-lab/report` | [report/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/brand/digital-sample-lab/report/page.tsx) | Danh sÃ¡ch bÃ¡o cÃ¡o phÃ¢n tÃ­ch máº«u thiáº¿t káº¿ |
| `/brand/digital-sample-lab/report/[sampleId]`| [report/[sampleId]/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/brand/digital-sample-lab/report/[sampleId]/page.tsx) | Xem bÃ¡o cÃ¡o phÃ¢n tÃ­ch chi tiáº¿t cá»§a thiáº¿t káº¿ áº£o |

---

## 4. NhÃ³m Route Quáº£n trá»‹ viÃªn (Admin)
DÃ nh cho ngÆ°á»i quáº£n trá»‹ váº­n hÃ nh toÃ n há»‡ thá»‘ng.

| ÄÆ°á»ng dáº«n URL | File mÃ£ nguá»“n | MÃ´ táº£ / Chá»©c nÄƒng |
| :--- | :--- | :--- |
| `/admin/dashboard` | [admin/dashboard/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/admin/dashboard/page.tsx) | Dashboard tá»•ng quan cá»§a Admin |
| `/admin/users` | [users/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/admin/users/page.tsx) | Quáº£n lÃ½ tÃ i khoáº£n ngÆ°á»i dÃ¹ng vÃ  phÃ¢n quyá»n |
| `/admin/category` | [category/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/admin/category/page.tsx) | Quáº£n lÃ½ danh má»¥c sáº£n pháº©m |
| `/admin/wardrobe` | [admin/wardrobe/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/admin/wardrobe/page.tsx) | Quáº£n lÃ½ vÃ  kiá»ƒm duyá»‡t tá»§ Ä‘á»“ há»‡ thá»‘ng |
| `/admin/moderation` | [moderation/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/admin/moderation/page.tsx) | Kiá»ƒm duyá»‡t ná»™i dung bÃ i Ä‘Äƒng cá»™ng Ä‘á»“ng |
| `/admin/trends` | [trends/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/admin/trends/page.tsx) | Quáº£n lÃ½ danh sÃ¡ch xu hÆ°á»›ng thá»i trang |
| `/admin/trends/new` | [new/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/admin/trends/new/page.tsx) | Táº¡o xu hÆ°á»›ng thá»i trang má»›i |

---

## 5. NhÃ³m API Routes (BFF / Local API)
CÃ¡c route trung gian xá»­ lÃ½ session, cookie vÃ  token phÃ­a mÃ¡y chá»§ (Next.js server-side routes).

| ÄÆ°á»ng dáº«n API | File mÃ£ nguá»“n | MÃ´ táº£ / Chá»©c nÄƒng |
| :--- | :--- | :--- |
| `/api/auth/login` | [login/route.ts](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/api/auth/login/route.ts) | Endpoint lÆ°u session / thiáº¿t láº­p httpOnly cookie |
| `/api/auth/logout` | [logout/route.ts](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/api/auth/logout/route.ts) | Endpoint xÃ³a session vÃ  token |
| `/api/auth/refresh-token` | [refresh-token/route.ts](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/api/auth/refresh-token/route.ts) | LÃ m má»›i access token tá»« refresh token |
| `/api/auth/status` | [status/route.ts](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/api/auth/status/route.ts) | Kiá»ƒm tra tráº¡ng thÃ¡i Ä‘Äƒng nháº­p hiá»‡n táº¡i |

---

## 6. Route Thá»­ nghiá»‡m (Playground)
| ÄÆ°á»ng dáº«n URL | File mÃ£ nguá»“n | MÃ´ táº£ / Chá»©c nÄƒng |
| :--- | :--- | :--- |
| `/workpage` | [workpage/page.tsx](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/app/workpage/page.tsx) | Trang nhÃ¡p Ä‘á»ƒ phÃ¡t triá»ƒn cÃ¡c tÃ­nh nÄƒng thá»­ nghiá»‡m |

