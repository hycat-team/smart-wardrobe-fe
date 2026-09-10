# Kế Hoạch Triển Khai & Kiểm Thử: Smart Wardrobe Mobile (Flutter)

> **Phiên bản:** 3.0 — Chuyển sang Flutter, xác nhận toàn bộ quyết định kiến trúc qua phiên Grill-Me (07/09/2026)
> **Nguồn tham chiếu:** [smart-wardrobe-fe](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe) (Next.js Web App)

---

## Mục Lục

1. [Tổng Quan & Phạm Vi](#1-tổng-quan--phạm-vi)
2. [Các Quyết Định Kiến Trúc Đã Xác Nhận](#2-các-quyết-định-kiến-trúc-đã-xác-nhận)
3. [Tech Stack Chính Thức (Flutter)](#3-tech-stack-chính-thức-flutter)
4. [Cấu Trúc Thư Mục & Navigation](#4-cấu-trúc-thư-mục--navigation)
5. [Ma Trận Tái Sử Dụng Logic từ Web](#5-ma-trận-tái-sử-dụng-logic-từ-web)
6. [Chi Tiết 5 Giai Đoạn Triển Khai](#6-chi-tiết-5-giai-đoạn-triển-khai)
7. [Prompting Playbook (Hướng Dẫn Prompt Flutter)](#7-prompting-playbook-hướng-dẫn-prompt-flutter)
8. [Kế Hoạch Kiểm Thử](#8-kế-hoạch-kiểm-thử)
9. [Các Rủi Ro & Giải Pháp Dự Phòng](#9-các-rủi-ro--giải-pháp-dự-phòng)

---

## 1. Tổng Quan & Phạm Vi

### Mục tiêu
Xây dựng ứng dụng di động đa nền tảng (Android + iOS song song) bằng **Flutter** từ dự án Web Next.js hiện tại, tập trung 100% vào trải nghiệm **người dùng cuối (B2C)**.

> [!NOTE]
> Đây là phiên bản 3.0 của plan — chuyển hoàn toàn từ React Native/Expo sang Flutter. Lý do: Flutter cho phép build Android + iOS từ một codebase duy nhất với hiệu năng native gần như tuyệt đối, Widget system nhất quán và không phụ thuộc vào bridge JS.

### So sánh Framework: React Native vs Flutter

| Tiêu chí | React Native (cũ) | Flutter (mới) |
| :--- | :--- | :--- |
| **Ngôn ngữ** | TypeScript (quen thuộc) | Dart (cần học mới) |
| **Performance** | JS Bridge overhead | Native compiled, không bridge |
| **UI Consistency** | Phụ thuộc OS native widgets | Custom widget — pixel-perfect mọi platform |
| **Ecosystem** | npm lớn | pub.dev chất lượng cao, Google-backed |
| **Hot Reload** | Fast Refresh | Flutter Hot Reload (nhanh hơn) |
| **Styling** | NativeWind (Tailwind-like) | Material Design 3 + ThemeData |
| **State Mgmt** | Zustand + React Query | Riverpod 2.x |
| **Testing** | Jest + RNTL + Maestro | flutter_test + integration_test + Patrol |

### Phạm vi IN (Sẽ làm)
| Nhóm tính năng | Màn hình cụ thể |
| :--- | :--- |
| **Xác thực** | Login, Register, Forgot Password, Onboarding Preferences |
| **Tủ đồ (Wardrobe)** | Danh sách Grid, Bộ lọc danh mục, Chi tiết món đồ, Camera Upload (SSE progress), Chỉnh sửa, Đăng bán |
| **Phối đồ (Outfits)** | Danh sách outfit, Outfit Studio (tạo/chỉnh sửa), Chi tiết outfit |
| **AI Stylist** | Giao diện chat, Gợi ý outfit dạng card (request/response thường) |
| **Chợ thời trang** | Feed sản phẩm, Chi tiết sản phẩm, Tìm kiếm, Bộ lọc, Trang thương hiệu |
| **Mua sắm** | Giỏ hàng, Checkout (In-App WebView), Lịch sử đơn hàng, Yêu cầu đổi trả |
| **Cộng đồng** | Feed bài viết, Chi tiết bài viết (like, comment) |
| **Cá nhân** | Profile, Cập nhật thông tin, Ví, Cài đặt |
| **Push Notification** | FCM (Firebase Cloud Messaging) — đơn hàng, gợi ý AI, cộng đồng |

### Phạm vi OUT (Giữ trên Web)
- ❌ Brand Portal (Dashboard, Products, Posts, Customer Care, Digital Sample Lab)
- ❌ Admin Portal (Dashboard, Users, Category, Moderation, Trends)

---

## 2. Các Quyết Định Kiến Trúc Đã Xác Nhận

| # | Vấn đề | Quyết định | Lý do |
| :--- | :--- | :--- | :--- |
| 1 | **Auth Architecture** | Gọi **trực tiếp Backend API** (bỏ BFF proxy). Token lưu trong `flutter_secure_storage`. Dio Interceptor auto-attach `Authorization: Bearer` + auto refresh. | Flutter không có HttpOnly Cookie. SecureStore mã hóa hardware-level (Keychain/Keystore). |
| 2 | **Image Upload** | **Cloudinary Signed Upload trực tiếp** từ app: Backend cấp signature → App upload `MultipartFile` → Gửi `secure_url` về Backend. | Giữ nguyên luồng web, chỉ thay `File/Blob` → Flutter `MultipartFile`. |
| 3 | **Role Scope** | **B2C only** (Guest + Customer). Brand Portal & Admin Portal giữ trên Web. | Mobile tập trung trải nghiệm người dùng cuối. |
| 4 | **Design System** | **Material Design 3** (Flutter native — ThemeData, ColorScheme). | Không có Tailwind trong Flutter. Material 3 là hệ thống chuẩn, dễ customize theo brand. |
| 5 | **SSE Streaming** | Chỉ dùng cho **Upload Wardrobe Item** (progress tracking). AI Stylist dùng request/response thường. | Đúng với kiến trúc backend hiện tại. |
| 6 | **Checkout** | **In-App WebView** (`webview_flutter` — official Flutter plugin). | Tái sử dụng ngay luồng thanh toán backend. |
| 7 | **Repository** | **Repo mới riêng biệt** (`smart-wardrobe-mobile`). Copy types/schemas thủ công dưới dạng Dart models. | Tách biệt rõ ràng, dễ quản lý CI/CD riêng. |
| 8 | **State Management** | **Riverpod 2.x**. `AsyncNotifierProvider` cho data fetching + caching. `NotifierProvider` cho global state. | An toàn type, compile-time DI, thay thế cả Zustand + React Query trong một package. |
| 9 | **Push Notification** | **firebase_messaging** (FCM cross-platform). | Dễ setup, free, official Flutter Firebase plugin. |
| 10 | **Platform Priority** | **Android + iOS song song** từ đầu. | Flutter build 1 codebase → 2 platform, không tốn thêm effort. |
| 11 | **HTTP Client** | **Dio** (tương đương Axios — interceptors, FormData, timeout config). | Interceptor Bearer token + auto refresh, tương tự cấu hình web hiện tại. |
| 12 | **Data Caching** | **Riverpod AsyncNotifier** + `dio_cache_interceptor`. | Riverpod tích hợp sẵn loading/error/data states, invalidation — không cần package riêng. |

---

## 3. Tech Stack Chính Thức (Flutter)

### Core
| Thành phần | Công nghệ | Phiên bản |
| :--- | :--- | :--- |
| Framework | Flutter SDK | 3.x (stable) |
| Language | Dart | 3.x |
| Routing | go_router | ^14.x |
| State Management | flutter_riverpod | ^2.x |
| Code Generation | riverpod_annotation + build_runner | latest |

### Network & Storage
| Thành phần | Công nghệ | Ghi chú |
| :--- | :--- | :--- |
| HTTP Client | dio | Thay Axios |
| HTTP Caching | dio_cache_interceptor | Thay React Query caching |
| Token Storage | flutter_secure_storage | Thay expo-secure-store |
| Local Prefs | shared_preferences | Non-sensitive user preferences |
| JSON Serialization | json_serializable + json_annotation | Thay Zod schemas |

### UI & Animation
| Thành phần | Công nghệ | Ghi chú |
| :--- | :--- | :--- |
| Design System | Material Design 3 (built-in) | Thay NativeWind |
| Icons | Material Icons (built-in) + flutter_svg | Thay lucide-react-native |
| Image Loading | cached_network_image | Thay expo-image |
| Bottom Sheet | modal_bottom_sheet | Thay @gorhom/bottom-sheet |
| Animation | flutter_animate | Thay react-native-reanimated |

### Device & Native Features
| Thành phần | Công nghệ | Ghi chú |
| :--- | :--- | :--- |
| Camera | camera | Official Flutter plugin |
| Image Picker | image_picker | Thay expo-image-picker |
| Haptic Feedback | HapticFeedback (built-in) | Thay expo-haptics |
| Push Notifications | firebase_messaging + firebase_core | Thay expo-notifications |
| WebView (Checkout) | webview_flutter | Thay react-native-webview |
| Safe Area | MediaQuery.of(context).padding (built-in) | Không cần package riêng |
| SSE (Upload progress) | eventsource package hoặc Dio streaming | Thay react-native-sse |

### Testing
| Thành phần | Công nghệ | Ghi chú |
| :--- | :--- | :--- |
| Unit & Widget Tests | flutter_test (built-in) | Thay Jest + RNTL |
| Mocking | mocktail | Thay jest.mock() |
| E2E Tests | Patrol | Thay Maestro — native interaction support |

---

## 4. Cấu Trúc Thư Mục & Navigation

### 4.1. Cây thư mục Flutter Project

```
smart-wardrobe-mobile/
├── lib/
│   ├── main.dart                       ← Entry point, Firebase.initializeApp()
│   ├── app.dart                        ← MaterialApp.router() + ThemeData + GoRouter config
│   ├── core/
│   │   ├── router/
│   │   │   └── app_router.dart         ← GoRouter routes + auth redirect guard
│   │   ├── theme/
│   │   │   ├── app_theme.dart          ← ThemeData light/dark + ColorScheme
│   │   │   └── app_colors.dart         ← Brand color tokens (từ globals.css)
│   │   ├── network/
│   │   │   ├── dio_client.dart         ← Dio instance + interceptors (Bearer + refresh)
│   │   │   └── api_endpoints.dart      ← Tất cả URL constants
│   │   └── storage/
│   │       └── secure_storage.dart     ← flutter_secure_storage wrapper
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/
│   │   │   │   ├── auth_api.dart
│   │   │   │   └── auth_models.dart    ← LoginRequest, LoginResponse, User
│   │   │   ├── providers/
│   │   │   │   └── auth_provider.dart  ← Riverpod AuthNotifier
│   │   │   └── views/
│   │   │       ├── login_screen.dart
│   │   │       ├── register_screen.dart
│   │   │       ├── forgot_password_screen.dart
│   │   │       └── preferences_screen.dart
│   │   ├── wardrobe/
│   │   │   ├── data/
│   │   │   ├── providers/
│   │   │   │   ├── wardrobe_provider.dart    ← AsyncNotifier wardrobe list
│   │   │   │   └── upload_provider.dart      ← SSE upload progress
│   │   │   └── views/
│   │   │       ├── wardrobe_screen.dart
│   │   │       ├── item_detail_screen.dart
│   │   │       ├── item_edit_screen.dart
│   │   │       ├── item_sell_screen.dart
│   │   │       └── upload_screen.dart
│   │   ├── outfits/
│   │   ├── ai_stylist/
│   │   ├── marketplace/
│   │   ├── cart/
│   │   ├── community/
│   │   └── profile/
│   ├── shared/
│   │   ├── widgets/
│   │   │   ├── app_button.dart
│   │   │   ├── app_text_field.dart
│   │   │   ├── app_card.dart
│   │   │   ├── app_badge.dart
│   │   │   ├── app_avatar.dart
│   │   │   ├── bottom_sheet_wrapper.dart
│   │   │   ├── app_snackbar.dart
│   │   │   ├── screen_wrapper.dart
│   │   │   ├── empty_state.dart
│   │   │   ├── shimmer_loader.dart
│   │   │   ├── wardrobe_item_card.dart
│   │   │   ├── outfit_card.dart
│   │   │   └── product_card.dart
│   │   └── constants/
│   │       ├── app_strings.dart
│   │       └── app_config.dart         ← API base URL, Cloudinary config
├── test/
│   ├── unit/
│   ├── widget/
│   └── integration/
├── assets/
│   ├── fonts/                          ← BeVietnamPro .ttf files
│   └── images/
├── pubspec.yaml
└── firebase.json + google-services.json
```

### 4.2. GoRouter Navigation Structure

```dart
// core/router/app_router.dart
final router = GoRouter(
  redirect: (context, state) {
    final isAuthenticated = ref.read(authProvider).isAuthenticated;
    final onAuth = state.matchedLocation.startsWith('/auth');
    if (!isAuthenticated && !onAuth) return '/auth/login';
    if (isAuthenticated && onAuth) return '/wardrobe';
    return null;
  },
  routes: [
    GoRoute(path: '/auth/login', builder: (_, __) => const LoginScreen()),
    GoRoute(path: '/auth/register', builder: (_, __) => const RegisterScreen()),
    GoRoute(path: '/auth/forgot-password', builder: (_, __) => const ForgotPasswordScreen()),
    GoRoute(path: '/auth/preferences', builder: (_, __) => const PreferencesScreen()),
    // Main Shell — Bottom Tab Bar
    StatefulShellRoute.indexedStack(
      builder: (_, __, shell) => MainShell(shell: shell),
      branches: [
        StatefulShellBranch(routes: [GoRoute(path: '/wardrobe', ...)]),
        StatefulShellBranch(routes: [GoRoute(path: '/outfits', ...)]),
        StatefulShellBranch(routes: [GoRoute(path: '/ai-stylist', ...)]),
        StatefulShellBranch(routes: [GoRoute(path: '/marketplace', ...)]),
        StatefulShellBranch(routes: [GoRoute(path: '/profile', ...)]),
      ],
    ),
    // Stack Routes
    GoRoute(path: '/wardrobe/:id', builder: (_, s) => ItemDetailScreen(id: s.pathParameters['id']!)),
    GoRoute(path: '/wardrobe/:id/edit', builder: (_, s) => ItemEditScreen(id: s.pathParameters['id']!)),
    GoRoute(path: '/wardrobe/upload', builder: (_, __) => const UploadScreen()),
    GoRoute(path: '/outfits/studio', builder: (_, __) => const OutfitStudioScreen()),
    GoRoute(path: '/products/:id', builder: (_, s) => ProductDetailScreen(id: s.pathParameters['id']!)),
    GoRoute(path: '/cart', builder: (_, __) => const CartScreen()),
    GoRoute(path: '/checkout', builder: (_, s) => CheckoutScreen(url: s.uri.queryParameters['url']!)),
    GoRoute(path: '/orders', builder: (_, __) => const OrdersScreen()),
    GoRoute(path: '/search', builder: (_, __) => const SearchScreen()),
    GoRoute(path: '/settings/wallet', builder: (_, __) => const WalletScreen()),
    GoRoute(path: '/posts/:id', builder: (_, s) => PostDetailScreen(id: s.pathParameters['id']!)),
    GoRoute(path: '/brands/:id', builder: (_, s) => BrandScreen(id: s.pathParameters['id']!)),
  ],
);
```

### 4.3. Bảng ánh xạ Route Web → Mobile Flutter

| Web Route | Flutter Screen | Navigation Type |
| :--- | :--- | :--- |
| `/auth/login` | `LoginScreen` | GoRoute `/auth/login` |
| `/auth/register` | `RegisterScreen` | GoRoute `/auth/register` |
| `/auth/register/preferences` | `PreferencesScreen` | GoRoute `/auth/preferences` |
| `/wardrobe` | `WardrobeScreen` | **Tab 1 (StatefulShellBranch)** |
| `/wardrobe/upload` | `UploadScreen` | GoRoute `/wardrobe/upload` |
| `/wardrobe/item/[id]` | `ItemDetailScreen` | GoRoute `/wardrobe/:id` |
| `/wardrobe/item/[id]/edit` | `ItemEditScreen` | GoRoute `/wardrobe/:id/edit` |
| `/outfits` | `OutfitsScreen` | **Tab 2** |
| `/outfits/create` | `OutfitStudioScreen` | GoRoute `/outfits/studio` |
| `/ai-stylist` | `AiStylistScreen` | **Tab 3** |
| `/marketplace` | `MarketplaceScreen` | **Tab 4** |
| `/products/[id]` | `ProductDetailScreen` | GoRoute `/products/:id` |
| `/search` | `SearchScreen` | GoRoute `/search` |
| `/cart` | `CartScreen` | GoRoute `/cart` |
| `/checkout` | `CheckoutScreen` (WebView) | GoRoute `/checkout` |
| `/profile` | `ProfileScreen` | **Tab 5** |
| `/orders` | `OrdersScreen` | GoRoute `/orders` |
| `/settings/wallet` | `WalletScreen` | GoRoute `/settings/wallet` |

---

## 5. Ma Trận Tái Sử Dụng Logic từ Web

> [!IMPORTANT]
> Flutter dùng Dart, không phải TypeScript. Code web **KHÔNG thể copy-paste trực tiếp**. Phải chuyển đổi sang Dart. Tuy nhiên, **logic nghiệp vụ, API endpoints, data models** đều có thể dịch 1:1.

| Nguồn Web (TypeScript) | Đích Flutter (Dart) | Tỷ lệ logic tái dùng | Công việc cần làm |
| :--- | :--- | :---: | :--- |
| `src/types/*.ts` | `lib/features/*/data/*_models.dart` | **100%** | Chuyển TS interface → Dart class + `json_serializable` |
| `src/store/useAuthStore.ts` | `lib/features/auth/providers/auth_provider.dart` | **85%** | Zustand → Riverpod `AsyncNotifier`. `localStorage` → `flutter_secure_storage` |
| `src/features/*/queries/` | `lib/features/*/providers/*_provider.dart` | **90%** | React Query hooks → Riverpod `AsyncNotifierProvider`. Giữ nguyên query logic |
| `src/features/*/api/` | `lib/features/*/data/*_api.dart` | **90%** | Giữ URL, payload. `axios.get()` → `dio.get()` |
| `src/lib/axios.ts` | `lib/core/network/dio_client.dart` | **50%** | Viết lại: bỏ BFF proxy, Dio interceptor thay Axios interceptor, giữ refresh logic |
| `src/lib/cloudinary.ts` | `lib/core/network/cloudinary_service.dart` | **70%** | Thay `File/Blob` → `MultipartFile`. Giữ nguyên API logic |
| `src/components/ui/` | `lib/shared/widgets/` | **10%** | Viết lại hoàn toàn bằng Flutter Widgets |
| `src/app/**/page.tsx` | `lib/features/**/views/*_screen.dart` | **30%** | Chuyển JSX → Flutter Widgets. `div` → `Container`, `FlatList` → `ListView.builder` |
| `src/middleware.ts` | `GoRouter redirect callback` | **80%** | Next.js middleware auth guard → GoRouter `redirect` |
| `src/app/api/` (BFF routes) | ❌ Không cần | **0%** | Flutter gọi thẳng Backend |
| `globals.css` `:root` colors | `lib/core/theme/app_colors.dart` | **100%** | Copy giá trị hex colors sang Dart constants |

---

## 6. Chi Tiết 5 Giai Đoạn Triển Khai

### Phase 1: Foundation & Navigation (Tuần 1)

#### 1.1. Khởi tạo dự án Flutter

```bash
# Cài Flutter SDK — https://flutter.dev/docs/get-started/install
flutter create smart_wardrobe_mobile --org com.smartwardrobe --platforms android,ios
cd smart_wardrobe_mobile
flutter doctor
```

#### 1.2. Dependencies (pubspec.yaml)

```yaml
dependencies:
  flutter:
    sdk: flutter
  go_router: ^14.0.0
  flutter_riverpod: ^2.5.0
  riverpod_annotation: ^2.3.0
  dio: ^5.4.0
  dio_cache_interceptor: ^3.4.0
  flutter_secure_storage: ^9.2.0
  shared_preferences: ^2.3.0
  firebase_core: ^3.0.0
  firebase_messaging: ^15.0.0
  cached_network_image: ^3.3.0
  flutter_animate: ^4.5.0
  modal_bottom_sheet: ^3.0.0
  flutter_svg: ^2.0.0
  camera: ^0.11.0
  image_picker: ^1.1.0
  webview_flutter: ^4.7.0
  json_annotation: ^4.9.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  integration_test:
    sdk: flutter
  build_runner: ^2.4.0
  riverpod_generator: ^2.4.0
  json_serializable: ^6.8.0
  mocktail: ^1.0.0
  patrol: ^3.0.0
```

#### 1.3. Cấu hình Firebase

```bash
dart pub global activate flutterfire_cli
flutterfire configure --project=smart-wardrobe-prod
# → Tạo google-services.json (Android) + GoogleService-Info.plist (iOS)
```

#### 1.4. Brand Colors từ Web

```dart
// lib/core/theme/app_colors.dart
class AppColors {
  static const background = Color(0xFFFAFAFA);
  static const foreground = Color(0xFF111111);
  static const primary = Color(0xFF111111);
  static const primaryForeground = Color(0xFFFFFFFF);
  static const accent = Color(0xFFD9C5B2);   // Brand accent
  static const accentSoft = Color(0xFFF4EEE8);
  static const muted = Color(0xFFF3F4F6);
  static const mutedForeground = Color(0xFF6B7280);
  static const destructive = Color(0xFFDC2626);
  static const border = Color(0xFFE5E7EB);
}
```

```dart
// lib/core/theme/app_theme.dart
class AppTheme {
  static ThemeData get light => ThemeData(
    useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(
      seedColor: AppColors.accent,
      primary: AppColors.primary,
      onPrimary: AppColors.primaryForeground,
      surface: AppColors.background,
    ),
    fontFamily: 'BeVietnamPro',
    scaffoldBackgroundColor: AppColors.background,
    appBarTheme: const AppBarTheme(
      backgroundColor: AppColors.background,
      foregroundColor: AppColors.foreground,
      elevation: 0,
    ),
  );
}
```

#### 1.5. Entry Point & Auth Guard

```dart
// lib/main.dart
void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  runApp(const ProviderScope(child: SmartWardrobeApp()));
}
```

#### 1.6. Bottom Navigation (5 tabs)

```dart
NavigationBar(destinations: const [
  NavigationDestination(icon: Icon(Icons.checkroom_outlined), selectedIcon: Icon(Icons.checkroom), label: 'Tủ đồ'),
  NavigationDestination(icon: Icon(Icons.style_outlined), selectedIcon: Icon(Icons.style), label: 'Outfits'),
  NavigationDestination(icon: Icon(Icons.auto_awesome_outlined), selectedIcon: Icon(Icons.auto_awesome), label: 'AI Stylist'),
  NavigationDestination(icon: Icon(Icons.shopping_bag_outlined), selectedIcon: Icon(Icons.shopping_bag), label: 'Chợ'),
  NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Cá nhân'),
])
```

---

### Phase 2: Auth & Service Layer (Tuần 1-2)

#### 2.1. Dio Client (thay Axios)

```dart
// lib/core/network/dio_client.dart
class DioClient {
  static Dio create(Ref ref) {
    final dio = Dio(BaseOptions(
      baseUrl: AppConfig.apiBaseUrl,  // gọi thẳng Backend, bỏ BFF
      connectTimeout: const Duration(seconds: 30),
    ));

    dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) async {
        final token = await SecureStorageService.getAccessToken();
        if (token != null) options.headers['Authorization'] = 'Bearer $token';
        return handler.next(options);
      },
      onError: (error, handler) async {
        if (error.response?.statusCode == 401) {
          try {
            final newToken = await ref.read(authProvider.notifier).refreshToken();
            error.requestOptions.headers['Authorization'] = 'Bearer $newToken';
            final res = await dio.fetch(error.requestOptions);
            return handler.resolve(res);
          } catch (_) {
            ref.read(authProvider.notifier).logout();
          }
        }
        return handler.next(error);
      },
    ));
    return dio;
  }
}
```

**So sánh với Web [axios.ts](file:///d:/Project/smart-wardrobe/smart-wardrobe-fe/src/lib/axios.ts):**

| Web | Flutter |
| :--- | :--- |
| `baseURL: '/api/v1'` (BFF) | `baseUrl: 'https://api.smartwardrobe.com/api/v1'` (direct) |
| Cookie auto-attached | `onRequest` interceptor → `Authorization: Bearer` |
| Refresh → BFF `/api/auth/refresh-token` | Refresh → backend trực tiếp |
| Toast `sonner` | `ScaffoldMessenger.showSnackBar()` |

#### 2.2. Auth Provider (thay Zustand)

```dart
// lib/features/auth/providers/auth_provider.dart
@riverpod
class Auth extends _$Auth {
  @override
  AuthState build() => const AuthState.unauthenticated();

  Future<void> login(String email, String password) async {
    state = const AuthState.loading();
    try {
      final res = await ref.read(authApiProvider).login(email, password);
      await SecureStorageService.saveTokens(
        accessToken: res.accessToken,
        refreshToken: res.refreshToken,
      );
      state = AuthState.authenticated(user: res.user);
    } catch (e) {
      state = AuthState.error(e.toString());
    }
  }

  Future<String> refreshToken() async {
    final rt = await SecureStorageService.getRefreshToken();
    final res = await ref.read(authApiProvider).refreshToken(rt!);
    await SecureStorageService.saveAccessToken(res.accessToken);
    return res.accessToken;
  }

  Future<void> logout() async {
    await SecureStorageService.clearAll();
    state = const AuthState.unauthenticated();
  }
}
```

#### 2.3. Chuyển TypeScript Types → Dart Models

```typescript
// Web: src/features/wardrobe/types/wardrobe.ts
export interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  imageUrl: string;
  status: 'active' | 'sold';
}
```

```dart
// Flutter: lib/features/wardrobe/data/wardrobe_models.dart
@JsonSerializable()
class WardrobeItem {
  final String id;
  final String name;
  final String category;
  final String imageUrl;
  final WardrobeItemStatus status;

  const WardrobeItem({required this.id, required this.name,
    required this.category, required this.imageUrl, required this.status});

  factory WardrobeItem.fromJson(Map<String, dynamic> json) =>
      _$WardrobeItemFromJson(json);
  Map<String, dynamic> toJson() => _$WardrobeItemToJson(this);
}

enum WardrobeItemStatus { active, sold }
```

```bash
flutter pub run build_runner build --delete-conflicting-outputs
```

#### 2.4. Cloudinary Upload Flutter

```dart
Future<String> uploadImage(String filePath, String signature, ...) async {
  final formData = FormData.fromMap({
    'file': await MultipartFile.fromFile(filePath), // thay File/Blob
    'api_key': apiKey,
    'timestamp': timestamp,
    'signature': signature,
  });
  final res = await Dio().post(
    'https://api.cloudinary.com/v1_1/${cloudName}/image/upload',
    data: formData,
  );
  return res.data['secure_url'] as String;
}
```

---

### Phase 3: Flutter Design System (Tuần 2)

#### Widgets cần viết:

| Widget | Thay thế Web | Đặc điểm Mobile |
| :--- | :--- | :--- |
| `AppButton` | `button.tsx` | Variants: primary/outline/ghost/destructive. `isLoading` state. `HapticFeedback` |
| `AppTextField` | `input.tsx` | Label, icon, error message, `obscureText` |
| `AppCard` | `card.tsx` | `InkWell` + Material ink effect |
| `AppBadge` | `badge.tsx` | Variants: default/secondary/outline/destructive |
| `AppAvatar` | `avatar.tsx` | `CachedNetworkImage` + fallback initials |
| `AppBottomSheet` | dialog + sheet + dropdown + popover + select | `showModalBottomSheet` wrapper |
| `AppSnackbar` | `sonner.tsx` | `ScaffoldMessenger.showSnackBar()` |
| `ScreenWrapper` | — | `Scaffold` + `SafeArea` wrapper |
| `EmptyState` | `empty.tsx` | Icon + message + CTA |
| `ShimmerLoader` | `skeleton.tsx` | Animated shimmer |
| `WardrobeItemCard` | — | Product photo grid card |
| `OutfitCard` | — | Outfit preview card |
| `ProductCard` | — | Marketplace product card |

#### Widgets không cần viết (Flutter built-in):
- `ExpansionTile` thay accordion
- `showDatePicker()` thay calendar
- `DataTable` thay table
- `Divider` thay separator
- `Switch` thay toggle
- `TabBar` thay tabs

---

### Phase 4: Screen-by-Screen Conversion (Tuần 2-4)

#### Sprint 1 (Tuần 2): Auth & Profile (✅ Đã Hoàn Thành 100%)

- **Login (`/login`):** `Form` + `TextFormField` + Demo Quick-Fill → `ref.read(authStateProvider.notifier).login()` → GoRouter redirect guard `/wardrobe` (Hỗ trợ Cookie Session Web + Bearer Mobile).
- **Register (`/auth/register`):** `RegisterScreen` 2 bước: Form thông tin cá nhân (có DatePicker & Giới tính) + Xác thực OTP 6 số (đếm ngược 59s, gửi lại OTP) → `confirmRegisterOtp()` → `context.go('/auth/preferences')`.
- **Preferences (`/auth/preferences`):** `PreferencesScreen` khảo sát gu thẩm mỹ: 10 phong cách thời trang + 4 bảng màu chủ đạo (Quiet Luxury preview) → Lưu local & direct vào `/wardrobe`.
- **Forgot Password (`/auth/forgot-password`):** `ForgotPasswordScreen` 3 bước: Nhập email → Xác thực OTP 6 số → Đặt lại mật khẩu mới → Điều hướng `/login`.
- **Profile (`/profile`):** Hiển thị avatar, tên, email, role badge (`isAdmin`, `isBrand`, `isCustomer`), menu cài đặt (ListTile Material wrapped) và nút Log Out.


#### Sprint 2 (Tuần 3): Wardrobe

**Wardrobe Grid:**
- `CustomScrollView` + `SliverAppBar` + `SliverGrid(crossAxisCount: 2)` + `RefreshIndicator` + `FloatingActionButton`
- Filter: horizontal `SingleChildScrollView` với `FilterChip`s
- Dropdown → `showModalBottomSheet`

**Camera Upload:**
1. `ImagePicker().pickImage(source: ImageSource.camera / gallery)`
2. Preview + Form → submit
3. `MultipartFile.fromFile()` → Cloudinary → `secure_url`
4. SSE stream → `LinearProgressIndicator`

**Item Detail:** `CustomScrollView` + `SliverAppBar(expandedHeight: 400)` + `FlexibleSpaceBar(background: CachedNetworkImage(...))` + sticky bottom actions

#### Sprint 3 (Tuần 3): Outfits & AI Stylist

**Outfit Studio:** `Stack` drag-and-drop + `showModalBottomSheet` item picker → preview → lưu

**AI Stylist Chat:**
- `ListView.builder(reverse: true)` (chat bubbles)
- `TextField` input bar ở đáy (floating)
- AI response: custom `OutfitSuggestionCard` widget
- Quick actions: `Wrap` with `ActionChip`s

#### Sprint 4 (Tuần 4): Marketplace, Cart, Community

**Marketplace:** `CustomScrollView` + `SliverGrid` 2 cột + infinite scroll (`ScrollController.addListener`)

**Product Detail:** `PageView` image carousel + scroll thông tin + sticky bottom "Thêm vào giỏ" + `HapticFeedback.mediumImpact()`

**Cart:** `ListView` items + tổng tiền + button

**Checkout:** `WebViewWidget(controller: WebViewController()..loadRequest(Uri.parse(checkoutUrl)))` + `NavigationDelegate` bắt callback

**Community:** `ListView.builder` feed + `GestureDetector(onDoubleTap: likePost)` + comment `showModalBottomSheet`

---

### Phase 5: Polish & Push Notifications (Tuần 4-5)

#### 5.1. Gestures & Haptics

```dart
RefreshIndicator(onRefresh: ...) // pull-to-refresh
Dismissible(onDismissed: deleteItem) // swipe-to-delete
GestureDetector(onLongPress: showContextMenu) // long press
HapticFeedback.mediumImpact() // khi like, add to cart, save outfit
```

#### 5.2. FCM Push Notifications

```dart
// Sau login thành công
final fcmToken = await FirebaseMessaging.instance.getToken();
await authApi.saveFcmToken(fcmToken!);
// Foreground notifications
FirebaseMessaging.onMessage.listen((message) {
  AppSnackbar.show(context, message.notification?.title ?? '');
});
```

#### 5.3. Font Setup

```yaml
flutter:
  fonts:
    - family: BeVietnamPro
      fonts:
        - asset: assets/fonts/BeVietnamPro-Regular.ttf
        - asset: assets/fonts/BeVietnamPro-Medium.ttf
          weight: 500
        - asset: assets/fonts/BeVietnamPro-SemiBold.ttf
          weight: 600
        - asset: assets/fonts/BeVietnamPro-Bold.ttf
          weight: 700
```

---

## 7. Prompting Playbook (Hướng Dẫn Prompt Flutter)

### Template Prompt Chuẩn

```markdown
[ROLE]
Bạn là Senior Flutter Developer (Dart) chuyên về Material Design 3 và Riverpod.
Người đang code là Beginner Flutter (quen TypeScript/React).

[CONTEXT]
Chuyển đổi "[TÊN TÍNH NĂNG]" từ Next.js Web → Flutter.
- Auth: Direct Backend API. Token trong flutter_secure_storage. Dio interceptor Bearer + refresh.
- Routing: GoRouter + StatefulShellRoute cho bottom tabs.
- State: Riverpod 2.x (AsyncNotifierProvider cho data, NotifierProvider cho global).
- HTTP: Dio.
- Design: Material Design 3 + custom ThemeData + brand colors.
- Images: cached_network_image.
- Bottom Sheet: showModalBottomSheet (thay tất cả dialog/dropdown/modal web).

[CODE WEB]
tsx code...

[TYPES WEB]
typescript types...

[YÊU CẦU]
1. Flutter Screen hoàn chỉnh bằng Dart.
2. TypeScript interfaces → Dart classes với json_serializable.
3. Riverpod AsyncNotifierProvider cho data fetching.
4. Dio API class tương ứng.
5. Material Design 3 Widgets: Scaffold, AppBar, ListView.builder, GridView, Card.
6. SafeArea + MediaQuery cho responsive.
7. Infinite scroll: ScrollController + listener.
8. Dropdown/Modal → showModalBottomSheet.
9. Giữ 100% logic nghiệp vụ, chỉ đổi syntax Dart.
10. HapticFeedback cho actions quan trọng.
11. Loading: CircularProgressIndicator hoặc ShimmerLoader.
12. Error state: Text + ElevatedButton retry.
```

### Thứ tự Prompt

| Bước | Prompt | Web Input |
| :--- | :--- | :--- |
| 1 | Flutter + ThemeData + AppColors | `globals.css` (`:root` colors) |
| 2 | Dio Client + flutter_secure_storage | `axios.ts` + `refresh-token/route.ts` |
| 3 | Auth Provider (Riverpod) | `useAuthStore.ts` + `features/auth/` |
| 4 | Cloudinary Service | `cloudinary.ts` |
| 5 | GoRouter setup + Auth Guard | `middleware.ts` + route structure |
| 6 | Base Widgets | `src/components/ui/` (button, input, card) |
| 7 | Auth Screens | `login/page.tsx`, `register/page.tsx`, `preferences/page.tsx` |
| 8 | Wardrobe Screens | `wardrobe/page.tsx`, `upload/page.tsx`, `item/[id]/page.tsx` |
| 9 | Outfit Screens | `outfits/page.tsx`, `create/page.tsx` |
| 10 | AI Stylist Screen | `ai-stylist/page.tsx` |
| 11 | Marketplace & Cart | `marketplace/page.tsx`, `products/[id]/page.tsx`, `cart/page.tsx` |
| 12 | Community & Profile | `community/page.tsx`, `profile/page.tsx` |

---

## 8. Kế Hoạch Kiểm Thử

### 8.1. Unit Tests (flutter_test + mocktail)

| Nhóm test | Nội dung | File |
| :--- | :--- | :--- |
| **Auth Provider** | `login()` cập nhật state, `logout()` xóa SecureStorage | `test/unit/auth_provider_test.dart` |
| **Wardrobe Provider** | Mock Dio, AsyncNotifier trả đúng data | `test/unit/wardrobe_provider_test.dart` |
| **Dart Models** | `fromJson/toJson` round-trip | `test/unit/models_test.dart` |
| **Cloudinary Service** | Mock Dio FormData upload | `test/unit/cloudinary_service_test.dart` |
| **Dio Interceptor** | Auto-attach Bearer, refresh khi 401 | `test/unit/dio_client_test.dart` |

```dart
test('login updates state to authenticated', () async {
  final authApi = MockAuthApi();
  when(() => authApi.login(any(), any())).thenAnswer(
    (_) async => LoginResponse(accessToken: 'abc', refreshToken: 'def', user: mockUser),
  );
  final container = ProviderContainer(overrides: [
    authApiProvider.overrideWith((_) => authApi),
  ]);
  await container.read(authProvider.notifier).login('test@email.com', 'pass');
  expect(container.read(authProvider), isA<AuthStateAuthenticated>());
});
```

### 8.2. Widget Tests

```dart
testWidgets('AppButton shows loader when isLoading true', (tester) async {
  await tester.pumpWidget(MaterialApp(
    home: Scaffold(body: AppButton(label: 'Test', isLoading: true, onPressed: () {})),
  ));
  expect(find.byType(CircularProgressIndicator), findsOneWidget);
  expect(find.text('Test'), findsNothing);
});
```

### 8.3. Integration Tests (Patrol)

```dart
patrolTest('Login success flow', ($) async {
  await $.pumpWidgetAndSettle(const ProviderScope(child: SmartWardrobeApp()));
  await $(TextField).at(0).enterText('test@example.com');
  await $(TextField).at(1).enterText('password123');
  await $('Đăng nhập').tap();
  await $.pumpAndSettle();
  expect($('Tủ đồ'), findsOneWidget);
});

patrolTest('Add to cart and checkout', ($) async {
  await $(NavigationDestination).at(3).tap(); // Tab Marketplace
  await $(AppCard).first.tap();
  await $('Thêm vào giỏ').tap();
  await $('Giỏ hàng').tap();
  await $('Thanh toán').tap();
  expect($(WebViewWidget), findsOneWidget);
});
```

### 8.4. Manual Testing Matrix

| Thiết bị | Kiểm tra | Tiêu chí PASS |
| :--- | :--- | :--- |
| **Android Emulator (Pixel 8, API 34)** | Navigation, Back button, BottomNav | Back không văng app, tab chuyển mượt |
| **Android máy thật** | Camera, Gallery, Haptics, FCM Push | Camera mở, rung haptic, nhận notification |
| **iOS Simulator (iPhone 15, iOS 17)** | Safe Area, Dynamic Island, Swipe-back | Không bị đè Dynamic Island |
| **Mạng 3G (throttle)** | Loading states, Skeleton, Error | ShimmerLoader đẹp, error message thân thiện |
| **Offline** | Mất mạng | Banner "Mất kết nối", cached data hiển thị |

---

## 9. Các Rủi Ro & Giải Pháp Dự Phòng

| Rủi ro | Xác suất | Giải pháp |
| :--- | :--- | :--- |
| Dart/Flutter learning curve (Beginner) | **Cao** | Dùng prompts với "Beginner Flutter" context. Đọc Flutter cookbook trước Phase 1. Ưu tiên Flutter official docs hơn StackOverflow. |
| `json_serializable` build_runner conflict | Trung bình | Luôn chạy `flutter pub run build_runner build --delete-conflicting-outputs`. Đảm bảo version packages tương thích. |
| GoRouter `StatefulShellRoute` setup phức tạp | Trung bình | Dùng GoRouter official example. Test navigation riêng trước khi làm screens. |
| FCM không hoạt động trên iOS Simulator | **Chắc chắn** | iOS Simulator không hỗ trợ FCM push. Dùng Firebase Console "Send test message to device" với máy thật. |
| `webview_flutter` bị block bởi cổng thanh toán | Thấp | Set custom `userAgent` trong `WebViewController` giả lập Chrome desktop. |
| SSE streaming không ổn định | Trung bình | Fallback về polling `Timer.periodic(Duration(seconds: 2), ...)` cho upload progress. |
| Font BeVietnamPro chưa có sẵn | **Chắc chắn** | Download `.ttf` từ [Google Fonts](https://fonts.google.com/specimen/Be+Vietnam+Pro), đặt vào `assets/fonts/`, khai báo trong `pubspec.yaml`. |
| Backend CORS không cho phép mobile | Trung bình | Backend cần cho phép requests không có `Origin` header hoặc thêm `X-Platform: mobile` header trong Dio. |
| Riverpod generator `riverpod_annotation` lỗi | Thấp | Luôn thêm `part 'file.g.dart';` directive. Chạy build_runner sau mỗi lần thêm annotation. |
