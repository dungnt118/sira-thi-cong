# Layout Specification - Admin Role

**Version:** 1.0  
**Role:** Admin (System Administrator)  
**Platform:** Desktop-only  
**Last Updated:** 12/02/2026  

---

## 1. DESIGN PHILOSOPHY

### Desktop-Only Strategy
The Admin role is **exclusively desktop-based**. Unlike operational roles that require mobile access, system administration tasks demand:

- **Large screens** for complex configurations
- **Multiple windows** for reference and editing
- **Keyboard shortcuts** for power users
- **Advanced UI components** (tree views, code editors, drag & drop)
- **Data-dense interfaces** for efficiency

**No Mobile Support:** Admin tasks are too complex for mobile devices. All wireframes and components are optimized for desktop only.

---

## 2. RESPONSIVE BREAKPOINTS

### Desktop Breakpoints
```css
/* Large Desktop (Primary) */
@media (min-width: 1920px) {
  /* Optimal: 1920x1080 */
}

/* Standard Desktop */
@media (min-width: 1280px) and (max-width: 1919px) {
  /* Common: 1366x768, 1440x900, 1600x900 */
}

/* Minimum Desktop */
@media (min-width: 1024px) and (max-width: 1279px) {
  /* Minimum supported: 1024x768 */
}
```

**No Tablet/Mobile:** Admin interface does not support screens below 1024px width.

---

## 3. GRID SYSTEM

### 12-Column Grid
```
Container: 1200px - 1800px (fluid)
Columns: 12
Gutter: 24px
Margin: 48px (large), 32px (standard), 24px (minimum)
```

### Layout Patterns
```
┌─────────────────────────────────────────────────┐
│  Top Bar (64px height)                          │
├────────┬────────────────────────────────────────┤
│  Side  │  Main Content Area                     │
│  Nav   │                                        │
│  240px │  Breadcrumbs (40px)                    │
│        │  ─────────────────────────────────────  │
│        │                                        │
│        │  Page Content                          │
│        │                                        │
│        │                                        │
│        │                                        │
└────────┴────────────────────────────────────────┘
```

---

## 4. SPACING SYSTEM

### Scale (8px base)
```
xs:  4px   (tight spacing)
sm:  8px   (compact)
md:  16px  (standard)
lg:  24px  (comfortable)
xl:  32px  (spacious)
2xl: 48px  (section dividers)
3xl: 64px  (page sections)
```

### Component Spacing
- **Form fields:** 16px vertical gap
- **Card padding:** 24px
- **Section spacing:** 48px
- **Page margins:** 48px (large), 32px (standard)

---

## 5. TYPOGRAPHY

### Font Family
```css
--font-primary: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'Roboto Mono', 'Courier New', monospace;
```

### Type Scale
```
H1: 32px / 40px (Page titles)
H2: 24px / 32px (Section headers)
H3: 20px / 28px (Subsection headers)
H4: 16px / 24px (Card titles)
Body: 14px / 20px (Default text)
Small: 12px / 16px (Helper text, labels)
Code: 13px / 18px (Code snippets)
```

### Font Weights
```
Regular: 400 (Body text)
Medium: 500 (Labels, emphasis)
Semibold: 600 (Headings)
Bold: 700 (Strong emphasis)
```

---

## 6. COLOR SYSTEM

### Brand Colors
```css
--primary: #1976D2;      /* Blue */
--primary-light: #42A5F5;
--primary-dark: #1565C0;

--secondary: #424242;    /* Gray */
--secondary-light: #616161;
--secondary-dark: #212121;
```

### Semantic Colors
```css
--success: #4CAF50;      /* Green */
--warning: #FF9800;      /* Orange */
--error: #F44336;        /* Red */
--info: #2196F3;         /* Light Blue */
```

### Neutral Colors
```css
--gray-50: #FAFAFA;
--gray-100: #F5F5F5;
--gray-200: #EEEEEE;
--gray-300: #E0E0E0;
--gray-400: #BDBDBD;
--gray-500: #9E9E9E;
--gray-600: #757575;
--gray-700: #616161;
--gray-800: #424242;
--gray-900: #212121;
```

