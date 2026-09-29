const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const outDir = path.join(__dirname, '..', 'public', 'landing-page', 'testimonials');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const testimonials = [
  {
    id: 1,
    name: 'Linh',
    role: 'Sinh viên ĐH Ngoại Thương',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    tag: '⚡ Tiết kiệm 28 phút mỗi sáng',
    quote: 'App xịn xò quá! Sáng nay mình chỉ mất 2 phút để chọn đồ thay vì 30 phút như trước.',
    subtext: 'AI Stylist • Daily Outfit'
  },
  {
    id: 2,
    name: 'Đức Trí',
    role: 'Software Developer',
    avatarUrl: 'https://i.pravatar.cc/150?img=15',
    tag: '🌧️ Gợi ý theo thời tiết',
    quote: 'Gợi ý outfit thay đổi theo thời tiết mới đỉnh chứ, bữa mưa được gợi ý ngay áo khoác dù.',
    subtext: 'Weather Sync • Smart Choice'
  },
  {
    id: 3,
    name: 'Hải Nam',
    role: 'Freelancer',
    avatarUrl: 'https://i.pravatar.cc/150?img=11',
    tag: '🎯 Phối đồ chuẩn gu',
    quote: 'Không nghĩ AI phối đồ giỏi vậy luôn 😳 Mặc đẹp mà không cần nghĩ, gu thời trang cực đỉnh!',
    subtext: 'Smart Wardrobe • Gen Z Trend'
  },
  {
    id: 4,
    name: 'Minh Trang',
    role: 'Content Creator',
    avatarUrl: 'https://i.pravatar.cc/150?img=5',
    tag: '♻️ Pass đồ 2hand chất lượng',
    quote: 'Pass được mấy cái áo không mặc 2 năm rồi, cộng đồng trên app rất chất lượng và uy tín! ❤️',
    subtext: 'Pre-loved Community • Circular Fashion'
  },
  {
    id: 5,
    name: 'Thảo An',
    role: 'Nhân viên văn phòng',
    avatarUrl: 'https://i.pravatar.cc/150?img=8',
    tag: '✨ Tiết kiệm cả tiếng đồng hồ',
    quote: 'Giờ mỗi sáng mở app là có outfit thanh lịch đi làm luôn, tiết kiệm cả tiếng đồng hồ 🔥',
    subtext: 'Office Look • Daily Assistant'
  },
  {
    id: 6,
    name: 'Tuấn Tú',
    role: 'UI/UX Designer',
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
    tag: '💎 Nâng cấp tủ đồ',
    quote: 'Cảm giác tủ đồ của mình được nâng cấp lên một level hoàn toàn khác, cực kỳ aesthetic.',
    subtext: 'Digital Closet • Aesthetics'
  },
  {
    id: 7,
    name: 'Lan Anh',
    role: 'Sinh viên RMIT',
    avatarUrl: 'https://i.pravatar.cc/150?img=9',
    tag: '🌱 Thời trang bền vững',
    quote: 'Vừa tiết kiệm, vừa mặc đẹp, lại còn bảo vệ môi trường nhờ tính năng pass đồ cũ thông minh.',
    subtext: 'Eco Fashion • Green Wardrobe'
  },
  {
    id: 8,
    name: 'Thảo Vy',
    role: 'Vlogger',
    avatarUrl: 'https://i.pravatar.cc/150?img=21',
    tag: '🪄 Bóc tách nền chuẩn xác',
    quote: 'Phân tách nền chuẩn xác dã man, tủ đồ số nhìn siêu gọn gàng và xịn xò vô cùng ✨',
    subtext: 'AI Cutout • High Precision'
  }
];

function wrapText(text, maxCharsPerLine = 22) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
      currentLine = (currentLine + ' ' + word).trim();
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

function escapeXml(unsafe) {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

async function fetchAvatarBase64(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const circleSvg = Buffer.from('<svg width="140" height="140"><circle cx="70" cy="70" r="70" fill="#fff"/></svg>');
    const cropped = await sharp(buffer)
      .resize(140, 140)
      .composite([{ input: circleSvg, blend: 'dest-in' }])
      .png()
      .toBuffer();
    return `data:image/png;base64,${cropped.toString('base64')}`;
  } catch (err) {
    console.warn('Avatar fetch error:', err.message);
    return null;
  }
}

