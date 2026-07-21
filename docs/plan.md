You are a senior Next.js TypeScript developer. Refactor the UI of this project into a consistent rounded, soft, modern fashion-tech design system.

Context:
- The current UI is too angular and inconsistent.
- The app has mixed English/Vietnamese UI text.
- `globals.css` is messy and contains inconsistent styles.
- UI base components are not visually consistent.
- The app should use Be Vietnam Pro as the global font.
- The color palette must be limited to black, white, gray, and the accent color `#D9C5B2`.
- This is a Next.js + TypeScript project.

Main goals:
1. Refactor the global styling foundation.
2. Set Be Vietnam Pro as the global font using `next/font/google`.
3. Clean and normalize `globals.css`.
4. Create consistent design tokens for:
   - background
   - foreground
   - card
   - muted
   - border
   - input
   - primary
   - secondary
   - accent
   - destructive
   - radius
5. Use this exact color direction:
   - primary black: `#111111`
   - white: `#FFFFFF`
   - background: `#FAFAFA`
   - gray surface: `#F3F4F6`
   - border: `#E5E7EB`
   - muted text: `#6B7280`
   - accent: `#D9C5B2`
   - accent soft: `#F4EEE8`
   - accent hover: `#CDB39D`
6. Make the entire UI more rounded:
   - cards: `rounded-2xl`
   - buttons: `rounded-full` or `rounded-xl` depending on context
   - inputs/selects/textareas: `rounded-xl`
   - image frames: `rounded-2xl overflow-hidden`
   - dialogs/sheets/dropdowns: `rounded-2xl` or `rounded-xl`
   - badges: `rounded-full`
7. Normalize hover, active, and focus-visible states.
8. Keep the UI clean, soft, minimal, premium, and fashion-tech.
9. Do not change business logic.
10. Do not change API contracts.
11. Do not change route structure.
12. Do not rename variables, functions, types, interfaces, routes, or files into Vietnamese.
13. UI copy can be Vietnamese, but all code identifiers must stay English.
14. Avoid large risky rewrites.
15. Do not create collapsed formatting or broken one-line code.
16. Preserve proper LF newlines.
17. Run Prettier on changed files.

Implementation strategy:
- First inspect the project structure.
- Start with `app/layout.tsx` or `src/app/layout.tsx` and global font setup.
- Then clean `globals.css`.
- Then refactor shared UI components in `src/components/ui`.
- Then migrate feature components page by page.
- Prefer reusable class patterns and component variants instead of repeated hard-coded classes.
- Do not modify unrelated logic.
- Keep changes small and reviewable.

Important:
- Do not replace code using unsafe global string replacement.
- Do not convert `\r\n` into literal text.
- Do not output escaped newline text into source files.
- Preserve real line breaks.
- Do not collapse multiple imports or statements into one line.
- Do not touch generated files.
- Do not modify package manager lockfiles unless a dependency is actually added.
- Do not add a new UI library unless absolutely necessary.
- Do not rename English identifiers to Vietnamese.
- Do not change backend/API naming.
- Do not change Zustand store names, query keys, service names, or route params unless required for a compile fix.
- Do not use random colors outside black, white, gray, and `#D9C5B2` for the main UI.

Recommended order:
1. Audit current UI and globals.
2. Add Be Vietnam Pro font.
3. Normalize `globals.css`.
4. Refactor Button.
5. Refactor Card.
6. Refactor Input/Textarea/Select.
7. Refactor Dialog/Sheet/Dropdown/Tooltip.
8. Refactor Avatar/Badge/Tabs.
9. Refactor image containers/cards in wardrobe/outfit/community/profile pages.
10. Normalize UI copy.
11. Run:
   - npm run lint
   - npm run type-check if available
   - npm run build
   - npx prettier --write <changed-files>
12. Provide a summary of changed files and remaining risky areas.

Acceptance criteria:
- All pages use Be Vietnam Pro.
- The UI color palette uses black, white, gray, and `#D9C5B2` as the only main accent.
- UI no longer looks angular.
- Cards, buttons, inputs, modals, and image frames have consistent rounded styling.
- Hover states feel soft and consistent.
- No mixed Vietnamese/English text in the same UI area unless it is a brand/feature term.
- No business logic is changed.
- No route is broken.
- No TypeScript errors are introduced.
- No collapsed formatting or broken imports.
```

---

## 19. Prompt chạy từng batch

```md
Refactor only these files in this batch. Keep the changes focused on UI consistency, rounded design, Be Vietnam Pro compatibility, black/white/gray/`#D9C5B2` color tokens, and style cleanup.

Rules:
- Do not change logic.
- Do not rename variables/functions/types.
- Do not translate code identifiers into Vietnamese.
- Only UI display text may be normalized.
- Preserve real newlines.
- Do not generate literal `\r\n`.
- Do not collapse imports or JSX into unreadable one-line code.
- Do not use colors outside black, white, gray, and `#D9C5B2` for the main UI.
- Run Prettier after editing.

Files:
- <paste file paths here>

Goal:
- Apply consistent rounded design.
- Use existing design tokens from globals.css.
- Remove local inconsistent styles where possible.
- Keep TypeScript valid.
```

---

## 20. Checklist sau mỗi batch

```txt
[ ] Không đổi logic
[ ] Không đổi API call
[ ] Không đổi route
[ ] Không đổi query key
[ ] Không đổi Zustand store name
[ ] Không đổi type/interface nếu không cần
[ ] Không đổi tên biến sang tiếng Việt
[ ] Font dùng Be Vietnam Pro
[ ] Không hard-code font riêng
[ ] Không dùng màu ngoài black/white/gray/#D9C5B2 cho main UI
[ ] Không dùng rounded lung tung
[ ] Card/button/input/image frame đã bo tròn đồng nhất
[ ] Hover mềm và thống nhất
[ ] Focus-visible vẫn còn
[ ] Không để text English/Vietnamese lẫn lộn trong cùng một cụm UI
[ ] Không xuất hiện literal `\r\n`
[ ] Không dính import thành một dòng lỗi
[ ] File đã format bằng Prettier
[ ] `npm run lint` pass
[ ] `npm run build` pass
```

---

## 21. Lưu ý đặc biệt để tránh lỗi formatting

Vì dự án từng gặp lỗi code bị dính dòng / literal newline, cần yêu cầu Codex:

```txt
Do not perform unsafe global replacement.
Do not write escaped newline characters into source files.
Do not convert line endings into literal text.
Preserve real line breaks.
Format each changed file with Prettier immediately after editing.
Make small incremental changes.
Stop after each batch and report changed files.
```

Không nên yêu cầu:

```txt
Refactor all UI files at once.
Rewrite the whole src folder.
Translate all code to Vietnamese.
Replace all rounded classes globally.
Replace all colors globally.
```

Vì những lệnh này dễ gây lỗi format, vỡ layout hoặc đổi nhầm logic.

---

## 22. Kết luận

Hướng làm an toàn nhất:

```txt
Foundation first
UI primitives second
Feature pages third
Copy normalization last
Lint/build after every batch
```

Không nên sửa từng page theo cảm tính. Khi `globals.css`, font, color token và UI primitive đã chuẩn, các page phía sau chỉ cần migrate dần về token và component base là giao diện sẽ đồng nhất, mềm hơn, hiện đại hơn và ít rủi ro hơn.