### Background Colors
```css
--bg-page: #F5F5F5;      /* Page background */
--bg-card: #FFFFFF;      /* Card/panel background */
--bg-hover: #F5F5F5;     /* Hover state */
--bg-selected: #E3F2FD;  /* Selected row */
```

---

## 7. NAVIGATION

### Top Bar (64px height)
```
┌─────────────────────────────────────────────────┐
│ [Logo] [App Name]          [Search] [🔔] [👤]  │
└─────────────────────────────────────────────────┘
```

**Components:**
- Logo + App Name (left)
- Global Search (center-right)
- Notifications (icon + badge)
- User Profile (avatar + dropdown)

### Side Navigation (240px width)
```
┌────────────┐
│ 👥 Users   │
│ 🏢 Org     │
│ 📊 Data    │
│ 🔧 System  │
│ 🔒 Security│
│ 📈 Monitor │
│ ⚙️  Settings│
└────────────┘
```

**Features:**
- Collapsible groups
- Active state highlighting
- Icon + label
- Keyboard navigation (arrow keys)

### Breadcrumbs (40px height)
```
Home > Users > Edit User > John Doe
```

**Behavior:**
- Show full path
- Clickable segments
- Truncate middle segments if too long
- Always show first and last

---

## 8. ADVANCED COMPONENTS

### 8.1 Tree View

**Use Cases:** Organization structure, menu hierarchy, file browser

**Features:**
- Expand/collapse nodes
- Drag & drop reordering
- Multi-select
- Context menu (right-click)
- Keyboard navigation

**Visual Design:**
```
┌─────────────────────────────┐
│ ▼ Root Department           │
│   ├─ ▼ Sales                │
│   │   ├─ North Region       │
│   │   └─ South Region       │
│   └─ ▶ Engineering          │
└─────────────────────────────┘
```

**Specifications:**
- Indent: 24px per level
- Icon size: 16x16px
- Row height: 36px
- Hover: Light gray background
- Selected: Blue background

---

### 8.2 Code Editor

**Use Cases:** JavaScript triggers, JSON configs, CSS styles

**Features:**
- Syntax highlighting
- Line numbers
- Auto-complete
- Error highlighting
- Find & replace
- Fullscreen mode

**Visual Design:**
```
┌─────────────────────────────────────┐
│ 1 | function validateUser(data) {  │
│ 2 |   if (!data.email) {            │
│ 3 |     return { valid: false };    │
│ 4 |   }                              │
│ 5 |   return { valid: true };       │
│ 6 | }                                │
└─────────────────────────────────────┘
```

**Specifications:**
- Font: Roboto Mono, 13px
- Line height: 18px
- Gutter width: 48px
- Tab size: 2 spaces
- Theme: Light (default), Dark (optional)

---

### 8.3 Data Grid (Advanced Table)

**Use Cases:** User list, schema list, audit logs

**Features:**
- Sortable columns
- Filterable columns
- Inline editing
- Multi-select rows
- Bulk actions
- Column reordering
- Column resizing
- Export (CSV, Excel)

**Visual Design:**
```
┌─────────────────────────────────────────────────┐
│ [☑] Name ↓    Email         Role      Actions  │
├─────────────────────────────────────────────────┤
│ [☑] John Doe  john@ex.com   Admin     [Edit]   │
│ [☐] Jane Doe  jane@ex.com   User      [Edit]   │
│ [☐] Bob Smith bob@ex.com    Manager   [Edit]   │
└─────────────────────────────────────────────────┘
```

**Specifications:**
- Header height: 48px
- Row height: 56px
- Checkbox: 20x20px
- Sort icon: 16x16px
- Hover: Light gray background
- Selected: Blue background

---

### 8.4 Form Wizard (Multi-Step)

**Use Cases:** User creation, schema builder, integration setup

**Features:**
- Step indicator
- Previous/Next navigation
- Validation per step
- Save draft
- Review before submit

**Visual Design:**
```
┌─────────────────────────────────────────────────┐
│ ● Basic Info ─── ○ Permissions ─── ○ Review    │
├─────────────────────────────────────────────────┤
│                                                 │
│  [Form fields for current step]                │
│                                                 │
│                                                 │
│                    [Cancel] [Previous] [Next]  │
└─────────────────────────────────────────────────┘
```

