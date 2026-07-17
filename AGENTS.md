<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# ALLPASS Design & Development Rules

## 1. Color Palette
- **Primary Red**: `#C93A35` (Point Color)
- **Dark Background**: `#151515`
- **Main Background**: `#F6F4F0` (Warm Ivory)
- **Card Background**: `#FFFFFF`
- **Border**: `#E4E0D9` (Thin, light borders over heavy shadows)
- **Success Green**: `#3F7D4E`
- **Warning Red**: `#D93D35`
- **Text Primary**: `#111111`
- **Text Secondary**: `#817D76`

## 2. Design Styles
- Warm ivory background (`#F6F4F0`) with white card panels (`#FFFFFF`).
- Bold, dark headers and prominent score/stats numbers.
- Card corners: `rounded-xl` or `rounded-2xl`.
- Minimal shadows; focus on thin `#E4E0D9` borders.
- Mobile view: Clean, simple educational app interface.
- Desktop view: Full-featured administrator/dashboard style.

## 3. Responsive Rules
- **Mobile (< 768px)**:
  - Bottom navigation tab bar.
  - Stacked list layout (1 card per row).
  - 16px lateral padding (`px-4`).
  - Full-width block buttons.
  - Safe bottom padding to avoid tab bar overlay.
- **Desktop (>= 1024px)**:
  - Left sidebar or top navigation bar (Bottom tab bar is hidden).
  - Max content width: 1440px, horizontally centered.
  - Grid card placement.
  - Re-structured desktop information layouts (no simple stretching of mobile widgets).

## 4. Development Requirements
- Next.js App Router, TypeScript, Tailwind CSS.
- Icons: Use `lucide-react`.
- Type Safety: Absolute type safety (no `any`).
- Data: Extract data arrays and config variables into mock sets or separate constants; do not hardcode directly into TSX.
- Structural Integrity: Maintain existing project directory structure and do not alter existing functionalities unless instructed.

