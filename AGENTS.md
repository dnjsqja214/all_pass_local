<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# ALLPASS Design & Development Rules

## 1. Color Palette

* **Primary Red**: `#C93A35` (Point Color)
* **Dark Background**: `#151515`
* **Main Background**: `#F6F4F0` (Warm Ivory)
* **Card Background**: `#FFFFFF`
* **Border**: `#E4E0D9` (Thin, light borders over heavy shadows)
* **Success Green**: `#3F7D4E`
* **Warning Red**: `#D93D35`
* **Text Primary**: `#111111`
* **Text Secondary**: `#817D76`

## 2. Design Styles

* Warm ivory background (`#F6F4F0`) with white card panels (`#FFFFFF`).
* Bold, dark headers and prominent score/stats numbers.
* Card corners: `rounded-xl` or `rounded-2xl`.
* Minimal shadows; focus on thin `#E4E0D9` borders.
* Mobile view: Clean, simple educational app interface.
* Desktop view: Full-featured administrator/dashboard style.

## 3. Responsive Rules

### Mobile (< 768px)

* Bottom navigation tab bar.
* Stacked list layout (1 card per row).
* 16px lateral padding.
* Full-width block buttons.
* Safe bottom padding to avoid tab bar overlay.

### Desktop (>= 1024px)

* Left sidebar or top navigation bar.
* Bottom tab bar must be hidden.
* Max content width: 1440px.
* Content must be horizontally centered.
* Use grid-based card placement where appropriate.
* Desktop layouts must be restructured for desktop use.
* Do not simply stretch mobile components to fill desktop width.

## 4. Component and CSS Separation Rules

* Do not write long Tailwind utility class lists directly inside TSX.
* Component structure and styling must be separated.
* CSS files must use the `.module.css` extension.
* Import the CSS Module into the component and apply styles through the imported `styles` object.
* Do not create a single large CSS file containing styles for unrelated components.
* Global styles must only contain reset styles, CSS variables, fonts, and truly global layout rules.
* Component-specific responsive styles must remain inside that component's CSS Module.
* Inline styles are prohibited except when a value must be calculated dynamically at runtime.
* Repeated colors, spacing values, and layout values should use CSS variables defined in the global theme where appropriate.
* Existing CSS Modules must be reused or extended before creating duplicate styles.

### Required Example Structure

```text
components/
├─ ExamCard.tsx
├─ ExamCard.module.css
├─ Sidebar.tsx
├─ Sidebar.module.css
├─ CommonButton.tsx
└─ CommonButton.module.css
```

### Required Component Example

```tsx
import styles from './ExamCard.module.css';

interface ExamCardProps {
  title: string;
  year: number;
  round: number;
}

export default function ExamCard({
  title,
  year,
  round,
}: ExamCardProps) {
  return (
    <article className={styles.card}>
      <h2 className={styles.title}>{title}</h2>

      <div className={styles.information}>
        <span>{year}년</span>
        <span>{round}회</span>
      </div>
    </article>
  );
}
```

```css
.card {
  padding: 20px;
  background: var(--color-card-background);
  border: 1px solid var(--color-border);
  border-radius: 16px;
}

.title {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 20px;
  font-weight: 700;
}

.information {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  color: var(--color-text-secondary);
}

@media (max-width: 767px) {
  .card {
    padding: 16px;
  }
}
```

## 5. Page and Component Responsibility

* Files inside `app/` should primarily handle routing, layouts, server data loading, and page composition.
* Large UI sections must not be implemented entirely inside `page.tsx`.
* Reusable or independently meaningful UI sections must be extracted into components.
* Page-specific components may be placed in a local `_components` folder near the page.
* Components shared by multiple pages must be placed in the common `components` directory.
* Business logic, API requests, mock data, and UI rendering should not all be placed in one file.

### Page-Specific Example

```text
app/
└─ exam/
   ├─ page.tsx
   ├─ _components/
   │  ├─ ExamFilter/
   │  │  ├─ ExamFilter.tsx
   │  │  └─ ExamFilter.module.css
   │  └─ ExamList/
   │     ├─ ExamList.tsx
   │     └─ ExamList.module.css
   └─ _constants/
      └─ examMocks.ts
```

## 6. Development Requirements

* Use Next.js App Router.
* Use TypeScript.
* Use CSS Modules for component-specific styling.
* Tailwind CSS may only be used for small, temporary, or highly generic utility styling.
* Prefer CSS Modules over long Tailwind class combinations.
* Use `lucide-react` for icons.
* Maintain absolute type safety.
* Never use `any`.
* Extract data arrays, menu configurations, filters, and mock values into constants or separate mock files.
* Do not hardcode repeated data directly inside TSX.
* Maintain the existing project directory structure.
* Do not alter existing functionality unless explicitly instructed.
* Before creating a new component, check whether a similar shared component already exists.
* Before modifying Next.js-specific code, read the relevant guide in `node_modules/next/dist/docs/`.