**Specifications:**
- Step indicator height: 64px
- Active step: Blue circle
- Completed step: Blue circle with checkmark
- Inactive step: Gray circle
- Line between steps: 2px

---

### 8.5 Drag & Drop Builder

**Use Cases:** Menu management, workflow designer, form builder

**Features:**
- Drag items from palette
- Drop into canvas
- Reorder by dragging
- Delete by dragging to trash
- Visual feedback during drag

**Visual Design:**
```
┌──────────────┬──────────────────────────────┐
│  Palette     │  Canvas                      │
│              │                              │
│  [Button]    │  ┌────────────────┐          │
│  [Input]     │  │ Header         │          │
│  [Select]    │  ├────────────────┤          │
│  [Checkbox]  │  │ Name: [_____]  │          │
│              │  │ Email: [_____] │          │
│              │  └────────────────┘          │
└──────────────┴──────────────────────────────┘
```

**Specifications:**
- Palette width: 240px
- Item height: 48px
- Drag ghost: Semi-transparent
- Drop zone: Dashed border
- Hover: Blue highlight

---

### 8.6 Modal Dialogs

**Use Cases:** Confirmations, complex forms, detail views

**Sizes:**
- Small: 400px width
- Medium: 600px width
- Large: 800px width
- Extra Large: 1000px width
- Fullscreen: 100% viewport

**Visual Design:**
```
┌─────────────────────────────────────────────────┐
│  Modal Title                               [×]  │
├─────────────────────────────────────────────────┤
│                                                 │
│  Modal content...                              │
│                                                 │
│                                                 │
│                    [Cancel] [Save]             │
└─────────────────────────────────────────────────┘
```

**Specifications:**
- Header height: 56px
- Footer height: 64px
- Padding: 24px
- Overlay: rgba(0,0,0,0.5)
- Border-radius: 8px
- Shadow: 0 8px 16px rgba(0,0,0,0.2)

---

### 8.7 Tabs

**Use Cases:** Settings pages, detail views with multiple sections

**Visual Design:**
```
┌─────────────────────────────────────────────────┐
│ [General] [Security] [Notifications] [Advanced]│
├─────────────────────────────────────────────────┤
│                                                 │
│  Tab content...                                │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Specifications:**
- Tab height: 48px
- Active tab: Blue bottom border (3px)
- Inactive tab: Gray text
- Hover: Light gray background

---

### 8.8 Accordion

**Use Cases:** FAQ, collapsible sections, settings groups

**Visual Design:**
```
┌─────────────────────────────────────────────────┐
│ ▼ General Settings                              │
│   [Settings content...]                         │
├─────────────────────────────────────────────────┤
│ ▶ Security Settings                             │
├─────────────────────────────────────────────────┤
│ ▶ Email Settings                                │
└─────────────────────────────────────────────────┘
```

**Specifications:**
- Header height: 56px
- Icon size: 16x16px
- Padding: 16px
- Border: 1px solid gray-300
- Transition: 300ms ease

---

## 9. FORM COMPONENTS

### Input Fields
```
┌─────────────────────────────┐
│ Label *                     │
│ ┌─────────────────────────┐ │
│ │ Placeholder text        │ │
│ └─────────────────────────┘ │
│ Helper text                 │
└─────────────────────────────┘
```

**Specifications:**
- Height: 40px
- Border: 1px solid gray-400
- Border-radius: 4px
- Padding: 8px 12px
- Focus: Blue border (2px)
- Error: Red border

### Select Dropdown
```
┌─────────────────────────────┐
│ Label                       │
│ ┌─────────────────────────┐ │
│ │ Select option...      ▼ │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

### Checkbox & Radio
```
☑ Checkbox label
○ Radio option 1
○ Radio option 2
```

### Toggle Switch
```
Label: ⚪──── OFF
Label: ────⚪ ON
```

---

## 10. BUTTONS

### Button Sizes
```
Small:  32px height, 12px padding
Medium: 40px height, 16px padding (default)
Large:  48px height, 20px padding
```

### Button Variants
```
Primary:   Blue background, white text
Secondary: Gray background, dark text
Outlined:  Transparent bg, blue border
Text:      Transparent bg, blue text
Danger:    Red background, white text
```

