// Curated vocabulary for the "Gu của tôi" screen.
//
// Vietnamese labels are deliberate: production `fashion.fashion_items.style` values are Vietnamese
// ("Tối giản", "Đường phố", "Thanh lịch", ...) and the backend taxonomy maps the unaccented forms of the
// five canonical families (toi gian, thanh lich, sang trong, duong pho, ca tinh, co dien, hoc duong) so a
// Vietnamese chip matches wardrobe metadata and cold-start suggestions far better than an English one.

export const LIKED_STYLE_OPTIONS = [
  'Tối giản',
  'Thanh lịch',
  'Sang trọng',
  'Công sở',
  'Lịch lãm',
  'Cổ điển',
  'Vintage',
  'Retro',
  'Học đường',
  'Preppy',
  'Thường ngày',
  'Năng động',
  'Thể thao',
  'Athleisure',
  'Đường phố',
  'Cá tính',
  'Workwear',
  'Gorpcore',
  'Nữ tính',
  'Lãng mạn',
  'Boho',
  'Y2K',
  'Hàn Quốc',
  'Nhật Bản',
] as const;

export const AVOIDED_STYLE_OPTIONS = [
  'Đường phố',
  'Thể thao',
  'Cá tính',
  'Y2K',
  'Sặc sỡ',
  'Cầu kỳ',
  'Nữ tính',
  'Lãng mạn',
  'Boho',
  'Cổ điển',
  'Sang trọng',
  'Học đường',
  'Workwear',
  'Vintage',
] as const;

export const MAX_STYLE_LENGTH = 50;
