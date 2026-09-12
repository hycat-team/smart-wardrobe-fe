const fs = require('fs');

const target = 'D:/Project/smart-wardrobe/smart-wardrobe-mobile/lib/features/wardrobe/presentation/wardrobe_screen.dart';

const code = `import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import '../../../core/theme/app_theme.dart';
import '../../../shared/widgets/closy_network_image.dart';
import '../models/wardrobe_models.dart';
import '../providers/wardrobe_provider.dart';
import '../providers/upload_wardrobe_provider.dart';

class WardrobeScreen extends ConsumerStatefulWidget {
  const WardrobeScreen({super.key});

  @override
  ConsumerState<WardrobeScreen> createState() => _WardrobeScreenState();
}

class _WardrobeScreenState extends ConsumerState<WardrobeScreen> {
  void _showUploadPicker() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) => SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: AppColors.border,
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Th\\u00eam \\u0111\\u1ed3 v\\u00e0o t\\u1ee7',
                style: GoogleFonts.playfairDisplay(
                  fontSize: 20,
                  fontWeight: FontWeight.w600,
                  color: AppColors.primary,
                ),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 6),
              Text(
                'Ch\\u1ee5p \\u1ea3nh ho\\u1eb7c ch\\u1ecdn t\\u1eeb m\\u00e1y \\u0111\\u1ec3 AI t\\u1ef1 \\u0111\\u1ed9ng t\\u00e1ch n\\u1ec1n v\\u00e0 ph\\u00e2n t\\u00edch ch\\u1ea5t li\\u1ec7u, m\\u00e0u s\\u1eafc, phong c\\u00e1ch.',
                style: GoogleFonts.beVietnamPro(fontSize: 13, color: AppColors.textSecondary),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: const BoxDecoration(
                    color: AppColors.surfaceSubtle,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.camera_alt_outlined, color: AppColors.primary),
                ),
                title: const Text('Ch\\u1ee5p \\u1ea3nh m\\u1edbi', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                subtitle: const Text('D\\u00f9ng m\\u00e1y \\u1ea3nh \\u0111\\u1ec3 ghi l\\u1ea1i trang ph\\u1ee5c', style: TextStyle(fontSize: 12)),
                onTap: () {
                  Navigator.pop(ctx);
                  _handleUpload(ImageSource.camera);
                },
              ),
              const SizedBox(height: 8),
              ListTile(
                leading: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: const BoxDecoration(
                    color: AppColors.surfaceSubtle,
                    shape: BoxShape.circle,
                  ),
                  child: const Icon(Icons.photo_library_outlined, color: AppColors.primary),
                ),
                title: const Text('Ch\\u1ecdn t\\u1eeb th\\u01b0 vi\\u1ec7n \\u1ea3nh', style: TextStyle(fontWeight: FontWeight.w600, fontSize: 15)),
                subtitle: const Text('T\\u1ea3i \\u1ea3nh trang ph\\u1ee5c t\\u1eeb thi\\u1ebft b\\u1ecb', style: TextStyle(fontSize: 12)),
                onTap: () {
                  Navigator.pop(ctx);
                  _handleUpload(ImageSource.gallery);
                },
              ),
              const SizedBox(height: 12),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _handleUpload(ImageSource source) async {
    final success = await ref.read(uploadWardrobeProvider.notifier).pickAndUpload(source: source);
    if (!mounted) return;

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('\\u0110\\u00e3 t\\u1ea3i \\u1ea3nh l\\u00ean Cloudinary v\\u00e0 g\\u1eedi ph\\u00e2n t\\u00edch t\\u1ee7 \\u0111\\u1ed3 th\\u00e0nh c\\u00f4ng!'),
          backgroundColor: AppColors.primary,
        ),
      );
    } else {
      final error = ref.read(uploadWardrobeProvider).errorMessage;
      if (error != null) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(error),
            backgroundColor: Colors.redAccent,
          ),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final wardrobeState = ref.watch(wardrobeProvider);
    final categoriesAsync = ref.watch(categoriesProvider);
    final selectedCategorySlug = ref.watch(selectedCategorySlugProvider);
    final uploadState = ref.watch(uploadWardrobeProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: Stack(
        children: [
          RefreshIndicator(
            onRefresh: () => ref.read(wardrobeProvider.notifier).loadItems(refresh: true),
            color: AppColors.primary,
            child: CustomScrollView(
              slivers: [
                SliverAppBar(
                  floating: true,
                  pinned: true,
                  backgroundColor: AppColors.background,
                  elevation: 0,
                  title: Text(
                    'Digital Closet',
                    style: GoogleFonts.playfairDisplay(
                      fontSize: 22,
                      fontWeight: FontWeight.w600,
                      color: AppColors.primary,
                    ),
                  ),
                  actions: [
                    IconButton(
                      icon: const Icon(Icons.analytics_outlined, color: AppColors.primary),
                      tooltip: 'Th\\u1ed1ng k\\u00ea t\\u1ee7 \\u0111\\u1ed3',
                      onPressed: () => context.push('/wardrobe/insights'),
                    ),
                    IconButton(
                      icon: const Icon(Icons.refresh_rounded, color: AppColors.primary),
                      tooltip: 'L\\u00e0m m\\u1edbi',
                      onPressed: () => ref.read(wardrobeProvider.notifier).loadItems(refresh: true),
                    ),
                    IconButton(
                      icon: const Icon(Icons.add_a_photo_outlined, color: AppColors.primary),
                      tooltip: 'Th\\u00eam \\u0111\\u1ed3',
                      onPressed: _showUploadPicker,
                    ),
                    const SizedBox(width: 8),
                  ],
                ),

                // Category Filter Chips Row
                SliverToBoxAdapter(
                  child: Padding(
                    padding: const EdgeInsets.only(top: 8.0, bottom: 16.0),
                    child: SizedBox(
                      height: 40,
                      child: categoriesAsync.when(
                        data: (categories) {
                          final allItems = [
                            {'name': 'T\\u1ea5t c\\u1ea3', 'slug': null},
                            ...categories.map((c) => {'name': c.name, 'slug': c.slug}),
                          ];
                          return ListView.separated(
                            scrollDirection: Axis.horizontal,
                            padding: const EdgeInsets.symmetric(horizontal: 16),
                            itemCount: allItems.length,
                            separatorBuilder: (_, __) => const SizedBox(width: 8),
                            itemBuilder: (context, index) {
                              final cat = allItems[index];
                              final isSelected = selectedCategorySlug == cat['slug'];
                              return ChoiceChip(
                                selected: isSelected,
                                label: Text(cat['name'] as String),
                                selectedColor: AppColors.accentSand,
                                backgroundColor: AppColors.surfaceSubtle,
                                labelStyle: TextStyle(
                                  fontSize: 13,
                                  fontWeight: isSelected ? FontWeight.w600 : FontWeight.w400,
                                  color: AppColors.primary,
                                ),
                                shape: const StadiumBorder(side: BorderSide(color: AppColors.border, width: 0.5)),
                                onSelected: (_) {
                                  ref.read(wardrobeProvider.notifier).selectCategory(cat['slug']);
                                },
                              );
                            },
                          );
                        },
                        loading: () => const Center(
                          child: SizedBox(
                            height: 20,
                            width: 20,
                            child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.accentSand),
                          ),
                        ),
                        error: (_, __) => const SizedBox.shrink(),
                      ),
                    ),
                  ),
                ),

                // Wardrobe Item Grid / States
                if (wardrobeState.isLoading && wardrobeState.items.isEmpty)
                  const SliverFillRemaining(
                    child: Center(
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          CircularProgressIndicator(color: AppColors.primary),
                          SizedBox(height: 16),
                          Text('\\u0110ang \\u0111\\u1ed3ng b\\u1ed9 t\\u1ee7 \\u0111\\u1ed3 c\\u1ee7a b\\u1ea1n...', style: TextStyle(color: AppColors.textSecondary)),
                        ],
                      ),
                    ),
                  )
                else if (wardrobeState.errorMessage != null && wardrobeState.items.isEmpty)
                  SliverFillRemaining(
                    child: Center(
                      child: Padding(
                        padding: const EdgeInsets.all(24.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.cloud_off_rounded, size: 48, color: Colors.redAccent),
                            const SizedBox(height: 12),
                            Text(
                              wardrobeState.errorMessage!,
                              textAlign: TextAlign.center,
                              style: const TextStyle(color: Colors.redAccent),
                            ),
                            const SizedBox(height: 16),
                            ElevatedButton(
                              onPressed: () => ref.read(wardrobeProvider.notifier).loadItems(refresh: true),
                              child: const Text('Th\\u1eed l\\u1ea1i'),
                            ),
                          ],
                        ),
                      ),
                    ),
                  )
                else if (wardrobeState.items.isEmpty)
                  SliverFillRemaining(
                    child: Center(
                      child: Padding(
                        padding: const EdgeInsets.all(32.0),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.checkroom_outlined, size: 64, color: AppColors.accentSandDark.withOpacity(0.5)),
                            const SizedBox(height: 16),
                            Text(
                              'T\\u1ee7 \\u0111\\u1ed3 c\\u1ee7a b\\u1ea1n \\u0111ang tr\\u1ed1ng',
                              style: GoogleFonts.playfairDisplay(fontSize: 18, fontWeight: FontWeight.w600),
                            ),
                            const SizedBox(height: 8),
                            const Text(
                              'H\\u00e3y ch\\u1ee5p \\u1ea3nh ho\\u1eb7c ch\\u1ecdn \\u1ea3nh qu\\u1ea7n \\u00e1o \\u0111\\u1ec3 AI b\\u1eaft \\u0111\\u1ea7u s\\u1ed1 h\\u00f3a v\\u00e0 ph\\u00e2n t\\u00edch phong c\\u00e1ch cho b\\u1ea1n.',
                              textAlign: TextAlign.center,
                              style: TextStyle(fontSize: 13, color: AppColors.textSecondary),
                            ),
                            const SizedBox(height: 24),
                            ElevatedButton.icon(
                              onPressed: _showUploadPicker,
                              icon: const Icon(Icons.camera_alt_outlined, size: 18),
                              label: const Text('Th\\u00eam trang ph\\u1ee5c ngay'),
                            ),
                          ],
                        ),
                      ),
                    ),
                  )
                else
                  SliverPadding(
                    padding: const EdgeInsets.symmetric(horizontal: 16.0),
                    sliver: SliverGrid(
                      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                        crossAxisCount: 2,
                        crossAxisSpacing: 14,
                        mainAxisSpacing: 18,
                        childAspectRatio: 0.72,
                      ),
                      delegate: SliverChildBuilderDelegate(
                        (context, index) {
                          final item = wardrobeState.items[index];
                          return WardrobeItemCard(
                            item: item,
                            onTap: () {
                              context.push('/wardrobe/item/\${item.id}', extra: item);
                            },
                          );
                        },
                        childCount: wardrobeState.items.length,
                        addAutomaticKeepAlives: true,
                        addRepaintBoundaries: true,
                      ),
                    ),
                  ),

                const SliverToBoxAdapter(child: SizedBox(height: 32)),
              ],
            ),
          ),

          // Uploading Banner / Overlay
          if (uploadState.isUploading || uploadState.isAnalyzing)
            Positioned(
              top: 60,
              left: 20,
              right: 20,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                decoration: BoxDecoration(
                  color: AppColors.primary,
                  borderRadius: BorderRadius.circular(16),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withOpacity(0.15),
                      blurRadius: 16,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    const SizedBox(
                      width: 18,
                      height: 18,
                      child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.accentSand),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Text(
                        uploadState.isUploading
                            ? '\\u0110ang t\\u1ea3i \\u1ea3nh l\\u00ean Cloudinary...'
                            : 'AI \\u0111ang t\\u00e1ch n\\u1ec1n v\\u00e0 ph\\u00e2n t\\u00edch \\u0111\\u1ed3...',
                        style: const TextStyle(color: Colors.white, fontSize: 13, fontWeight: FontWeight.w500),
                      ),
                    ),
                  ],
                ),
              ),
            ),
        ],
      ),
    );
  }
}

class WardrobeItemCard extends StatefulWidget {
  final WardrobeItemModel item;
  final VoidCallback? onTap;

  const WardrobeItemCard({
    super.key,
    required this.item,
    this.onTap,
  });

  @override
  State<WardrobeItemCard> createState() => _WardrobeItemCardState();
}

class _WardrobeItemCardState extends State<WardrobeItemCard> with AutomaticKeepAliveClientMixin {
  @override
  bool get wantKeepAlive => true;

  @override
  Widget build(BuildContext context) {
    super.build(context);
    final item = widget.item;
    final imageUrl = item.displayImageUrl;

    return Container(
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppColors.border, width: 0.6),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      clipBehavior: Clip.antiAlias,
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: widget.onTap,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Container(
                  color: const Color(0xFFF2EFE9),
                  child: Stack(
                    fit: StackFit.expand,
                    children: [
                      Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: Hero(
                          tag: 'item_\${item.id}',
                          child: ClosyNetworkImage(
                            imageUrl: imageUrl,
                            fit: BoxFit.contain,
                            memCacheWidth: 400,
                            memCacheHeight: 400,
                          ),
                        ),
                      ),
                      if (item.price != null && item.price! > 0)
                        Positioned(
                          bottom: 8,
                          left: 8,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 3),
                            decoration: BoxDecoration(
                              color: Colors.black.withOpacity(0.7),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              item.formattedPrice,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                              ),
                            ),
                          ),
                        ),
                    ],
                  ),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(12.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      (item.category?.name ?? item.fashionItem?.category?.name ?? 'M\\u00d3N \\u0110\\u1ed2').toUpperCase(),
                      style: const TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        letterSpacing: 0.8,
                        color: AppColors.textSecondary,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Text(
                      item.displayTitle,
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w500,
                        color: AppColors.primary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
`;

// Decode unicode escapes into genuine UTF-8 characters and write to file
const decoded = code.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => String.fromCharCode(parseInt(hex, 16)));
fs.writeFileSync(target, decoded, 'utf8');
console.log('Successfully wrote clean UTF-8 to', target);