### Button States
```
Default:  Normal appearance
Hover:    Darker background
Active:   Even darker background
Disabled: Gray background, gray text, cursor not-allowed
Loading:  Spinner icon, disabled
```

---

## 11. CARDS & PANELS

### Card
```
┌─────────────────────────────┐
│ Card Title                  │
├─────────────────────────────┤
│                             │
│ Card content...             │
│                             │
└─────────────────────────────┘
```

**Specifications:**
- Border: 1px solid gray-300
- Border-radius: 8px
- Padding: 24px
- Shadow: 0 2px 4px rgba(0,0,0,0.1)
- Background: White

### Panel (No Border)
```
┌─────────────────────────────┐
│ Panel Title                 │
│ ─────────────────────────── │
│                             │
│ Panel content...            │
│                             │
└─────────────────────────────┘
```

**Specifications:**
- No border
- Border-radius: 0
- Padding: 0
- Background: Transparent
- Divider: 1px solid gray-300

---

## 12. FEEDBACK COMPONENTS

### Toast Notifications
```
┌─────────────────────────────┐
│ ✅ Success message          │
└─────────────────────────────┘

┌─────────────────────────────┐
│ ⚠️  Warning message         │
└─────────────────────────────┘

┌─────────────────────────────┐
│ ❌ Error message            │
└─────────────────────────────┘
```

**Specifications:**
- Position: Top-right
- Width: 360px
- Duration: 3s (success), 5s (error)
- Animation: Slide in from right
- Dismissible: Click × to close

### Loading Indicators
```
Spinner: ⟳ (rotating circle)
Progress Bar: ████░░░░░░ 40%
Skeleton: ▓▓▓▓▓░░░░░ (pulsing)
```

### Empty States
```
┌─────────────────────────────┐
│         📭                  │
│    No data found            │
│  [Create New Item]          │
└─────────────────────────────┘
```

---

## 13. KEYBOARD SHORTCUTS

### Global
- `Ctrl+S`: Save
- `Ctrl+N`: New item
- `Ctrl+F`: Search
- `Ctrl+K`: Quick command palette
- `Esc`: Close modal/dialog
- `F5`: Refresh data

### Navigation
- `Tab`: Next field
- `Shift+Tab`: Previous field
- `Arrow Keys`: Navigate lists/trees
- `Enter`: Select/submit
- `Space`: Toggle checkbox

### Data Grid
- `Ctrl+A`: Select all
- `Ctrl+Click`: Multi-select
- `Shift+Click`: Range select
- `Delete`: Delete selected rows

---

## 14. ACCESSIBILITY (WCAG 2.1 AA)

### Color Contrast
- Text: Minimum 4.5:1 ratio
- Large text (18px+): Minimum 3:1 ratio
- UI components: Minimum 3:1 ratio

### Keyboard Navigation
- All interactive elements focusable
- Visible focus indicators
- Logical tab order
- Skip to main content link

### Screen Readers
- Semantic HTML (headings, landmarks)
- ARIA labels for icons
- Alt text for images
- Form labels associated with inputs

### Focus Management
- Focus visible: 2px blue outline
- Focus trapped in modals
- Focus restored after modal close

---

## 15. PERFORMANCE

### Loading Strategies
- **Lazy load:** Load data on demand
- **Pagination:** 20 items per page (default)
- **Virtual scrolling:** For large lists (1000+ items)
- **Debounce:** Search input (500ms)
- **Throttle:** Scroll events (100ms)

### Caching
- Cache frequently accessed data (roles, departments)
- Cache duration: 5 minutes
- Invalidate on data change

### Code Splitting
- Load routes on demand
- Load heavy components (code editor) lazily
- Preload critical routes

---

## 16. BROWSER SUPPORT

### Supported Browsers
- Chrome 90+ (recommended)
- Firefox 88+
- Edge 90+
- Safari 14+

### Not Supported
- Internet Explorer (any version)
- Mobile browsers

---

**Status:** ✅ Complete  
**Platform:** Desktop-only (1024px minimum)  
**Components:** 15+ advanced UI components  
**Accessibility:** WCAG 2.1 AA compliant