async function generateCards() {
  for (const item of testimonials) {
    const avatarBase64 = await fetchAvatarBase64(item.avatarUrl);
    const quoteLines = wrapText(item.quote, 20);
    const lineHeight = 56;
    const totalTextHeight = quoteLines.length * lineHeight;
    // Center vertically in region between y=320 and y=680
    const startY = 320 + Math.round((360 - totalTextHeight) / 2) + 40;
    
    const quoteSvgLines = quoteLines.map((line, idx) => {
      return `<text x="65" y="${startY + idx * lineHeight}" font-family="Segoe UI, Arial, sans-serif" font-size="38" font-weight="700" fill="#FFFFFF" letter-spacing="-0.5">${escapeXml(line)}</text>`;
    }).join('\n');

    const svg = `
<svg width="700" height="900" viewBox="0 0 700 900" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad_${item.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#242220" />
      <stop offset="50%" stop-color="#181716" />
      <stop offset="100%" stop-color="#0E0D0C" />
    </linearGradient>
    <linearGradient id="borderGrad_${item.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#D9C5B2" stop-opacity="0.75" />
      <stop offset="40%" stop-color="#B8975A" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#D9C5B2" stop-opacity="0.2" />
    </linearGradient>
    <radialGradient id="glow_${item.id}" cx="25%" cy="20%" r="70%">
      <stop offset="0%" stop-color="#D9C5B2" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#D9C5B2" stop-opacity="0" />
    </radialGradient>
  </defs>

  <!-- Card Background -->
  <rect x="8" y="8" width="684" height="884" rx="42" fill="url(#bgGrad_${item.id})" />
  <rect x="8" y="8" width="684" height="884" rx="42" fill="url(#glow_${item.id})" />
  <rect x="8" y="8" width="684" height="884" rx="42" stroke="url(#borderGrad_${item.id})" stroke-width="2.5" />

  <!-- Top Accent Bar -->
  <rect x="65" y="55" width="45" height="4" rx="2" fill="#B8975A" />

  <!-- Header: Avatar + User Info -->
  <g transform="translate(65, 80)">
    <!-- Avatar circle ring -->
    <circle cx="58" cy="58" r="56" fill="none" stroke="#D9C5B2" stroke-width="2.5" stroke-opacity="0.8" />
    ${avatarBase64 ? `
    <image href="${avatarBase64}" x="8" y="8" width="100" height="100" preserveAspectRatio="xMidYMid slice" clip-path="url(#avatarClip_${item.id})" />
    <defs>
      <clipPath id="avatarClip_${item.id}">
        <circle cx="58" cy="58" r="50" />
      </clipPath>
    </defs>
    ` : `
    <circle cx="58" cy="58" r="50" fill="#B8975A" />
    <text x="58" y="68" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="bold" fill="#FFF" text-anchor="middle">${item.name.charAt(0)}</text>
    `}

    <!-- Author Name & Title -->
    <text x="135" y="48" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="700" fill="#FFFFFF">${escapeXml(item.name)}</text>
    <text x="135" y="78" font-family="Segoe UI, Arial, sans-serif" font-size="18" font-weight="400" fill="#B8B0A8">${escapeXml(item.role)}</text>
    
    <!-- Stars -->
    <g transform="translate(135, 92)">
      <text x="0" y="16" font-family="Segoe UI, Arial, sans-serif" font-size="19" fill="#E5C378" letter-spacing="4">★★★★★</text>
    </g>

    <!-- Verified Badge (Top Right) -->
    <g transform="translate(410, 15)">
      <rect x="0" y="0" width="155" height="36" rx="18" fill="rgba(217, 197, 178, 0.12)" stroke="rgba(217, 197, 178, 0.3)" stroke-width="1" />
      <circle cx="20" cy="18" r="5" fill="#B8975A" />
      <text x="34" y="23" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="600" fill="#D9C5B2">✓ Đã xác thực</text>
    </g>
  </g>

  <!-- Big Decorative Quote Mark -->
  <text x="50" y="265" font-family="Georgia, serif" font-size="120" font-weight="bold" fill="#D9C5B2" fill-opacity="0.16">“</text>

  <!-- Highlight Feature Tag -->
  <g transform="translate(65, 260)">
    <rect x="0" y="0" width="370" height="42" rx="21" fill="rgba(184, 151, 90, 0.18)" stroke="rgba(184, 151, 90, 0.4)" stroke-width="1.2" />
    <text x="24" y="27" font-family="Segoe UI, Arial, sans-serif" font-size="17" font-weight="600" fill="#D9C5B2">${escapeXml(item.tag)}</text>
  </g>

  <!-- Quote Content -->
  ${quoteSvgLines}

  <!-- Divider -->
  <line x1="65" y1="710" x2="635" y2="710" stroke="rgba(255, 255, 255, 0.12)" stroke-width="1.5" />

  <!-- Footer Branding -->
  <g transform="translate(65, 745)">
    <!-- Closy logo pill -->
    <rect x="0" y="0" width="100" height="34" rx="17" fill="#B8975A" />
    <text x="50" y="23" font-family="Segoe UI, Arial, sans-serif" font-size="14" font-weight="800" fill="#1A1A1A" text-anchor="middle" letter-spacing="1.5">CLOSY</text>
    
    <text x="120" y="23" font-family="Segoe UI, Arial, sans-serif" font-size="16" font-weight="500" fill="#948D85">Smart Wardrobe &amp; AI Stylist</text>
  </g>

  <text x="65" y="835" font-family="Segoe UI, Arial, sans-serif" font-size="13" font-weight="600" fill="#6B645D" letter-spacing="2">${escapeXml(item.subtext.toUpperCase())}</text>
</svg>
`;

    const destPath = path.join(outDir, `card-${item.id}.png`);
    await sharp(Buffer.from(svg)).png().toFile(destPath);
    console.log(`Saved: card-${item.id}.png with real avatar`);
  }
  console.log('All 8 cards generated successfully!');
}

generateCards().catch(console.error);
